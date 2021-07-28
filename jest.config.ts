/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@shop/(.*)': ['<rootDir>/shop/$1'],
    '@shop_tests/(.*)': ['<rootDir>/shop_tests/$1'],
  },
};
