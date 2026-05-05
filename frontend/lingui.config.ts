/** @type {import('@lingui/conf').LinguiConfig} */
const config = {
  locales: ['zh', 'en'],
  sourceLocale: 'zh',
  fallbackLocales: { default: 'zh' },
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['<rootDir>/src'],
    },
  ],
  format: 'po',
  compileNamespace: 'ts',
}

export default config
