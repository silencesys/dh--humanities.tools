const nextTranslate = require('next-translate')

module.exports = nextTranslate({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'humanities.tools',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'google.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'pagescreen.coders.tools',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'mshl.is',
        port: '',
        pathname: '/**'
      }
    ]
  },
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
