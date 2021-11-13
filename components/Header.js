import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import style from '@style/Header.module.css'

const Header = () => {
  const router = useRouter()
  const { t } = useTranslation('common')

  const changeLanguage = (lang) => {
    router.push(router.asPath, router.asPath, { locale: lang })
  }

  return (
    <header className={style.container}>
      <h2 className={style.siteTitle}>
        <Link href='/' passHref>
          <a>
          humanities.tools
          </a>
        </Link>
      </h2>
      <nav>
        <ul className={style.menu}>
          <li>{t('language_name')}
            <FontAwesomeIcon icon={faAngleDown} className={style.icon} />
            <ul>
              <li>
                <button className={style.menuButton} onClick={() => changeLanguage('en')}>
                  english
                </button>
              </li>
              <li>
                <button className={style.menuButton} onClick={() => changeLanguage('cs')}>
                  čeština
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
