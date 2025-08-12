const SITE_URL = 'https://mshl.is/'

const getImage = async (imageGUID) => {
  try {
    const response = await fetch(`${SITE_URL}wp-json/wp/v2/media/${imageGUID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const imageData = await response.json()
    return {
      url: imageData.source_url,
      alt: imageData.alt_text || '',
      title: imageData.title.rendered || '',
      width: imageData.media_details?.width || 150,
      height: imageData.media_details?.height || 150,
    }
  } catch (error) {
    console.error(`Error fetching image with GUID ${imageGUID}:`, error)
    return null
  }
}

const getMenuItems = async (locale) => {
  try {
    const response = await fetch(`${SITE_URL}wp-json/wp/v2/menus/${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const menuData = await response.json()
    return menuData.items || []
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return []
  }
}

const getSiteConfiguration = async () => {
  try {
    const response = await fetch(`${SITE_URL}wp-json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return {
      title: data.name || 'Humanities Tools',
      description: data.description || 'A collection of tools for humanities research',
      url: SITE_URL,
      logo: data.site_logo || null,
      favicon: data.site_icon || null,
      social: {
        twitter: data.twitter || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        linkedin: data.linkedin || null
      }
    }
  } catch (error) {
    console.error('Error fetching site configuration:', error)
    return null
  }
}

export {
  getImage,
  getMenuItems,
  getSiteConfiguration
}