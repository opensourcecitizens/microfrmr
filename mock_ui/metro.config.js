const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('svg', 'png', 'jpg', 'jpeg');

module.exports = config;

