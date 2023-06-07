import { useState, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import Head from '@components/Head'
import Resource from '@components/Resource'
import TagList from '@components/TagList'
import ActiveTags from '@components/ActiveTags'
import SubmitAResource from '@components/SubmitAResource'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/pro-solid-svg-icons'
import { downloadPictures, getDatabase, parseNotionPage } from '@utils/notion'
import path from 'path'

export default function Home({ resources, tags }) {
  const { t } = useTranslation('common', 'home')
  const [submitModal, setSubmitModal] = useState(false)
  const [ currentResources, setCurrentResources ] = useState(resources)
  const [ filters, setFilters ] = useState([])
  const [ recentlySubmitted, setRecentlySubmitted ] = useState(false)

  useEffect(() => {
    if (filters.length > 0) {
      console.log(resources)
      const filteredResources = resources.filter(resource => resource.tags.some(tag => filters.some(tags => tags === tag)))
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
      if (state.some(filter => filter === tag)) {
        return state.filter(filter => filter !== tag)
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
    <main className='mainContainer'>
      <Head title='humanities.tools' />
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
        {resources && currentResources.map(resource => <Resource key={resource.id} onFilterChange={onFilterChange} {...resource} />)}
      </div>

    {filters.length > 0 && <ActiveTags tags={filters} onFilterChange={onFilterChange} />}
    {submitModal && <SubmitAResource onClose={toggleSubmitModal} onSuccess={onSuccessfulSubmit} />}
  </main>
  )
}


export async function getStaticProps ({ locale }) {
  let i = 50
  let db = { next_cursor: undefined }
  let resourceList = []
  while (i === 50) {
    // add 5 sec delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 5000))
    db = await getDatabase(50, db?.next_cursor || undefined)
    i = db.results.length
    resourceList = [...resourceList, ...db.results]
  }
  const resources = resourceList
    .map(resource => parseNotionPage(resource.properties, locale, resource.id))
    .sort((a, b) => a.title.localeCompare(b.title))

  for (const resource of resources) {
    await downloadPictures(resource.fileUrl, resource.fileName)
  }

  const tags = resourceList.reduce((acc, resource) => {
    const resourceTags = resource.properties.Categories.multi_select.map((item) => item.name)
    return [...acc, ...resourceTags]
  }, []).filter((item, index, array) => array.indexOf(item) === index)
  path.resolve('content')
  return {
    props: {
      resources,
      tags
    }
  }
}
