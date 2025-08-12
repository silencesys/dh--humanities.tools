import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import style from '@style/Header.module.css'
import { useEffect } from 'react'
import Image from 'next/image'

const Header = ({ logo, configuration }) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  const changeLanguage = (lang) => {
    router.push(router.asPath, router.asPath, { locale: lang })
  }

  return (
    <header className={style.container}>
      <h2 className={style.siteTitle}>
        <Link href='/'>
          <Image
            src={logo.url}
            width={50}
            height={32}
            alt={configuration?.title || 'Humanities Tools Logo'}
            className={style.logo}
          />
          <span>
            {configuration?.description}
          </span>
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
                <button className={style.menuButton} onClick={() => changeLanguage('is')}>
                  íslenska
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
