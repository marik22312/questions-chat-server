module.exports = {
	preset: '@shelf/jest-mongodb',
	"roots": [
	  "<rootDir>/src",
	  "<rootDir>/__tests__",
	],
	"testMatch": [
	  "**/__tests__/**/*.+(spec|test|e2e).+(ts|tsx|js)",
	  "**/?(*.)+(spec|test|e2e).+(ts|tsx|js)"
	],
	"transform": {
		"^.+\\.(ts|tsx)$": "ts-jest"
	},
	testPathIgnorePatterns: [
		"/*.mock.*/"
	],
  }