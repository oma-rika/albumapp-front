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
            <LinkCards :cards=albums />
            [{{ albums }}]
        </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  middleware: 'authenticated',
  async fetch () {
        const authToken = this.$store.getters.getAuthToken;
        console.log('TopページのautoToken:', authToken);
        await axios.get('http://localhost:3010/allShareData', {
            headers: {
                Authorization: `token ${authToken}`
            }
        }).then(response => {

            if (response.data.status == 'ok') {
                console.log('apiは通信できた');
                console.log('response.data:', response.data);
                (this as any).albums = response.data.items;
            }

            if (response.data.status == 'NotFount') {
                console.log('1件もデータない');
                return { albums: '1件もデータない' };
            }

        }).catch(error => {
            console.log('取得前にエラーが発生');
            //this.internalFailure = true;
        });
  },
  data() {
    return {
        drawer: false,
        albums: null,
    }
  }
})
</script>
<style>
</style>
