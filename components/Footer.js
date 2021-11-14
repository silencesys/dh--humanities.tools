import Link from 'next/link'
import useSWR from 'swr'
import useTranslation from 'next-translate/useTranslation'
import style from '@style/Footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const { t, lang } = useTranslation('common')

  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`/api/getpagelist?locale=${lang}`, fetcher)

  return (
    <footer className={style.wrapper}>
      <div className={style.container}>
        <div>
          <span className={style.title}>humanities.tools</span>
          <span className={style.copyright}>© {currentYear} </span>
        </div>
        <ul className={style.menu}>
          {data && data.map(({ slug, title }) => (
            <li key={slug}><Link href={`/${slug}`} passhref><a>{title}</a></Link></li>
          ))}
          <li><a href="mailto:martin@rocek.dev">{t('contact')}</a></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
