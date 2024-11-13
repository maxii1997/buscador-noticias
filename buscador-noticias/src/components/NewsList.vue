<template>
    <div>
      <h2>Noticias sobre Vue, React o Angular</h2>
      <v-text-field label="Buscar (Vue, React, Angular)" v-model="query" @keyup.enter="searchNews" />
      <v-btn variant="tonal" @click="searchNews">Buscar</v-btn>
  
      <div v-if="loading">Cargando...</div>
      <ul v-if="!loading">
        <li v-for="(news, index) in newsList" :key="index">
          <a :href="news.url" target="_blank">{{ news.title }}</a> por {{ news.author }}
        </li>
      </ul>
  
      <v-btn @click="nextPage" v-if="newsList.length > 0">Página Siguiente</v-btn>
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
      };
    },
    methods: {
      async searchNews() {
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
      }
    }
  };
  </script>
  
  <style scoped>
  /*  */
  </style>
  