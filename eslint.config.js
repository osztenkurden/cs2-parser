import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	{
		files: ['src/**/*.ts'],
		rules: {
			'no-console': 1,
			'@typescript-eslint/explicit-module-boundary-types': 0,
			'@typescript-eslint/ban-types': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/no-empty-function': 0,
			'no-empty': 0,
			'@typescript-eslint/no-unused-vars': [
				1,
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true
				}
			],
			'@typescript-eslint/no-var-requires': 0,
			'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
			'@typescript-eslint/explicit-function-return-type': 0,
			'@typescript-eslint/camelcase': 0,
			'@typescript-eslint/no-empty-object-type': 0
		}
	},
	globalIgnores(['types/*', 'dist/*', 'lib/*', 'src/ts-proto/*', 'src/generated/*', 'eslint.config.js'])
);
