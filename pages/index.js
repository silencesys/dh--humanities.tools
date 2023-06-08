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
import { useRouter } from 'next/router'
import { decodeIds, encodeIds } from '@utils/encoding'
import { faCheck, faCheckCircle, faGrid2Plus } from '@fortawesome/pro-regular-svg-icons'

export default function Home({ resources, tags }) {
  const { t } = useTranslation('common', 'home')
  const { query, push } = useRouter()
  const [submitModal, setSubmitModal] = useState(false)
  const [ currentResources, setCurrentResources ] = useState(resources)
  const [ filters, setFilters ] = useState([])
  const [ recentlySubmitted, setRecentlySubmitted ] = useState(false)
  const [customCollection, setCustomCollection] = useState([])
  const [buildingCollection, setBuildingCollection] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    let data = resources
    if (query.collection) {
      const collection = decodeIds(query.collection)
      data = resources.filter(resource => collection.some(id => id === resource.unique_id))
    }
    if (filters.length > 0) {
      const filteredResources = data.filter(resource => resource.tags.some(tag => filters.some(tags => tags === tag)))
      setCurrentResources(filteredResources)
    } else {
      setCurrentResources(data)
    }
  }, [filters, resources, query])

  useEffect(() => {
    if (recentlySubmitted) {
      setTimeout(() => {
        setRecentlySubmitted(false)
      }, 5000)
    }
  }, [recentlySubmitted])

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }, [notification])

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

  const handleResourceClick = (e, id) => {
    if (!buildingCollection) return
    e.preventDefault()
    if (customCollection.indexOf(id) > -1) {
      setCustomCollection(state => state.filter(item => item !== id))
    } else {
      setCustomCollection(state => [...state, id])
    }
  }

  const cancelCollection = () => {
    setCustomCollection([])
    setBuildingCollection(false)
    setCollectionName('')
  }

  const saveCustomCollection = () => {
    setBuildingCollection(false)
    if (customCollection.length === 0) {
      return
    }
    const encodedCollection = encodeIds(customCollection)
    setCustomCollection([])
    let shareableLink = window.location.origin + window.location.pathname + '?collection=' + encodedCollection
    const collectionQuery = {
      collection: encodedCollection
    }
    if (collectionName) {
      collectionQuery.name = collectionName
      shareableLink += '&name=' + collectionName
    }
    navigator.clipboard.writeText(shareableLink)
    setCollectionName('')
    setNotification(t('home:collection_saved'))
    push({
      query: {
        ...query,
        ...collectionQuery
      }
    })
  }

  return (
    <main className='mainContainer'>
      <Head title='humanities.tools' />
      <div className='content__header'>
        <h1 className='catchPhrase'>
          {t('home:catalogue_of_resources')}
        </h1>
        {query.collection && (
          <h2 className='customCollection'>
            {query.name ? query.name : t('home:custom_collection')}
          </h2>
        )}
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
        {buildingCollection ? (
          <div
            className='button__secondary tagFilterButton'
            onClick={saveCustomCollection}
          >
            <FontAwesomeIcon icon={faCheck} className='buttonIcon' />
            {t('home:save_collection')} ({customCollection.length})
          </div>
        ) : (
          <div
            className='button__secondary tagFilterButton'
            onClick={() => setBuildingCollection(true)}
          >
            <FontAwesomeIcon icon={faGrid2Plus} className='buttonIcon' />
            {t('home:create_collection')}
          </div>
        )}
      </div>
      <div className='content__body'>
        {resources && currentResources.map(resource =>
          <Resource
            key={resource.id}
            onFilterChange={onFilterChange}
            onClick={handleResourceClick}
            inCollection={customCollection.indexOf(resource.unique_id) !== -1}
            isBuildingCollection={buildingCollection}
            {...resource}
          />
        )}
      </div>

    {filters.length > 0 && <ActiveTags tags={filters} onFilterChange={onFilterChange} />}
    {buildingCollection && (
      <div className='collectionBuilder'>
        <input
          type="text"
          className='collectionBuilder__input'
          placeholder={t('home:collection_name')}
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        <div className='collectionBuilder__Buttons'>
          <button
            className='button__secondary'
            onClick={cancelCollection}
          >
            {t('home:cancel_collection')}
          </button>
          <button
            className='button__primary'
            onClick={saveCustomCollection}
          >
            {t('home:save_collection')} ({customCollection.length})
          </button>
        </div>
      </div>
    )}
    {notification && (
      <div className='notification'>
        <FontAwesomeIcon icon={faCheckCircle} className='notification__icon' />
        <p>{notification}</p>
      </div>
    )}
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
    if (process.env.NODE_ENV !== 'development') {
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
    db = await getDatabase(50, db?.next_cursor || undefined)
    i = process.env.NODE_ENV === 'development' ? 1 : db.results.length
    resourceList = [...resourceList, ...db.results]
  }
  const resources = resourceList
    .map(resource => parseNotionPage(resource.properties, locale, resource.id))
    .sort((a, b) => a.title.localeCompare(b.title))

  for (const resource of resources) {
    console.log(resource.unique_id)
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
