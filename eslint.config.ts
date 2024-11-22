import withNuxt from './.nuxt/eslint.config.mjs'
import stylistic from '@stylistic/eslint-plugin'

export default withNuxt({
  ignores: ['types/**/*'],
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    '@stylistic/indent': ['error', 2],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': 'error',
    'no-console': 'off',
    'import/newline-after-import': ['error', { count: 1 }],
    'vue/no-v-html': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['transition', 'client-only', 'i18n'],
      },
    ],
    'vue/v-on-event-hyphenation': [
      'error',
      'always',
      {
        autofix: true,
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/html-comment-content-spacing': ['error', 'always'],
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/new-line-between-multi-line-property': [
      'error',
      {
        minLineOfMultilineProperty: 2,
      },
    ],
    'vue/no-useless-v-bind': [
      'error',
      {
        ignoreIncludesComment: true,
        ignoreStringEscape: true,
      },
    ],
    'vue/v-for-delimiter-style': ['error', 'in'],
    'vue/no-empty-component-block': ['error'],
    'vue/no-template-shadow': 'error',
    'vue/no-unused-refs': 'error',
    'vue/no-unused-vars': 'error',
    'vue/no-v-for-template-key-on-child': 'error',

  },
})
