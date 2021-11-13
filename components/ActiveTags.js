import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-regular-svg-icons'
import style from '@style/ActiveTags.module.css'

const ActiveTags = ({ tags, onFilterChange }) => {
  return (
    <div className={style.wrapper}>
      <span className={style.title}>Filters</span>
      {tags.map(tag => (
          <button key={tag.slug} onClick={(e) => onFilterChange(e, tag)} className={style.button}>
            {tag.title}
            <FontAwesomeIcon icon={faTimes} className={style.icon} />
          </button>
      ))}
    </div>
  )
}

export default ActiveTags
