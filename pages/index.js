import Head from 'next/head'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import Header from '@components/Header'
import Resource from '@components/Resource'
import Footer from '@components/Footer'
import SubmitAResource from '@components/SubmitAResource'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/pro-solid-svg-icons'
import { getPosts } from '@utils/api'

export default function Home({ resources }) {
  const { t } = useTranslation('common', 'home')
  const [submitModal, setSubmitModal] = useState(false)

  const toggleSubmitModal = (e) => {
    e.preventDefault()
    setSubmitModal(state => !state)
  }

  return (
    <div className='websiteWrapper'>
      <Head>
        <title>humanities.tools</title>
        <meta name='description' content='Catalogue of tools and resources for humanities' />
        <meta name='keywords' content='humanities, tools, tools for humanities, digital humanities, history, philosphy, arts, liberal arts, linguistic, languages, education, academia, academic tools' />
        <link rel='icon' href='/favicon.ico' />
        <link rel="stylesheet" href="https://use.typekit.net/wbs7hla.css" />
        <meta property='og:title' content='Humanities.tools' />
        <meta property='og:description' content='Catalogue of tools and resources for humanities' />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Humanities.tools' />
        <meta property='og:url' content='https://www.humanities.tools' />
        <meta property='og:image' content='https://www.humanities.tools/og-image.jpg' />
        <meta name='twitter:image' content='https://www.humanities.tools/og-image.jpg' />
        <meta name='twitter:image:alt' content='Catalogue of tools and resources for humanities' />
        <meta name="twitter:creator" content="@silencesys" />
      </Head>

      <main className='mainContainer'>
        <Header />
        <div className='content__header'>
          <h1 className='catchPhrase'>
            {t('home:catalogue_of_resources')}
          </h1>
          <button className='button__primary' onClick={toggleSubmitModal}>
            {t('resource:submit_resource')}
          </button>
        </div>

        <div className='content__filterRow'>
          <button className='button__secondary'>
            <FontAwesomeIcon icon={faTags} className='buttonIcon' />
            {t('home:filter_by_tag')}
          </button>
        </div>
        <div className='content__body'>
          {resources && resources.map((resource, index) => <Resource key={resource.slug} {...resource} />)}
        </div>
      </main>

      <Footer />
      {submitModal && <SubmitAResource onClose={toggleSubmitModal} />}
    </div>
  )
}


export async function getStaticProps ({ locale }) {
  const resources = ((context) => {
    return getPosts(context, null, locale)
  })(require.context('@content/resources', true, /\.\/.*\.md$/))

  return {
    props: {
      resources
    }
  }
}
