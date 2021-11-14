import Head from '../components/Head'

const Error404 = () => {
  return (
    <main className='mainContainer'>
      <Head title='Not Found | humanities.tools' />
      <div className='content__error'>
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    </main>
  )
}

export default Error404
