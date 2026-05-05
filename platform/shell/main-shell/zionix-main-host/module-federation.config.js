module.exports = {
  name: 'zionix-main-host',
  remotes: ["adminApp"],
  shared: (name) => {
    if (name === 'react') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "18.3.1"
};
    }
    if (name === 'react-dom') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "18.3.1"
};
    }
    if (name === 'react-router-dom') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "6.30.3"
};
    }
    if (name === 'zustand') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "^5.0.8"
};
    }
    if (name === '@tanstack/react-query') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "^5.90.5"
};
    }
    if (name === '@zionix-space/design-system') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "^1.3.26"
};
    }
    return undefined;
  },
};