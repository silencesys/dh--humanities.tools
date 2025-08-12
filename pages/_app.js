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
    <Layout logo={pageProps.logo || {}} configuration={pageProps.siteConfiguration || {}}>
      <Script
        async
        defer
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default HumanitiesTools
