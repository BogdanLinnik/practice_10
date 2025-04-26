module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/test/**',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/**/__tests__/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  verbose: true
}; 