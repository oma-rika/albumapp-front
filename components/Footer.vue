<template>
    <v-footer app>
        <v-col 
            cols="12"
            class="text-center"
        >
            {{ this.year }}&copy;OmataR WebApp
        </v-col>
        <ReturnToTop />
    </v-footer>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      year: 0,
    }
  },
  created() {
    const date = new Date();
    this.year = date.getFullYear();
  },
  methods: {

  }
})
</script>
<style lang="scss" scoped>

</styl>
