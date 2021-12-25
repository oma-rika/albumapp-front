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
                <v-img
                    :src="card.src"
                    height="200px"
                >
                </v-img>
                <v-card-subtitle v-text="card.subtitle"></v-card-subtitle>
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
export default Vue.extend({
  props: {
      
  },
  data() {
    return {
      cards: [
        { subtitle: '#1 2021/12/25 13:49', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 6 },
        { subtitle: '#2 2021/12/25 13:50', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 },
        { subtitle: '#3 2021/12/25 13:51', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 6 },
      ]
    }
  },
})
</script>