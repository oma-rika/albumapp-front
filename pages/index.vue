<template>
  <section>
    <Header />
    aaaa
    <div class="container" v-if="userAccount">
      [{{userAccount}}]
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import http from 'http'


//let url = 'https://jsonplaceholder.typicode.com/users/1/albums'
let url = 'http://localhost:3010/api';
export default Vue.extend({
  data() {
    return {
      posts: []
    }
  },
  /*async fetch() {
      this.posts = await axios.get(url);
  },
  */
  async asyncData() {
      const posts = await axios.get(url);
      return { userAccount: posts.data }
  },
  methods: {

  }
})
</script>
<style>
</style>
