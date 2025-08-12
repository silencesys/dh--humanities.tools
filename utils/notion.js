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
  const upperCaseLocale = locale.toUpperCase();
  return {
    unique_id: `${properties.ID.unique_id.prefix}-${properties.ID.unique_id.number}`,
    title: properties.Name.title[0].plain_text,
    logo: null,
    description: properties[upperCaseLocale].rich_text[0].plain_text,
    institution: properties.Institution.select.name,
    tags: getTagsFromNotionPage(properties),
    website: properties.Link.url,
    id
  };
};

const downloadPictures = async (url, name) => {
  if (!url || process.env.NODE_ENV === 'development') return
  const imageResponse = await fetch(url)
  const arrayBuffer = await imageResponse.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  fs.writeFile(`./public/covers/${name}`, buffer, () => console.log('finished downloading!'))
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