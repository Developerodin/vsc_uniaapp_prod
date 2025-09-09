const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
