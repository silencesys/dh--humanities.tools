import matter from 'gray-matter'
import truncate from 'lodash/truncate'

function _getExcerpt (file, options) {
  file.excerpt = truncate(file.content, { length: 120, separator: ' ' })
}

function _mapPosts (context, filterCallback = null, locale = 'any') {
  let keys = context.keys()
  if (locale !== 'any') {
    // Load localised content only when locale is set
    keys = keys.filter(key => key.includes(`.${locale}.`))
  }
  const values = keys.map(context)

  const data = keys.map((key, index) => {
    // eslint-disable-next-line no-useless-escape
    const slug = key.replace(/^.*[\\\/]/, '').slice(0, -6)
    const value = values[index]
    const document = matter(value.default, {
      excerpt: _getExcerpt
    })
    document.slug = slug

    // Load tags with localised content
    let tags = []
    if (document.data.tags) {
      tags = document.data.tags.map(tag => {
        const tagData = require(`@content/tags/${tag}.${locale}.md`)
        return {
          title: matter(tagData.default).data.title,
          slug: tag
        }
      })
    }

    if (document.data.date) {
      // Make sure that Dates are parsed as string
      document.data.date = document.data.date.toString()
    }

    const post = {
      ...document.data,
      content: document.content,
      excerpt: document.excerpt,
      slug,
      tagList: tags,
    }

    if (filterCallback !== null) {
      return filterQuery[typeof filterCallback](post, filterCallback)
    } else {
      return post
    }
  }).filter(Boolean)

  return data
}

const filterQuery = {
  function: ({ data, content, slug, excerpt }, callback) => {
    if (callback(data)) {
      return { data, content, slug, excerpt }
    }
    return null
  },
  string: ({ data, content, slug, excerpt }, column) => {
    if (data[column]) {
      return { data, content, slug, excerpt }
    }
    return null
  }
}

function getPosts (context, filter = null, locale = 'any') {
  return _mapPosts(context, filter, locale)
}

function getPaginatedPosts (context, limit, page = 1, filterCallback = null, locale) {
  const data = _mapPosts(context, filterCallback, locale)

  data.sort((a, b) => {
    return new Date(b.data.date) - new Date(a.data.date)
  })

  const offset = (limit * page) - limit
  const totalPages = Math.ceil(data.length / limit)

  return {
    posts: data.slice(offset, limit + offset),
    totalItems: data.length,
    totalPages: totalPages,
    currentPage: page,
    nextPage: page + 1 <= totalPages ? page + 1 : false,
    previousPage: page - 1 > 0 ? page - 1 : false,
    debug: { offset, limit, length: data.length }
  }
}

function getNearestTwo (context, slug, filter, locale) {
  const posts = {
    next: null,
    previous: null
  }

  const data = _mapPosts(context, filter, locale)

  const currentIndex = data.findIndex(post => post.slug === slug)

  if (currentIndex - 1 > -1) {
    posts.previous = {
      ...data[currentIndex - 1].data,
      slug: data[currentIndex - 1].slug
    }
  }

  if (currentIndex + 1 < data.length) {
    posts.next = {
      ...data[currentIndex + 1].data,
      slug: data[currentIndex + 1].slug
    }
  }

  return posts
}

function getSlugs (context, locales) {
  const keys = context.keys()

  // eslint-disable-next-line no-useless-escape
  const slugs = [...new Set(keys.map((key, index) => key.replace(/^.*[\\\/]/, '').slice(0, -6)))]
  const items = []

  for (const locale of locales) {
    for (const slug of slugs) {
      items.push({ slug, locale })
    }
  }

  return items
}

export { getPosts, getNearestTwo, getSlugs, getPaginatedPosts }
