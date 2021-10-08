<template>
  <section>
    <Header />
    <div class="container">
      <div class="top" v-if="users">
        <ul>
          <li v-for="user in users" :key="user.id">
            {{user.id}}, {{user.title}}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import https from 'https'


let url = 'https://jsonplaceholder.typicode.com/users/1/albums'
//let url = 'https://localhost:5000/api';
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
<<<<<<< HEAD
<style>
</style>
=======

>>>>>>> 3c7acaa55edae3b9a414130d7bd64a9d1e649b33
