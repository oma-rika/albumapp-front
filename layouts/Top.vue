<template>
  <v-app>
    <Header
      #navigation-toggle-button
      clipped-left
    >
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
        />
    </Header>
    <NavigationDrawer
      :drawer.sync="drawer"
    />
    <v-main>
        <v-container>
            <LinkCards />
        </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: 'authenticated',
  data() {
    return {
        drawer: false
    }
  }
})
</script>
<style>
</style>