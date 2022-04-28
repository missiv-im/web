module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: "latest",
		sourceType: "module"
	},
	plugins: ["react", "@typescript-eslint"],
	rules: {

		quotes: ["error", "double"],
		semi: ["error", "always"],
		"react/react-in-jsx-scope": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"linebreak-style": 0,
		"indent": "off"
	},
	settings: {
		react: {
			pragma: "React",
			version: "detect"
		}
	},
	ignorePatterns: ["node_modules/"]
};
