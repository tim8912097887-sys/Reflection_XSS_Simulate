/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // Use the specific ESM preset
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  rootDir: "./",

  testMatch: ["<rootDir>/test/**/*.test.ts", "<rootDir>/test/**/*.spec.ts"],
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "js"],
  setupFiles: ["<rootDir>/test/setup-env.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  moduleNameMapper: {
    // Handle test utils import
    "^test/(.*)\\.js$": "<rootDir>/test/$1",
    "^@/(.*)\\.js$": "<rootDir>/src/$1",

    // Handle relative imports with .js extensions
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  collectCoverage: true,
  coverageProvider: "v8",
  coverageReporters: ["html", "text", "json"],
};
