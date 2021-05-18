'use strict';

module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
  ],
  transform: {
    '\\.js$': 'babel-jest',
  },
};
