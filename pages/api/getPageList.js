// import fs from 'fs'
// import path from 'path'
// import matter from 'gray-matter'

// const getPageList = (req, res) => {
//   const dirRelativeToPublicFolder = 'pages'
//   const locale = req.query.locale || 'any'

//   const dir = path.resolve('./content', dirRelativeToPublicFolder)

//   let filenames = fs.readdirSync(dir);

//   if (locale !== 'any') {
//     filenames = filenames.filter(file => file.includes(`.${locale}.`))
//   }

//   const pages = filenames.map(filename => {
//     const filePath = path.join(dir, filename)
//     const fileContents = fs.readFileSync(filePath, 'utf8')
//     const { data } = matter(fileContents)
//     return {
//       slug: filename.replace(/^.*[\\\/]/, '').slice(0, -6),
//       ...data
//     }
//   })

//   res.statusCode = 200
//   res.json(pages);
// }

// export default getPageList
