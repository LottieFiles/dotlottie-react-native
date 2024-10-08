const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'lottie'],
  },
};

const mergedConfig = mergeConfig(defaultConfig, config);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = getConfig(mergedConfig, {
  root,
  pkg,
  project: __dirname,
});
