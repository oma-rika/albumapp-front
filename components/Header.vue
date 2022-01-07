<template>
    <v-app-bar 
      app
      dark
      dense
      clipped-left="1"
    >
      <v-app-bar-nav-icon />
      <v-toolbar-title>Page title</v-toolbar-title>

      <v-spacer />
      <v-menu
        app
        offset-x
        offset-y
        max-width="200"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            dark
          >
            <v-icon>
              mdi-account-circle
            </v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item-group>
            <v-list-item
              v-for="(item, i ) in items"
              :key="i"
              :to="item.href"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
      
  },
  data() {
    return {
      items: [
        { text: 'ダッシュボード', icon: 'mdi-view-dashboard-outline', href: 'dashboard'},
        { text: 'アカウント設定', icon: 'mdi-account-cog-outline', href: 'settings'},
        { text: 'ログアウト', icon: 'mdi-logout-variant', href: ''},
      ]
    }
  },
})
</script>
<style>
</style>