// @ts-check

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
    globalIgnores(['dist', 'package.json']),
    eslint.configs.recommended,
    tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    [
        {
            rules: {
                'prefer-const': 'warn',
                'no-console': 'warn',
                '@typescript-eslint/no-unused-vars': 'warn',
                '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
            },
        },
    ],
]);
