module.exports = {
  locales: ['en', 'cs'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/': ['home', 'resource']
  },
  loadLocaleFrom: (lang, ns) => import(`./content/i18n/${lang}/${ns}.json`).then((m) => m.default)
}
