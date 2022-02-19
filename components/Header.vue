<template>
    <v-app-bar 
      app
      dark
      dense
      elevation="1"
      :clipped-left="clippedLeft"
    >
      <slot name="navigation-toggle-button" />
      <!--<v-app-bar-nav-icon />-->
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
            <!--[{{avatarImageData.AvatarFilePath}}]-->
            <v-avatar size="24">
                <v-img 
                  v-if="avatarImageData.AvatarFilePath"
                  :src="`_nuxt/assets/${avatarImageData.AvatarFilePath}`"
                  width="24"
                  contain
                ></v-img>
                <v-icon v-else>
                  mdi-account-circle
                </v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item-group>
            <v-list-item
              v-for="(item, i ) in items"
              :key="i"
              :to="item.href"
              @click="item.text !== 'ログアウト' || logout()"
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
import axios from 'axios'

export default Vue.extend({
  async fetch () {
        const authToken = this.$store.getters.getAuthToken;
        await axios.get('http://localhost:3010/userInfo', {
            headers: {
                Authorization:  `token ${authToken}`
            }
        }).then((response) => {
          if (response.data.status == 'ok') {
            (this as any).avatarImageData = response.data.items[0];
          }          
        }).catch(error => {
            console.log('error');
        })
  },
  props: {
      clippedLeft: {
        type: Boolean,
        default: false
      }
  },
  data() {
    return {
      items: [
        { text: 'ダッシュボード', icon: 'mdi-view-dashboard-outline', href: 'dashboard'},
        { text: 'アカウント設定', icon: 'mdi-account-cog-outline', href: 'settings'},
        { text: 'ログアウト', icon: 'mdi-logout-variant', href: ''},
      ],
      avatarImageData: '',
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch("getLogout")
      return this.$router.push('/');
    }
  }
})
</script>
<style>
</style>