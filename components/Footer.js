import useTranslation from 'next-translate/useTranslation'
import style from '@style/Footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation('common')

  return (
    <footer className={style.wrapper}>
      <div className={style.container}>
        <div>
          <span className={style.title}>humanities.tools</span>
          <span className={style.copyright}>© {currentYear} </span>
        </div>
        <ul className={style.menu}>
          <li><a href="mailto:martin@rocek.dev">{t('contact')}</a></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
