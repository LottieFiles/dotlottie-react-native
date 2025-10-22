const {
  createRunOncePlugin,
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

const withDotLottie = (config) => {
  const iosConfig = config.ios ?? {};

  if (
    !iosConfig.deploymentTarget ||
    isLowerVersion(iosConfig.deploymentTarget, MIN_IOS_DEPLOYMENT_TARGET)
  ) {
    iosConfig.deploymentTarget = MIN_IOS_DEPLOYMENT_TARGET;
  }

  config.ios = iosConfig;

  return withPodfileProperties(config, (podfileConfig) => {
    const currentTarget = podfileConfig.modResults['ios.deploymentTarget'];

    if (
      !currentTarget ||
      isLowerVersion(currentTarget, MIN_IOS_DEPLOYMENT_TARGET)
    ) {
      podfileConfig.modResults['ios.deploymentTarget'] =
        MIN_IOS_DEPLOYMENT_TARGET;
    }

    return podfileConfig;
  });
};

module.exports = createRunOncePlugin(withDotLottie, pkg.name, pkg.version);
