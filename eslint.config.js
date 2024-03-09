import antfu from '@antfu/eslint-config'

export default antfu({ rules: { 'no-console': 0 }, extends: [
  'plugin:@typescript-eslint/recommended',
  'plugin:@figma/figma-plugins/recommended',
] })
