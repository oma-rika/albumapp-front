<template>
  <section>
    <Header />
    <div class="container">
      <p>[{{$store.state.message}}]</p>
    </div>
    <button @click="$store.dispatch('updateMessageAction', 'Dispatch Message')">トップページに戻る</button>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import http from 'http'


//let url = 'https://jsonplaceholder.typicode.com/users/1/albums'
//let url = 'http://localhost:3010/api';
export default Vue.extend({
  data() {
    return {
      posts: []
    }
  },
  //layout: 'Top',
  layout({store}) {
    console.log('store.state.loggedIn:', store.state.loggedIn);
    return store.state.loggedIn ? 'Top' : 'Welcome';
  },
  /*async fetch() {
      this.posts = await axios.get(url);
  },
  */
  async asyncData() {
      //const posts = await axios.get(url);
      //return { userAccount: posts.data }
  },
  methods: {

  }
})
</script>
<style>
</style>
