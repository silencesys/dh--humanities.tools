import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import style from '@style/Resource.module.css'

const Resource = ({
  title = 'Title',
  logo = null,
  description = 'Description',
  tagList = [],
  website = '#',
  cover = null,
  onFilterChange = () => {},
}) => {
  const [ showMore, setShowMore ] = useState(false)
  const reference = useRef(null)

  useEffect(() => {
    let timeout = null
    reference.current.addEventListener('mouseenter', () => {
      timeout = setTimeout(() => {
        setShowMore(true)
      }, 1000)
    })
    reference.current.addEventListener('mouseleave', () => {
      clearTimeout(timeout)
      setShowMore(false)
    })

    return () => {
      reference.current.removeEventListener('mouseenter', () => {
        timeout = setTimeout(() => {
          setShowMore(true)
        }, 1000)
      })
      reference.current.removeEventListener('mouseleave', () => {
        clearTimeout(timeout)
        setShowMore(false)
      })
      clearTimeout(timeout)
    }
  }, [reference])

  const resourceDescription = (
    description.length > 120 && !showMore ?
    <p>{description.match(/.{1,120}(\s|$)/g)[0].slice(0, -1)}...</p>
    : <p>{description}</p>
  )

  return (
    <article ref={reference} className={style.wrapper}>
      <a href={website} rel='noopener noreferrer' target='_blank'>
        {cover && <div className={style.cover}>
            <Image
              src={cover}
              alt='logo'
              width='280px'
              height='220px'
              objectFit='contain'
              className={style.preview}
              unoptimized
            />
        </div>}
        <div className={style.content}>
          <header className={style.header}>
            {logo && <Image
              src={logo}
              alt='logo'
              width='26px'
              height='28px'
              objectFit='contain'
              className={style.logo}
              unoptimized
            />}
            <h3 className={style.title}>
              {title}
            </h3>
          </header>
          {resourceDescription}
          <footer className={style.footer}>
            <div></div>
            <div className={style.tags}>
              <button className={style.tagButton} onClick={(e) => onFilterChange(e, tagList[0])}>
                #{tagList[0].title}
              </button>
            </div>
          </footer>
        </div>
      </a>
    </article>
  )
}

export default Resource
