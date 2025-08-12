import Link from 'next/link'
import useSWR from 'swr'
import useTranslation from 'next-translate/useTranslation'
import style from '@style/Footer.module.css'

const Footer = ({ configuration }) => {
  const currentYear = new Date().getFullYear()

  const { t, lang } = useTranslation('common')

  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`/api/pages?locale=${lang}`, fetcher)

  return (
    <footer className={style.wrapper}>
      <div className={style.container}>
        <div>
          <div className={style.contact}>
            <span className={style.title}>{configuration?.description}</span>
            <span className={style.text}>Centre for Digital Humanities and Arts</span>
            <span className={style.text}>Sæmundargata 2</span>
            <span className={style.text}>IS-102 Reykjavík 2</span>
            <span className={style.text}>
              <a href="mailto:mshl@hi.is" className={style.email}>
                mshl@hi.is
              </a>
            </span>
          </div>
          <span className={style.copyright}>© {currentYear} MHSL.is</span>
        </div>
        <ul className={style.menu}>
          <li><a href="https://mshl.is/postlisti/" className={style.button}>{t('contact')}</a></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
