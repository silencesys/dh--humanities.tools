import fs from 'fs'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

const getDatabase = async (limit = 50, start = '') => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Published At',
      date: {
        is_not_empty: true
      }
    },
    start_cursor: start ? start : undefined,
    page_size: limit,
  });

  return response;
}

const createPage = async ({ title, link }) => {
  const response = await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      Link: {
        type: 'url',
        url: link,
      },
    },
  });

  return response;
}

const parseNotionPage = (properties, locale = 'cs', id) => {
  const coverPosition = properties.Cover?.files?.length - 1;
  const upperCaseLocale = locale.toUpperCase();
  return {
    title: properties.Name.title[0].plain_text,
    logo: null,
    description: properties[upperCaseLocale].rich_text[0].plain_text,
    tags: getTagsFromNotionPage(properties),
    website: properties.Link.url,
    cover: `/covers/${properties.Cover.files[coverPosition]?.name}` || null,
    fileUrl: properties.File?.files[0]?.file.url || null,
    id
  };
};

const downloadPictures = async (url) => {
  if (!url) return
  const imageResponse = await fetch(url)
  const arrayBuffer = await imageResponse.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  fs.writeFile(`./public/covers/${properties.Cover.files[coverPosition]?.name}`, buffer, () => console.log('finished downloading!'))
}

const getTagsFromNotionPage = (properties) => {
  return properties.Categories.multi_select.map((item) => item.name);
}

export {
  createPage,
  downloadPictures,
  getDatabase,
  parseNotionPage,
  getTagsFromNotionPage
}