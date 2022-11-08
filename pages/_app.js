// Fix FontAwesome CSS loading
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Layout from '@components/Layout'
import Script from 'next/script'
// Add custom styles
import '@style/variables.css'
import '@style/globals.css'
import '@style/mobile.css'

config.autoAddCss = false

function HumanitiesTools({ Component, pageProps }) {
  return (
    <Layout>
      <Script
        async
        defer
        data-website-id="a90b4937-dd40-4246-87fa-2cd2e5ba01b4"
        src="https://umami.rocek.dev/umami.js"
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default HumanitiesTools
