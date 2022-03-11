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
                <!--{{ card }}-->
                <!--{{card.FilePath | dirPath}}-->
                <!--<v-card-subtitle v-text="{{ card.UpdateTime | datetime}}"></v-card-subtitle>
                <v-img
                    :src="dirPath(card.FilePath)" alt="アバター画像"
                    height="200px"
                />
                <v-card-subtitle v-text="{{ card.UpdateTime }}"></v-card-subtitle>
                <v-card-actions>
                    <v-spacer />
                    <v-btn icon>
                        <v-icon>mdi-heart</v-icon>
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
      /*dirPath: function(val:string) {
          if (!val) return '';
          return  '~/' + val.replace(/\\/g, "/");
      }*/
      datetime: function(val:string) {
        if (!val) return;
        console.log(val);
        //console.log(typeof datetime);
        //const date = new Date(val * 1000);
        const yyyy = `${val.getFullYear()}`;
        // .slice(-2)で文字列中の末尾の2文字を取得する
        // `0${date.getHoge()}`.slice(-2) と書くことで０埋めをする
        //const MM = `0${date.getMonth() + 1}`.slice(-2); // getMonth()の返り値は0が基点
        //const dd = `0${date.getDate()}`.slice(-2);
        //const HH = `0${date.getHours()}`.slice(-2);
        //const mm = `0${date.getMinutes()}`.slice(-2);
        //const ss = `0${date.getSeconds()}`.slice(-2);

        //return `${yyyy}年${MM}月${dd}日 ${HH}:${mm}:${ss}`;
        return `11年';
      }
  },
  methods: {
      dirPath: function(val:string) {
          if (!val) return '';
          return  '_nuxt/' + val.replace(/\\/g, "/");
      }
  }
})
</script>
