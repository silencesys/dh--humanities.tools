import Header from '@components/Header'
import Footer from '@components/Footer'

const Layout = ({ children }) => {
  return (
    <div className='websiteWrapper'>
      <Header />
      <main>{children}</main>
      <Footer />
      <form name="resources" data-netlify='true' netlify-honeypot='bot-field' hidden>
        <input type="text" name="name" />
        <input type="text" name="website" />
      </form>
    </div>
  )
}

export default Layout
