import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import style from '@style/Resource.module.css'

const Resource = ({
  title = 'Title',
  logo = null,
  description = 'Description',
  tags = [],
  website = '#',
  cover = null,
  onFilterChange = () => {},
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

  const resourceDescription = (
    description.length > 120 && !showMore ?
    <p>{description.match(/.{1,120}(\s|$)/g)[0].slice(0, -1)}...</p>
    : <p>{description}</p>
  )

  return (
    <article ref={reference} className={style.wrapper}>
      <a href={website} rel='noopener noreferrer' target='_blank'>
        {cover && <div className={style.cover}>
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
            {logo && <Image
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
              <button className={style.tagButton} onClick={(e) => onFilterChange(e, tags[0])}>
                #{tags[0]}
              </button>
            </div>
          </footer>
        </div>
      </a>
    </article>
  )
}

export default Resource
