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
                <NodataMessage
                    :noDataFlag="NothingFlag"
                />
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
                        v-if="albums && !card.DeleteFlag"
                        class="d-flex"
                    >
                        <v-card style="flex: 1">
                            <v-img
                                :src="imgUrlPath(card.FilePath)"
                                alt="photo"
                                height="200px"
                            />
                            <v-card-actions>
                                    <SharedButton
                                        :shared="card.PublicFlag"
                                        @click="addPublicItem($event, card)"
                                    />
                                    <DeleteButton
                                        :trash="card.DeleteFlag"
                                        @delete="updateDeleteFlag($event, card)"
                                    />
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
        console.log('authToken:', authToken);
        return $axios.get('http://localhost:3010/MyData', {
            headers: {
                Authorization: `token ${authToken}`
            }
        }).then(response => {

            if (response.data.status == 'ok') {
                return { albums: response.data.items};
            } else if (response.data.status == 'NotFound') {
                return {
                    albums: null,
                    NothingFlag: true
                };
            }
        }).catch(error => {
            return { internalFailure: true };
        });
    },
    data() {
        return {
            drawer: false,
            albums: null,
            NothingFlag: false,
            UploadSuccessFlag: false,
            UploadFailureFlag: false,
            internalFailure: false,
        }
    },
    methods: {
        imgUrlPath (url: string)  {
            let imagePath = url.replace(/\\/g, "/");
            return `appData/${imagePath}`;
        },
        //アイテムの削除
        async updateDeleteFlag(event:any, card:any) {
            card.DeleteFlag = event;
            //console.log('event:', event);
            const param = {
                id: card.ID,
                delete: event
            };
            const authToken = this.$store.getters.getAuthToken;
            await axios.post('http://localhost:3010/DeleteSelectItem/', param, {
                headers: {
                    Authorization:  `token ${authToken}`
                }
            }).then(response => {
                this.uploadSuccessful();
            }).catch(error => {
                this.uploadFailure(error);
            });
        },
        //公開するアイテムを選択
        async addPublicItem(event:any, card: any) {
            card.PublicFlag = event;
            let p = {
                id: card.ID,
                public: card.PublicFlag
            };
            console.log('p:', p);
            const authToken = this.$store.getters.getAuthToken;
            await axios.post('http://localhost:3010/shareItem/', p, {
                headers: {
                    Authorization:  `token ${authToken}`
                }
            }).then(response => {
                this.uploadSuccessful();
            }).catch(error => {
                this.uploadFailure(error);
            });
        },
        uploadSuccessful () {
            //console.log('成功した');
            this.UploadSuccessFlag = true;
            setTimeout(() => {
                this.UploadSuccessFlag = false;
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
