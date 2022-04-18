<template>
  <v-app-bar
    app
    dark 
    dense
  >
      <v-toolbar-title>
        <HeaderTitle />
      </v-toolbar-title>
      <v-spacer />
      <v-menu
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            text
          >
              言語
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item><nuxt-link :to="switchLocalePath('ja')">日本語</nuxt-link></v-list-item>
          <v-list-item><nuxt-link :to="switchLocalePath('en')">English</nuxt-link></v-list-item>
        </v-list>     
      </v-menu>
      <v-btn text to="/signin">
          ログイン
      </v-btn>
      <v-btn
          class="ma-2"
          outlined
          color="white"
          to="/signup"
          >
          無料会員登録
      </v-btn>
  </v-app-bar>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
    }
  },
})
</script>
<style>
</style>
