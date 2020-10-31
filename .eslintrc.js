module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:jest-formatting/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  plugins: ['react', 'react-hooks', 'jest', 'jest-formatting', 'jsx-a11y'],
  rules: {
    'max-len': [
      'error',
      {
        code: 80,
        ignorePattern: '^(import|\\} from )',
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
        ignoreComments: true,
      },
    ],
    // just cause non-default exports are awesome
    'import/prefer-default-export': 'off',
    'jest-formatting/padding-around-expect-groups': 'off',
    'import/order': 'off',
    'consistent-return': 'off',
    //  we allow 0 warnings, so don't think prettier rules are ignored
    // this is only to show prettier issues as warnings, not errors
    'prettier/prettier': 'warn',
    //  too buggy rule: https://github.com/jest-community/eslint-plugin-jest/issues/203
    'jest/valid-describe': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
        allowChildren: true,
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        assert: 'either',
      },
    ],
    // rule conflicts with prettier
    'react/jsx-wrap-multilines': [
      'error',
      { declaration: false, assignment: false },
    ],
    'jsx-a11y/anchor-has-content': [
      2,
      {
        components: ['Link'],
      },
    ],
  },
}
