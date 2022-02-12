<template>
    <v-toolbar-title>
        <v-img
          :src="require(`~/assets/albumapp_logo.png`)"
          alt="albumapp"
          aspect-ratio="1.7"
          contain
          style="{
            height: 48px;
            width: 141px;
          }"
        ></v-img>
    </v-toolbar-title>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      posts: [],
      imgHeight: 48,
      imgWidth: 141
    }
  },
})
</script>
