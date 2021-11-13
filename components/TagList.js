import style from '@style/TagList.module.css'

const TagList = ({ tags, onFilterChange = () => {}, activeTags = [] }) => {
  return (
    <div className={`${style.wrapper} tagFilter`}>
      <ul className={style.list}>
        {tags.map(tag => (
          <li key={tag.slug}>
            <button
              onClick={(e) => onFilterChange(e, tag)}
              className={`${style.tagButton} ${activeTags.some(at => at.slug === tag.slug) ? style.active : ''}`}
            >
              {tag.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TagList
