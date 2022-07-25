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
                <!-- 更新完了メッセージ -->
                <v-alert
                dense
                type="success"
                class="mx-auto mt-10"
                max-width="600"
                transition="fade-transition"
                v-if="UploadSuccessFlag"
                >
                    更新しました
                </v-alert>
                <!-- 更新失敗メッセージ -->
                <v-alert
                    dense
                    outlined
                    type="error"
                    class="mx-auto mt-10"
                    max-width="600"
                    transition="fade-transition"
                    v-if="UploadFailureFlag"
                >
                    更新失敗しました
                </v-alert>
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
                                    お気に入りに保存しているアイテムはありません
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
                            <v-card-subtitle>{{ card.UpdateTime | datetime }}</v-card-subtitle>
                            <v-card-actions>
                                    <v-spacer />
                                    <v-btn icon>
                                        <v-icon
                                            color='red'
                                            @click="updateFavoriteFlag(card)"
                                        >
                                            mdi-heart
                                        </v-icon>
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
            UploadSuccessFlag: false,
            UploadFailureFlag: false,
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
        imgUrlPath (url: string)  {
            let imagePath = url.replace(/\\/g, "/");
            return `appData/${imagePath}`;
        },
        async updateFavoriteFlag(card:any) {
            card.favorite = event;
            const param = {
                fileId: card.ID,
            };
            console.log('param:', param);
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
            //console.log('成功した');
            this.UploadSuccessFlag = true;
            setTimeout(() => {
                this.UploadSuccessFlag = false;
                location.reload();
            }, 1500);    
        },
        uploadFailure (error: AxiosError<{error: string}>) {
            //console.log('失敗した');
            this.UploadFailureFlag = true;
            setTimeout(() => {
                this.UploadFailureFlag = false;
            }, 1500);
        },
    }
})
</script>
<style lang="scss" scoped>

</style>