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
            <!--[{{ albums }}]
            [{{ maxCount }}]
            [{{ offset }}]-->
            <NodataMessage
                    :noDataFlag="NothingFlag"
            />
            <!--[{{NothingFlag}}]-->
            <div
              v-scroll="handleScroll"
              class="box"
            >
              <LinkCards :cards=albums />
              <div v-if="loading">
                <v-progress-circular
                  indeterminate
                 />
              </div>
              <div v-if="completeFlag">
                <p>検索データがもうありません。</p>
              </div>
            </div> 
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
        //console.log('TopページのautoToken:', authToken);
        await axios.get('http://localhost:3010/allShareData/0', {
            headers: {
                Authorization: `token ${authToken}`
            }
        }).then(response => {
            console.log('response:', response.data);
            if (response.data.status == 'ok') {
                const list = response.data.items;
                for (let i = 0; i < list.length; i++) {
                    list[i].FilePath = list[i].FilePath.replace(/\\/g, "/");
                }
                (this as any).albums = [...response.data.items];
                (this as any).maxCount = parseInt(response.data.maxCount[0].COUNT);
            }
            if (response.data.status == 'NotFound') {
                (this as any).NothingFlag = true;
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
        currentOffsetY: 0,
        offset: 0,
        loading: false,
        maxCount: 0,
        completeFlag: false,
        NothingFlag: false
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.completeFlag = false;
  },
  methods: {
    handleScroll: function(env:any, el:any) {
      
      //console.log('handlescroll');
      /*if (window.scrollY > 50) {
        el.setAttribute(
          'style',
          'opacity: 1; transform: translate3d(0, -10px, 0)'
        )
      }
      return window.scrollY > 100
      */
      

      if (this.completeFlag) return;
      
      if (window.pageYOffset >= this.currentOffsetY) {
        console.log('loading');
        this.currentOffsetY = (window.innerHeight + window.pageYOffset) / 2;

        if (this.offset <= this.maxCount) {
          this.getContents();
        } else {
          this.completeFlag = true;
        }
      }
    },
    getContents() {
      this.loading = true;

      setTimeout(() => {
        if (this.offset <= this.maxCount) {
          this.offset += 1; //<-offset
        }
        
        this.loading = false;
        const authToken = this.$store.getters.getAuthToken;

        axios.get(`http://localhost:3010/allShareData/${this.offset}`, {
            headers: {
                Authorization: `token ${authToken}`
            }
        }).then(response => {

            if (response.data.status == 'ok') {
                const list = response.data.items;
                for (let i = 0; i < list.length; i++) {
                    list[i].FilePath = list[i].FilePath.replace(/\\/g, "/");
                }
                (this as any).albums.push(...response.data.items);
                (this as any).maxCount = parseInt(response.data.maxCount[0].COUNT);
            }

            if (response.data.status == 'NotFount') {
                console.log('1件もデータない');
                return { albums: '1件もデータない' };
            }

        }).catch(error => {
            console.log('取得前にエラーが発生');
            //this.internalFailure = true;
        });
      
      }, 1500)
    }
  }
})
</script>
<style lang="scss">
.box {
  transition: 1.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
</style>
