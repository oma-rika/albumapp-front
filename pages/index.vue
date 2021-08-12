<template>
  <div class="top">
    <header>
      <NuxtLink to="/signin" class="signin-button">サインイン</NuxtLink>
    </header>
    <ul v-if="users">
      <li v-for="user in users" :key="user.id">
        {{user.id}}, {{user.title}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import https from 'https'

//let url = 'https://jsonplaceholder.typicode.com/users/1/albums'
let url = 'https://localhost:5000/api';
export default Vue.extend({
  data() {
    return {
      posts: []
    }
  },
  asyncData({params}: {params: any}) {
      const agent = new https.Agent({
          rejectUnauthorized: false
      });
      return axios.get(url, { httpsAgent: agent })
        .then((res) => {
          return {users: res.data}
        })
        .catch((e => {
          console.log(e.response);
        }))
  },
  mounted() {

  },
  methods: {

  }
})
</script>
<style>
  header {
    background-color: #24292e;
    padding: 5px 20px;
    height: 40px;
    display: flex;
  }

  .signin-button {
    padding: 4px 8px;
    border-radius: 3px;
    border: 1px solid #fff;
    color: #fff;
    background: transparent;
  }
</style>
