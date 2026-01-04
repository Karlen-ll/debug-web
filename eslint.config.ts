import js from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['node_modules/**', 'coverage/**', 'dist/**'] },
  {
    files: ['**/*.ts'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'semi': ['error', 'always'],
      'jsx-quotes': ['error', 'prefer-single'],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'comma-dangle': ['error', 'only-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'indent': ['error', 2],

      '@typescript-eslint/no-explicit-any': 'warn',
    }
  },
  tsEslint.configs.recommended,
]);
