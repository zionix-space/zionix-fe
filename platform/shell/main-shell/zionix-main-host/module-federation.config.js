module.exports = {
  name: 'zionix-main-host',
  remotes: [
    [
        "adminApp",
        "https://admin-app-nu-ruby.vercel.app/remoteEntry.js"
    ]
],
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
    if (name === 'dayjs') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "^1.11.13"
};
    }
    if (name === 'react-router-dom') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "6.11.2"
};
    }
    if (name === 'zustand') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "^5.0.8"
};
    }
    if (name === '@tanstack/react-query') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "^5.90.5"
};
    }
    if (name === '@zionix-space/lowcode') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "^1.1.2"
};
    }
    if (name === '@zionix-space/design-system') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "^1.3.7"
};
    }
    if (name === 'framer-motion') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "^12.23.24"
};
    }
    return undefined;
  },
};
