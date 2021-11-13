import Image from 'next/image'
import style from '@style/Resource.module.css'

const Resource = ({
  title = 'Title',
  logo = null,
  description = 'Description',
  tags = ['tag', 'div'],
  url = '#',
  cover = null
}) => {
  return (
    <article className={style.wrapper}>
      <a href={url} rel='noopener noreferrer' target='_blank'>
        {cover && <div className={style.cover}>
            <Image
              src={cover}
              alt='logo'
              width='250px'
              height='250px'
              objectFit='contain'
              className={style.preview}
            />
        </div>}
        <div className={style.content}>
          <header className={style.header}>
            {logo && <Image
              src={logo}
              alt='logo'
              width='36px'
              height='28px'
              objectFit='contain'
              className={style.logo}
            />}
            <h3 className={style.title}>
              {title}
            </h3>
          </header>
          <p>{description}</p>
          <footer className={style.footer}>
            <div></div>
            <div className={style.tags}>
              {tags.map((tag, index) => {
              return (
                <button className={style.tagButton} key={index}>
                  #{tag}
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
