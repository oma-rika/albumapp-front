<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
    </v-navigation-drawer>
    <Header />
    <v-main>
      <LinkCards />
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: 'authenticated',
  data() {
    return {

    }
  }
})
</script>