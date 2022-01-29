<template>
      <v-app>
        <v-sheet>
          <MenuBar />
          <!--#319 #4 #445 #454-->
          <v-main>
            <v-img 
              dark
              src="https://picsum.photos/id/250/1920/1080?blue=5"
              gradient="to top right, rgba(19, 84, 122, .6),
              rgba(128,208,199,.9)"
              :style="{ height: `${imgHeight}px` }"
            >
              <v-row
                align="center"
                justify="center"
                :style="{ height: `${imgHeight}px` }"
              >
                <v-col
                  cols="12"
                  class="text-center">
                  <h1 class="display-1 mb-4">File&nbsp;Uploader</h1>
                  <p>誰でも無料で使えるアップローダーサービス</p>
                </v-col>
              </v-row>
            </v-img>
            <v-container>
              <WelcomeAbout />
              <WelcomeStart />
            </v-container>
          </v-main>
          <Footer />
          </v-sheet>
      </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      imgHeight: 500,
    }
  }
})
</script>
