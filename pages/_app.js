// Fix FontAwesome CSS loading
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
// Add custom styles
import '@style/variables.css'
import '@style/globals.css'

config.autoAddCss = false

function HumanitiesTools({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default HumanitiesTools
