/** Jest configuration for the Angular 17 project (jest-preset-angular). */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@features/(.*)$': '<rootDir>/src/app/features/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
  },
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.routes.ts',
    '!src/app/**/*.config.ts',
    '!src/app/**/index.ts',
    '!src/main.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: { statements: 80, branches: 70, functions: 80, lines: 80 },
  },
};
