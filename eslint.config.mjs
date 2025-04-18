import react from 'eslint-plugin-react'
import prettier from 'eslint-plugin-prettier'

import tsParser from '@typescript-eslint/parser'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const eslintConfig = [
  ...compat.extends('next', 'next/core-web-vitals', 'prettier'),
  {
    plugins: {
      react,
      prettier,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',

        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'linebreak-style': ['error', 'unix'],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      semi: ['error', 'never'],
      'prefer-const': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default eslintConfig
