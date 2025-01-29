module.exports = (async function config() {
  const txoPackageConfigList = await import('eslint-config-txo-package-typescript')
  /** @type {import('eslint').Linter.Config[]} */
  return [
    ...txoPackageConfigList.configList,
    {
      files: ['__tests__/**/*'],
      rules: {
        'jest/expect-expect': [
          'error',
          {
            assertFunctionNames: ['expect', 'expectTypeOf']
          }
        ]
      }
    },
  ]
})()
