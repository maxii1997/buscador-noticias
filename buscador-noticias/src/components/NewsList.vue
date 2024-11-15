<template>
  <div class="news-container">
    <h2>Noticias sobre Vue, React o Angular</h2>
    
    <div class="search-bar">
      <v-text-field
        label="Buscar (Vue, React, Angular)"
        v-model="query"
        @keyup.enter="searchNews"
        class="search-input"
      />
      <v-btn variant="tonal" @click="searchNews" class="search-btn">Buscar</v-btn>
    </div>

    <v-btn @click="toggleFavoritesView" color="primary" class="favorites-btn">
      {{ showFavorites ? 'Ver Todos' : 'Ver Favoritos' }}
    </v-btn>
  
    <div v-if="loading" class="loading">Cargando...</div>
    
    <ul v-if="!loading" class="news-list">
      <li v-for="(news, index) in displayedNewsList" :key="index" class="news-item">
        <div class="news-content">
          <a :href="news.url" target="_blank" class="news-title">{{ news.title }}</a>
          <span class="news-author">por {{ news.author }}</span>
        </div>
        <v-btn icon @click="toggleFavorite(news)" class="favorite-btn">
          <v-icon>{{ isFavorite(news) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>
      </li>
    </ul>
  
    <v-btn @click="nextPage" v-if="newsList.length > 0 && !showFavorites" class="next-page-btn">
      Página Siguiente
    </v-btn>
  </div>
</template>

<script>
import { fetchNews } from '@/api/algolia';

export default {
  data() {
    return {
      query: '',
      page: 0,
      hitsPerPage: 5,
      newsList: [],
      loading: false,
      favorites: [],
      showFavorites: false,
    };
  },
  computed: {
    displayedNewsList() {
      return this.showFavorites ? this.favorites : this.newsList;
    }
  },
  methods: {
    async searchNews() {
      if (this.showFavorites) {
        this.showFavorites = false;
      }
      this.loading = true;
      try {
        this.newsList = await fetchNews(this.query, this.page, this.hitsPerPage);
      } catch (error) {
        console.error('Error al buscar noticias:', error);
      } finally {
        this.loading = false;
      }
    },
    nextPage() {
      this.page += 1;
      this.searchNews();
    },
    toggleFavorite(news) {
      const index = this.favorites.findIndex(item => item.objectID === news.objectID);
      if (index >= 0) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(news);
      }
      this.saveFavorites();
    },
    isFavorite(news) {
      return this.favorites.some(item => item.objectID === news.objectID);
    },
    saveFavorites() {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    loadFavorites() {
      const savedFavorites = localStorage.getItem('favorites');
      this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    },
    toggleFavoritesView() {
      this.showFavorites = !this.showFavorites;
    }
  },
  mounted() {
    this.loadFavorites();
  }
};
</script>

<style scoped>
.news-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #3f51b5;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  max-width: 400px;
}

.search-btn {
  height: 56px;
  min-width: 100px;
  font-size: 16px;
}

.favorites-btn {
  display: block;
  margin: 0 auto 20px auto;
}

.loading {
  text-align: center;
  font-size: 1.2em;
  color: #3f51b5;
}

.news-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.news-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.news-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.news-title {
  font-size: 1.1em;
  color: #3f51b5;
  text-decoration: none;
  flex-grow: 1;
}

.news-title:hover {
  text-decoration: underline;
}

.news-author {
  font-size: 0.9em;
  color: #757575;
  white-space: nowrap;
}

.favorite-btn {
  margin-left: 10px;
}

.next-page-btn {
  display: block;
  margin: 20px auto;
  color: #ffffff;
  background-color: #3f51b5;
}
</style>
