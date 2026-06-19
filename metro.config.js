// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
// Add wasm asset support
config.resolver.assetExts.push('wasm');

// Intercept and mock .node imports on web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName.endsWith('.node') || moduleName.includes('SQLiteModule.node'))) {
    return {
      filePath: context.emptyModulePath,
      type: 'empty',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};
 
// Add COEP and COOP headers to support SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};
module.exports = config;
