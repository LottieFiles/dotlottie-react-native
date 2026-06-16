const fs = require('fs');
const path = require('path');
const {
  createRunOncePlugin,
  withDangerousMod,
  withPodfileProperties,
} = require('@expo/config-plugins');
const pkg = require('../package.json');

/**
 * Expo config plugin scaffold for @lottiefiles/dotlottie-react-native.
 *
 * The plugin is currently a no-op placeholder so we can layer in native
 * configuration (Gradle / Podfile tweaks) without changing consumer setups.
 * Exported via createRunOncePlugin to avoid applying the same modifications
 * multiple times during prebuild.
 */
const MIN_IOS_DEPLOYMENT_TARGET = '15.4';

const versionToTuple = (value) =>
  (value ?? '')
    .split('.')
    .map((segment) => Number.parseInt(segment, 10))
    .filter((segment) => Number.isFinite(segment));

const isLowerVersion = (current, minimum) => {
  const currentParts = versionToTuple(current);
  const minimumParts = versionToTuple(minimum);
  const length = Math.max(currentParts.length, minimumParts.length);

  for (let index = 0; index < length; index += 1) {
    const currentValue = currentParts[index] ?? 0;
    const minimumValue = minimumParts[index] ?? 0;

    if (currentValue === minimumValue) {
      continue;
    }

    return currentValue < minimumValue;
  }

  return false;
};

const EMBED_CALL = '    dotlottie_embed_frameworks!(installer)';

// Path to the Ruby helper (without the `.rb` extension Ruby's `require` adds).
const EMBED_HELPER = path.join(__dirname, '..', 'scripts', 'dotlottie_embed');

// Builds the Podfile `require` line. We point at the helper by a path relative
// to the Podfile (ios dir) rather than `node --print require.resolve(...)`,
// because that resolves correctly whether the package is installed under
// node_modules (real consumers) or linked as a workspace (this monorepo).
const buildEmbedRequire = (podfileDir) => {
  let rel = path.relative(podfileDir, EMBED_HELPER);
  if (!rel.startsWith('.')) {
    rel = `./${rel}`;
  }
  return `require File.expand_path("${rel}", __dir__)`;
};

/**
 * Injects the dotLottie embed helper into the prebuild-generated ios/Podfile.
 *
 * Expo regenerates the Podfile on every prebuild, so this runs as a dangerous
 * mod each time. It is idempotent: it adds a `require` for the package's Ruby
 * helper after the leading requires, and calls `dotlottie_embed_frameworks!`
 * inside the existing `post_install do |installer|` block. The helper copies the
 * SPM-built DotLottiePlayer.framework into the app bundle so CLI builds find its
 * executable.
 */
const withDotLottiePodfileEmbed = (config) =>
  withDangerousMod(config, [
    'ios',
    (modConfig) => {
      const podfilePath = path.join(
        modConfig.modRequest.platformProjectRoot,
        'Podfile'
      );
      let contents = fs.readFileSync(podfilePath, 'utf8');

      if (!contents.includes('scripts/dotlottie_embed')) {
        const requireLine = buildEmbedRequire(path.dirname(podfilePath));
        const requireAnchor = contents.lastIndexOf('\nrequire ');
        if (requireAnchor !== -1) {
          const lineEnd = contents.indexOf('\n', requireAnchor + 1);
          const insertAt = lineEnd === -1 ? contents.length : lineEnd;
          contents = `${contents.slice(0, insertAt)}\n${requireLine}${contents.slice(insertAt)}`;
        } else {
          contents = `${requireLine}\n${contents}`;
        }
      }

      if (!contents.includes('dotlottie_embed_frameworks!')) {
        contents = contents.replace(
          /(post_install do \|installer\|\n)/,
          `$1${EMBED_CALL}\n`
        );
      }

      fs.writeFileSync(podfilePath, contents);
      return modConfig;
    },
  ]);

const withDotLottie = (config) => {
  const iosConfig = config.ios ?? {};

  if (
    !iosConfig.deploymentTarget ||
    isLowerVersion(iosConfig.deploymentTarget, MIN_IOS_DEPLOYMENT_TARGET)
  ) {
    iosConfig.deploymentTarget = MIN_IOS_DEPLOYMENT_TARGET;
  }

  config.ios = iosConfig;

  config = withDotLottiePodfileEmbed(config);

  return withPodfileProperties(config, (podfileConfig) => {
    const currentTarget = podfileConfig.modResults['ios.deploymentTarget'];

    if (
      !currentTarget ||
      isLowerVersion(currentTarget, MIN_IOS_DEPLOYMENT_TARGET)
    ) {
      podfileConfig.modResults['ios.deploymentTarget'] =
        MIN_IOS_DEPLOYMENT_TARGET;
    }

    // The iOS player is a Swift Package (DotLottie). Linking it under static
    // libraries archives its objects more than once into the consumer target,
    // producing thousands of duplicate-symbol errors. Dynamic frameworks give
    // each module a single shared image, so force dynamic linkage unless the
    // app has explicitly chosen a value already.
    if (!podfileConfig.modResults['ios.useFrameworks']) {
      podfileConfig.modResults['ios.useFrameworks'] = 'dynamic';
    }

    return podfileConfig;
  });
};

module.exports = createRunOncePlugin(withDotLottie, pkg.name, pkg.version);
