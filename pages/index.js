import Head from 'next/head'
import { useState, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import Header from '@components/Header'
import Resource from '@components/Resource'
import Footer from '@components/Footer'
import TagList from '@components/TagList'
import ActiveTags from '@components/ActiveTags'
import SubmitAResource from '@components/SubmitAResource'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/pro-solid-svg-icons'
import { getPosts } from '@utils/api'

export default function Home({ resources, tags }) {
  const { t } = useTranslation('common', 'home')
  const [submitModal, setSubmitModal] = useState(false)
  const [ currentResources, setCurrentResources ] = useState(resources)
  const [ filters, setFilters ] = useState([])
  const [ recentlySubmitted, setRecentlySubmitted ] = useState(false)

  useEffect(() => {
    if (filters.length > 0) {
      const filteredResources = resources.filter(resource => resource.tags.some(tag => filters.some(tags => tags.slug === tag)))
      setCurrentResources(filteredResources)
    } else {
      setCurrentResources(resources)
    }
  }, [filters, resources])

  useEffect(() => {
    if (recentlySubmitted) {
      setTimeout(() => {
        setRecentlySubmitted(false)
      }, 5000)
    }
  }, [recentlySubmitted])

  const toggleSubmitModal = (e) => {
    e.preventDefault()
    setSubmitModal(state => !state)
  }

  const onFilterChange = (e, tag) => {
    e.preventDefault()
    e.stopPropagation()
    setFilters(state => {
      if (state.some(filter => filter.slug === tag.slug)) {
        return state.filter(filter => filter.slug !== tag.slug)
      } else {
        return [...state, tag]
      }
    })
  }

  const onSuccessfulSubmit = (e) => {
    e.preventDefault()
    setSubmitModal(false)
    setRecentlySubmitted(true)
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
          {recentlySubmitted && <p className='content__successfulSubmit'>{t('home:submit_successful')}</p>}
        </div>

        <div className='content__filterRow'>
          <div className='button__secondary tagFilterButton'>
            <FontAwesomeIcon icon={faTags} className='buttonIcon' />
            {t('home:filter_by_tag')}
            <TagList tags={tags} onFilterChange={onFilterChange} activeTags={filters} />
          </div>
        </div>
        <div className='content__body'>
          {resources && currentResources.map(resource => <Resource key={resource.slug} onFilterChange={onFilterChange} {...resource} />)}
        </div>
      </main>

      <Footer />
      {filters.length > 0 && <ActiveTags tags={filters} onFilterChange={onFilterChange} />}
      {submitModal && <SubmitAResource onClose={toggleSubmitModal} onSuccess={onSuccessfulSubmit} />}
    </div>
  )
}


export async function getStaticProps ({ locale }) {
  const resources = ((context) => {
    return getPosts(context, null, locale)
  })(require.context('@content/resources', true, /\.\/.*\.md$/))

  const tags = ((context) => {
    return getPosts(context, null, locale)
  })(require.context('@content/tags', true, /\.\/.*\.md$/))

  return {
    props: {
      resources,
      tags
    }
  }
}
