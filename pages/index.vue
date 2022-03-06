<template>
  <section>
    <Header />
    <v-container fluid>
      <v-card
        flat
        title
        color="transparent"
      >
      <!-- 追加 -->
        <v-card-title>
          nuxt-i18nの検証
        </v-card-title>
        <v-card-text>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>en</th>
                  <th>ja</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(path, i) in ['signup', 'login']"
                  :key="`path-${i}`"
                >
                  <td>{{ path }}</td>
                  <td>{{ $t(`title.${path}`) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <!-- ここまで -->
      </v-card>
      <v-btn color="primary">テスト</v-btn>
    </v-container>
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
    //return store.state.loggedIn ? 'Top' : 'Welcome';
    //return 'Top';
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
