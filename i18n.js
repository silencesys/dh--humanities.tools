module.exports = {
  locales: ['en', 'cs'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/': ['home', 'resource']
  },
  loadLocaleFrom: (lang, ns) => {
    try {
      return Promise.resolve(require(`./content/i18n/${lang}/${ns}.json`))
    } catch (error) {
      console.error(`Error loading locale: ${lang}/${ns}`, error)
      if (lang !== 'en') {
        return Promise.resolve(require(`./content/i18n/en/${ns}.json`))
      }
      throw error
    }
  }
}
