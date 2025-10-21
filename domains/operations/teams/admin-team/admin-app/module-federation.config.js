module.exports = {
  name: 'adminApp',

  exposes: {
    './Module': './src/remote-entry.js',
  },
};
