'use strict';

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  excludeFile: (str) => /\*.{spec,test}.js$/.test(str),
};
