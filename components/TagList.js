import style from '@style/TagList.module.css'

const TagList = ({ tags, onFilterChange = () => {}, activeTags = [] }) => {
  return (
    <div className={`${style.wrapper} tagFilter`}>
      <ul className={style.list}>
        {tags.map(tag => (
          <li key={tag}>
            <button
              onClick={(e) => onFilterChange(e, tag)}
              className={`${style.tagButton} ${activeTags.some(at => at === tag) ? style.active : ''}`}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TagList
