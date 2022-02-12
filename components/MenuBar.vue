<template>
    <v-app-bar app dark dense>
        <v-app-bar-nav-icon />
        <v-toolbar-title>
          <HeaderTitle />
        </v-toolbar-title>
        <v-spacer />
        <v-btn text>
            言語
        </v-btn>
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
      posts: []
    }
  },
})
</script>
<style>
</style>
