import Header from '@components/Header'
import Footer from '@components/Footer'

const Layout = ({ children }) => {
  return (
    <div className='websiteWrapper'>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
