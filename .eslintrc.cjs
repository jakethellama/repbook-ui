/* eslint-env node */
module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'airbnb-base',
        'plugin:@angular-eslint/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/stylistic'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', '@angular-eslint'],
    rules: {
        indent: ['error', 4],
        '@angular-eslint/no-input-rename': 'off',
        'import/prefer-default-export': 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'lines-between-class-members': 'off',
        'max-len': 'off',
        'class-methods-use-this': 'off',
        '@typescript-eslint/prefer-for-of': 'off',
        camelcase: 'off',

    },
};
