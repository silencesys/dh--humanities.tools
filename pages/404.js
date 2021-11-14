import Head from '@components/Head'
import Header from '@components/Header'
import Footer from '@components/Footer'

const Error404 = () => {
  return (
    <div className='websiteWrapper'>
      <Head title='Not Found | humanities.tools' />
      <main className='mainContainer'>
        <Header />
        <div className='content__error'>
          <h1>404</h1>
          <p>Page not found</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Error404
