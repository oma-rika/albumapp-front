<template>
    <v-row class="ma-0">
      <v-avatar
        size="36"
        color="purple"
        class="mr-2 header-title"
        @click="$router.push('/')"
      >
        <v-icon dark>
          mdi-folder-image
        </v-icon>
      </v-avatar>
      <v-toolbar-title 
        class="hidden-xs-only header-title"
        @click="$router.push('/')"
      >
        Album App
      </v-toolbar-title>
    </v-row>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {

    }
  }
})
</script>
<style lang="scss">
.header-title {
  cursor: pointer;
}
</style>
