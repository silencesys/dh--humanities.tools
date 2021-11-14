const nextTranslate = require('next-translate')

module.exports = nextTranslate({
  target: 'experimental-serverless-trace',
  reactStrictMode: true,
  webpack (config) {
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    )

    return config
  }
})
