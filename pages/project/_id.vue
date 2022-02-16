<template>
  <section>
    <v-app>
      <MenuBar />
      <v-main>
        <v-container fluid>
          <v-alert
            prominent
            type="error"
            outlined
            class="pt-20 pb-10"
            v-if="!albums || albums.status == 'NotFound'"
          >
            <v-row align="center">
              <v-col class="grow">
              1件もまだ登録されていません。まずは編集画面から登録してください。
              </v-col>
              <v-col class="shrink">
                <v-btn
                    depressed
                    color="error"
                    link="/dashboard"
                  >
                    Access dashboard
                  </v-btn>
              </v-col>
            </v-row>
          </v-alert>
          <v-row
              align="center"
              class="pt-10 pb-10"
          >
            <!--[{{albums}}]-->
              <v-col
                  v-for="card in albums.items"
                  :key="card.id"
                  :cols="card.flex"
                  v-if="albums.status == 'ok'"
              >
                  <v-card>
                      <!--[{{base64Decode(card.Path)}}]-->
                      <v-img
                          :src="base64Decode(card.Path)"
                          height="200px"
                      >
                      </v-img>
                      <!--<v-card-subtitle v-text="card.subtitle"></v-card-subtitle>-->
                      <v-card-actions>
                          <v-spacer />
                          <v-btn icon>
                              <v-icon
                              @click="addFavorite(card)"
                              :color="card.favorite ? 'red' : '' "
                              >
                                mdi-heart
                              </v-icon>
                          </v-btn>
                          <v-btn icon>
                              <v-icon>mdi-tray-arrow-down</v-icon>
                          </v-btn>
                          <v-btn icon>
                              <v-icon>mdi-share-variant</v-icon>
                          </v-btn>
                      </v-card-actions>
                  </v-card>
              </v-col>
          </v-row>
        </v-container>
        <Footer />
      </v-main>
    </v-app>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios, { AxiosError }  from 'axios'
import https from 'https'
import http from 'http'
import { Buffer } from 'buffer';

export default Vue.extend({
  middleware: 'authenticated',
  asyncData({$axios, params, store }) {
    //const authToken = store.getters.getAuthToken;
    //console.log('authToken:', authToken);
    //console.log('params:', params);
    const userId = params.id;

    return $axios.get(`http://localhost:3010/albums/${userId}/1`)
    .then(response => {
      return { albums: response.data };
    }).catch(error => {
      console.log('取得前にエラーが発生した');
      error({ statusCode: 404, message: 'ページが見つかりません'})
    });
    //練習用に残しておく
    /*return $axios.get(`http://localhost:3010/albums/${userId}/1`, {
      headers: {
        Authorization: `token ${authToken}`
      }
    }).then(response => {
      return { albums: response.data };
    }).catch(error => {
      console.log('取得前にエラーが発生した');
      error({ statusCode: 404, message: 'ページが見つかりません'})
    });*/
  },
  data() {
    return {
      albums: {

      },
    }
  },
  methods: {
    base64Decode(Path:Buffer) {
      const bufferToBase64 = Buffer.from(Path).toString('base64');
      const decodeObject = Buffer.from(bufferToBase64, 'base64').toString();
      //console.log('decodeObject:', decodeObject);
      const imagePath = decodeObject;
      return imagePath;
    },
    async addFavorite(card:any) {
        card.favorite = !card.favorite;
        console.log('card.favorite:', card.favorite)
        let p =  {
            id: card.id,
            favorite: card.favorite
        };
        const authToken = this.$store.getters.getAuthToken;
        await axios.post('http://localhost:3010/favorite/', p, {
          headers: {
              Authorization:  `token ${authToken}`
          }
        }).then(response => {
          (this as any).addFavoriteSuccessful(response);
        }).catch(error => {
          (this as any).addFavoriteFailure(error);
        });
    },
    addFavoriteSuccessful (response:any) {
        console.log('成功');
    },
    addFavoriteFailure (error: AxiosError<{error: string}>) {
      console.log('失敗');
    }
  },
})
</script>
<style>
</style>
