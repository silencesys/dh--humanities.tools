import Header from '@components/Header'
import Footer from '@components/Footer'

const Layout = ({ children, logo, configuration }) => {
  return (
    <div className='websiteWrapper'>
      <Header logo={logo} configuration={configuration} />
      <main>{children}</main>
      <Footer configuration={configuration} />
    </div>
  )
}

export default Layout
