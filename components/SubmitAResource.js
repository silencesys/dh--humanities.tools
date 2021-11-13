import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-regular-svg-icons'
import useTranslation from 'next-translate/useTranslation'
import style from '@style/SubmitAResource.module.css'

const SubmitAResource = ({
  onClose = () => {},
  onSuccess = () => {}
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
  const [formContent, setFormContent] = useState({ name: '', website: '' })

  const encodeFormContent = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&')
  }

  const handleSubmit = (e) => {
    // eslint-disable-next-line no-undef
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormContent({ 'form-name': 'resources', ...formContent })
    })
      .then(() => {
        setFormContent({ name: '', website: '' })
        onClose(e)
        onSuccess(true)
      })
      .catch(error => console.error(error))

    e.preventDefault()
  }

  const handleChange = (e) => {
    setFormContent({ ...formContent, [e.target.name]: e.target.value })
  }

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
        <form action='/' method='POST' name='resources' onSubmit={handleSubmit} data-netlify='true'>
          <div className={style.formGroup}>
            <label htmlFor="resourceTitle">{t('resource:name')}</label>
            <input name="name" type="text" id="resourceTitle" onChange={handleChange} value={formContent.name} required />
          </div>
          <div className={style.formGroup}>
            <label htmlFor="resourceUrl">{t('resource:link')}</label>
            <input name="website" type="text" id="resourceUrl" onChange={handleChange} value={formContent.website} required />
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
