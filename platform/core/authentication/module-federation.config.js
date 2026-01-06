/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
module.exports = {
  name: 'authApp',
  exposes: {
    './Module': './src/remote-entry.js',
    './AuthService': './src/services/auth/authService.js',
    './useAuthStore': './src/stores/useAuthStore.js',
  },
};
