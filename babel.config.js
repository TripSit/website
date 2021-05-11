'use strict';

module.exports = function babelConfig(api) {
  api.cache(process.env.NODE_ENV !== 'production');

  return {
    presets: [
      'next/babel',
    ],
    plugins: [
      'babel-plugin-styled-components',
    ],
  };
};
