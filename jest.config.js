module.exports = {
	"roots": [
	  "<rootDir>/src"
	],
	"testMatch": [
	  "**/__tests__/**/*.+(ts|tsx|js)",
	  "**/?(*.)+(spec|test|e2e).+(ts|tsx|js)"
	],
	"transform": {
		"^.+\\.(ts|tsx)$": "ts-jest"
	},
	testPathIgnorePatterns: [
		"/*.mock.*/"
	]
  }