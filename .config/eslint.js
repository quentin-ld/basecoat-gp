// config/eslint.js
export default [
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        wp: 'readonly',
        wpdom: 'readonly'
      }
    },
    rules: {
      indent: ['error', 'tab'],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'linebreak-style': ['error', 'unix']
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  }
];