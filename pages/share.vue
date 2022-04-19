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
            <v-container fluid>
                <v-row justify="center">
                    <v-col
                        cols="12"
                        align="center"
                    >
                        <v-alert
                            prominent
                            type="error"
                            outlined
                            class="pt-20"
                            max-width="600"
                            v-if="NothingFlag"
                        >
                            <v-row align="center">
                                <v-col class="grow">
                                公開中のアイテムは1件もありません。
                                </v-col>
                            </v-row>
                        </v-alert>
                        <v-alert
                            v-if="internalFailure"
                            dense
                            outlined
                            type="error"
                            class="mt-12"
                            max-width="600"
                        >
                            500 Error.しばらく経ってから再度アクセスしてください。
                        </v-alert>
                    </v-col>
                </v-row>
                <v-row
                    align="center"
                    class="pt-10 pb-10"
                >
                    <v-col
                        v-for="card in albums"
                        :key="card.id"
                        cols="4"
                        sm="3"
                        xs="2"
                        v-if="albums"
                        class="d-flex"
                    >
                        <v-card style="flex: 1">
                            <v-img
                                :src="imgUrlPath(card.FilePath)" 
                                alt=""
                                aspect-ratio="1.7"
                                contain
                                height="200px"
                            />
                            <v-card-actions>
                                    <v-btn icon>
                                        <v-icon
                                            @click="addFavorite(card)"
                                            :color="card.favorite ? 'red' : ''"
                                        >
                                            mdi-heart
                                        </v-icon>
                                    </v-btn>
                                    <v-btn 
                                        icon
                                    >
                                        <v-icon
                                            @click="addPublicItem(card)"
                                            :color="card.PublicFlag ? 'primary' : ''"
                                        >
                                            mdi-account-plus
                                        </v-icon>
                                    </v-btn>
                                    <v-btn 
                                        icon
                                    >
                                        <v-icon>
                                            mdi-trash-can
                                        </v-icon>
                                    </v-btn>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <Footer />
    </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import axios, { AxiosError }  from 'axios'

export default Vue.extend({
    middleware: 'authenticated',
    asyncData({ $axios, store }) {
        console.log('asyncDataに遷移');
        const authToken = store.getters.getAuthToken;
        return $axios.get('http://localhost:3010/allShareData', {
            headers: {
                Authorization: `token ${authToken}`
            }
        }).then(response => {

            if (response.data.status == 'ok') {
                return { albums: response.data.items};
            }

            if (response.data.status == 'NotFound') {
                return { NothingFlag: true };
            }
        }).catch(error => {
            console.log('取得前にエラーが発生');
            this.internalFailure = true;
        });
    },
    data() {
        return {
            drawer: false,
            albums: null,
            NothingFlag: false,
            internalFailure: false,
        }
    },
    methods: {
        imgUrlPath (url: string)  {
            let imagePath = url.replace(/\\/g, "/");
            return `_nuxt/${imagePath}`;
        },
        async addFavorite(card:any) {
            card.favorite = !card.favorite;
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
                this.uploadSuccessful(response);
            }).catch(error => {
                this.uploadFailure(error);
            });
        },
        async addPublicItem(card: any) {
            card.PublicFlag = !card.PublicFlag;
            let p = {
                id: card.id,
                public: card.PublicFlag
            };
            console.log('p:', p);
            const authToken = this.$store.getters.getAuthToken;
            await axios.post('http://localhost:3010/shareItem/', p, {
                headers: {
                    Authorization:  `token ${authToken}`
                }
            }).then(response => {
                this.uploadSuccessful(response);
            }).catch(error => {
                this.uploadFailure(error);
            });
        },
        uploadSuccessful (response:any) {
            console.log('成功した');
        },
        uploadFailure (error: AxiosError<{error: string}>) {
            console.log('失敗した');
        },
    }
})
</script>
<style lang="scss" scoped>

</style>