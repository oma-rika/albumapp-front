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
              <v-col
                  v-for="card in albums.items"
                  :key="card.id"
                  cols="4"
                  sm="3"
                  xs="2"
                  v-if="albums.status == 'ok'"
                  class="d-flex"
              >
                  <v-card style="flex: 1">
                      <!--[{{base64Decode(card.Path)}}]-->
                      <v-img
                          :src="base64Decode(card.Path)"
                          aspect-ratio="1.7"
                          contain
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
                            <v-icon
                              @click="publicItem(card)"
                            >
                              <v-icon>mdi-lock</v-icon>
                            </v-icon>
                          </v-btn>
                          <!--<v-dialog
                            v-model="dialog"
                            width="500"
                          >
                            <template v-slot:activator="{on, attrs }">
                              <v-btn 
                                icon
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon>mdi-account-plus</v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-title>共有リンクを取得</v-card-title>
                              <v-card-text　class="pb-0">
                                  このリンクを知っている全員が閲覧できます。
                                  <v-row>
                                    <v-col
                                      cols="12"
                                      sm="8"
                                    >
                                      <v-text-field
                                        v-model="linkPath"
                                        filled
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      cols="12"
                                      sm="4"
                                      align-self="center"
                                    >
                                      <v-btn 
                                        text
                                        @click="clipCopy"
                                      >リンクをコピー</v-btn> 
                                    </v-col>
                                  </v-row>
                                  <v-chip
                                    color="primary"
                                    outlined
                                    pill
                                  >
                                  ファイル名
                                  </v-chip>
                                  <v-card-actions class="px-0 pu-0">
                                    <v-spacer />
                                    <v-btn>
                                      キャンセル
                                    </v-btn>
                                    <v-btn
                                      type="submit"
                                      color="primary"
                                      class="white--text"
                                    >
                                      完了
                                    </v-btn>
                                  </v-card-actions>
                                </v-form>
                              </v-card-text>
                            </v-card>
                          </v-dialog>-->
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
      dialog: false,
      params: {
          //TODO 削除する
          user: {
              email: '',
          }
      },
      linkPath: ''
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
    },
    clipCopy() {
      navigator.clipboard.writeText(this.linkPath);
    },
    publicItem(card:any) {
      console.log('publicItemを選択');
    }
  },
})
</script>
<style>
</style>
