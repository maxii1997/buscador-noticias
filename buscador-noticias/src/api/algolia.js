import axios from 'axios';

const API_URL = 'https://hn.algolia.com/api/v1/search';

export async function fetchNews(query, page = 0, hitsPerPage = 5) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        query,
        tags: 'story',
        page,
        hitsPerPage
      }
    });
    return response.data.hits;
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    throw error;
  }
}
