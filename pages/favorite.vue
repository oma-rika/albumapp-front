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
                                1件もまだ登録されていません。まずは編集画面から登録してください。
                                </v-col>
                                <v-col class="shrink">
                                    <v-btn
                                        depressed
                                        color="error"
                                        to="/dashboard"
                                    >
                                        Access dashboard
                                    </v-btn>
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
                                alt="photo"
                                height="200px"
                            />
                            <v-card-actions>
                                    <FavoriteButton
                                        v-bind:shared="card.favorite"
                                        v-on:click="updateFavoriteFlag($event, card)"
                                    />
                                    <v-btn 
                                        icon
                                    >
                                        <v-icon
                                            :color="card.PublicFlag ? 'primary' : ''"
                                        >
                                            mdi-account-plus
                                        </v-icon>
                                    </v-btn>
                                    <v-btn 
                                        icon
                                    >
                                        <v-icon
                                            :color="card.PublicFlag ? 'orange' : ''"
                                        >
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
        const authToken = store.getters.getAuthToken;
        return $axios.get('http://localhost:3010/favoriteSelectData', {
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
            return `appData/${imagePath}`;
        },
        async updateFavoriteFlag(event:any, card:any) {
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