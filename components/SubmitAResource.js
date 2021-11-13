import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-regular-svg-icons'
import useTranslation from 'next-translate/useTranslation'
import style from '@style/SubmitAResource.module.css'

const SubmitAResource = ({
  onClose = () => {},
}) => {
  useEffect(() => {
    const body = document.querySelector('body')
    body.classList.add('hideScrollbars')

    document.onkeydown = (e) => {
      if (e.key === 'Escape') {
        onClose(e)
      }
    }

    return () => {
      body.classList.remove('hideScrollbars')
      document.onkeydown = null
    }
  }, [onClose])

  const { t } = useTranslation('resource')

  return (
    <div className={style.overlay}>
      <div className={style.formWrapper}>
        <header className={style.header}>
          <h3 className={style.header__title}>
            {t('resource:submit_resource')}
          </h3>
          <button onClick={onClose} className={style.closeButton}>
            <FontAwesomeIcon icon={faTimes} className={style.close} />
          </button>
        </header>
        <form>
          <div className={style.formGroup}>
            <label htmlFor="resourceTitle">{t('resource:name')}</label>
            <input type="text" id="resourceTitle" />
          </div>
          <div className={style.formGroup}>
            <label htmlFor="resourceUrl">{t('resource:link')}</label>
            <input type="text" id="resourceUrl" />
          </div>
          <button className='button__primary'>
          {t('resource:submit')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SubmitAResource
