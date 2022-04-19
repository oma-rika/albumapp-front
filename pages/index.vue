<template>
  <section>
    <Header />
    <v-container fluid>
    </v-container>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import http from 'http'

export default Vue.extend({
  data() {
    return {
      posts: []
    }
  },
  layout({store}) {
    return store.state.loggedIn ? 'Top' : 'Welcome';
  }
})
</script>
<style>
</style>
