module.exports = {
  name: 'zionix-main-host',
  // Explicitly disable DTS plugin to prevent Windows file lock issues
  dts: false,
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
      "requiredVersion": "6.30.3"
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
      "requiredVersion": "^1.1.23"
};
    }
    if (name === '@zionix-space/design-system') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "^1.3.22"
};
    }
    if (name === 'framer-motion') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "^12.23.24"
};
    }
    if (name === 'remixicon') {
      return {
      "singleton": true,
      "eager": true,
      "requiredVersion": "^4.9.1"
};
    }
    return undefined;
  },
};
