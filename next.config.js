const nextTranslate = require('next-translate')

module.exports = nextTranslate({
  reactStrictMode: true,
  webpack (config) {
    config.resolve.fallback = { fs: false };
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    )

    return config
  }
})
