import Head from 'next/head'

const HeadElement = ({
  description,
  title
}) => {
  return (
    <Head>
    <title>{title}</title>
    <meta name='description' content='Catalogue of tools and resources for academics in the field of humanities.' />
    <meta name='keywords' content='humanities, tools, tools for humanities, digital humanities, history, philosphy, arts, liberal arts, linguistic, languages, education, academia, academic tools' />
    <link rel='icon' href='/favicon.ico' />
    <link rel="stylesheet" href="https://use.typekit.net/wbs7hla.css" />
    <meta property='og:title' content={title} />
    <meta property='og:description' content={description} />
    <meta property='og:type' content='website' />
    <meta property='og:site_name' content='Humanities.tools' />
    <meta property='og:url' content='https://www.humanities.tools' />
    <meta property='og:image' content='https://www.humanities.tools/og-image.jpg' />
    <meta name='twitter:image' content='https://www.humanities.tools/og-image.jpg' />
    <meta name='twitter:image:alt' content='Catalogue of tools and resources for academics in the field of humanities' />
    <meta name="twitter:creator" content="@silencesys" />
  </Head>
  )
}

HeadElement.defaultProps = {
  description: 'Catalogue of tools and resources for academics in the field of humanities',
  title: 'humanities.tools'
}

export default HeadElement
