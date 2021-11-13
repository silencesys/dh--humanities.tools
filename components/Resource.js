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
  return (
    <article className={style.wrapper}>
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
          <p>{description}</p>
          <footer className={style.footer}>
            <div></div>
            <div className={style.tags}>
              {tagList.map((tag, index) => {
              return (
                <button className={style.tagButton} key={index} onClick={(e) => onFilterChange(e, tag)}>
                  #{tag.title}
                </button>
              )})}
            </div>
          </footer>
        </div>
      </a>
    </article>
  )
}

export default Resource
