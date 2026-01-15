module.exports = {
  name: 'zionix-main-host',
  remotes: ["adminApp"],
  shared: (name) => {
    if (name === 'react') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "18.3.1"
};
    }
    if (name === 'react-dom') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "18.3.1"
};
    }
    if (name === 'dayjs') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "^1.11.13"
};
    }
    if (name === 'react-router-dom') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "6.11.2"
};
    }
    if (name === 'antd') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "^5.27.6"
};
    }
    if (name === 'axios') {
      return {
      "singleton": true,
      "eager": false,
      "requiredVersion": "^1.12.2"
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
    return undefined;
  },
};