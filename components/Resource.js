import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import style from '@style/Resource.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faCheckCircle, faCircle } from '@fortawesome/pro-regular-svg-icons'

const Resource = ({
  title = 'Title',
  logo = null,
  description = 'Description',
  institution = 'Institution',
  tags = [],
  website = '#',
  cover = null,
  unique_id = null,
  onFilterChange = () => {},
  onClick = () => {},
  inCollection = false,
  isBuildingCollection = false
}) => {
  const [ showMore, setShowMore ] = useState(false)
  const reference = useRef(null)

  useEffect(() => {
    let timeout = null
    const ref = reference.current

    ref.addEventListener('mouseenter', () => {
      timeout = setTimeout(() => {
        setShowMore(true)
      }, 1000)
    })
    ref.addEventListener('mouseleave', () => {
      clearTimeout(timeout)
      setShowMore(false)
    })

    return () => {
      ref.removeEventListener('mouseenter', () => {
        timeout = setTimeout(() => {
          setShowMore(true)
        }, 1000)
      })
      ref.removeEventListener('mouseleave', () => {
        clearTimeout(timeout)
        setShowMore(false)
      })
      clearTimeout(timeout)
    }
  }, [reference])

  return (
    <article ref={reference} className={`${style.wrapper} ${inCollection ? style.selected : ''}`}>
      <a href={website} rel='noopener noreferrer' target='_blank' onClick={(e) => onClick(e, unique_id)}>
        <div className={style.cover}>
          <Image
            src={`https://pagescreen.coders.tools/screenshot?url=${encodeURIComponent(website)}&w=280&h=220`}
            alt='logo'
            width={280}
            height={220}
            className={style.preview}
            unoptimized
          />
        </div>
        <div className={style.content}>
          <header className={style.header}>
            <div>
            <h3 className={style.title}>
              {title}
            </h3>
            </div>
            <span className={style.resourceURL}>{website}</span>
          </header>
          <p>{description}</p>
          <footer className={style.footer}>
            <div className={style.institution}>
              <button className={style.institutionButton}>
                <FontAwesomeIcon icon={faBuilding} className={style.icon} />
                {institution}
              </button>
            </div>
            <div className={style.tags}>
              {tags.length > 0 && tags.map(tag => (
                <button key={tag} className={style.tagButton} onClick={(e) => onFilterChange(e, tag)}>
                  #{tag}
                </button>
              ))}
            </div>
          </footer>
        </div>
      </a>
    </article>
  )
}

export default Resource
