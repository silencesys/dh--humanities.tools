import React from 'react'
import Head from '@components/Head'
import ReactMarkdown from 'react-markdown'
import { getSlugs } from '@utils/api'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'

export default function Page ({ data, content }) {
  return (
    <main className='mainContainer'>
      <Head title={`${data.title} | humanities.tools`} />

      <div className='content__page'>
        <h2 className='page__title'>{data.higlight}</h2>
        <ReactMarkdown className='section__text'>
          {content}
        </ReactMarkdown>
      </div>
    </main>
  )
}

export async function getStaticProps ({ params: { slug }, locale }) {
  const content = path.resolve(`./content/pages/${slug}.${locale}.md`)
  const fileContent = fs.readFileSync(content, 'utf8')
  const data = matter(fileContent)

  return {
    props: {
      data: data.data,
      content: data.content,
      slug: slug
    }
  }
}

export async function getStaticPaths ({ locales }) {
  const pages = ((context) => {
    return getSlugs(context, locales)
  })(require.context('../content/pages', true, /\.\/.*\.md$/))

  const paths = pages.map((pages) => {
    return { params: { slug: pages.slug }, locale: pages.locale }
  })

  return {
    paths,
    fallback: false
  }
}
