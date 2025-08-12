import Head from '@components/Head'

const Error500 = () => {
  return (
    <main className='mainContainer'>
      <Head title='Not Found | MSHL - Tools' />
      <div className='content__error'>
        <h1>500</h1>
        <p>Page not found</p>
      </div>
    </main>
  )
}

export default Error500
