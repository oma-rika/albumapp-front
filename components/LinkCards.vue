<template>
    <v-row
        align="center"
        class="pt-10 pb-10"
    >
        <v-col
            v-for="card in cards"
            :key="card.subtitle"
            :cols="card.flex"
        >
            <v-card>
                <v-img :src="`appData/${card.FilePath}`" height="200px" />
                <v-card-subtitle>{{ card.UpdateTime | datetime }}</v-card-subtitle>
                <v-card-actions>
                    <v-spacer />
                    <FavoriteButton
                        v-bind:shared="card.favorite"
                        v-on:click="updateFavoriteFlag($event, card)"
                    />
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
</template>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  props: {
      cards: {
          type: Array,
          default: () => []
      }
  },
  data() {
    return {
      cardsTest: [
        { subtitle: '#1 2021/12/25 13:49', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 6 },
        { subtitle: '#2 2021/12/25 13:50', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 },
        { subtitle: '#3 2021/12/25 13:51', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 6 },
      ]
    }
  },
  filters: {
      datetime: function(val:any) {
        if (!val) return;
        const date = new Date(val);
        const yyyy = date.getFullYear();
        console.log(yyyy);
        // 0埋めにする
        const MM = `0${date.getMonth() + 1}`.slice(-2);
        const dd = `0${date.getDate()}`.slice(-2);
        const HH = `0${date.getHours()}`.slice(-2);
        const mm = `0${date.getMinutes()}`.slice(-2);
        const ss = `0${date.getSeconds()}`.slice(-2);

        return `${yyyy}年${MM}月${dd}日 ${HH}:${mm}:${ss}`;
      }
  },
  methods: {
        async updateFavoriteFlag(event, card) {
            card.favorite = event;
            const param = {
                id: card.id,
                favorite: event
            };
            const authToken = this.$store.getters.getAuthToken;
            await axios.post('http://localhost:3010/favorite/', param, {
                headers: {
                    Authorization:  `token ${authToken}`
                }
            }).then(response => {
                this.addFavoriteSuccessful(response);
            }).catch(error => {
                this.addFavoriteFailure(error);
            });
        },
        addFavoriteSuccessful (response:any) {
            console.log('成功した');
        },
        addFavoriteFailure (error: AxiosError<{error: string}>) {
            console.log('失敗した');
        },
  }
})
</script>
