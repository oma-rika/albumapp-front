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
                <!--<NodataMessage
                    :noDataFlag="NothingFlag"
                />-->
                <v-row
                    align="center"
                    class="pt-10 pb-10"
                >
                    <v-col
                        v-for="card in items"
                        :key="card.id"
                        cols="4"
                        sm="3"
                        xs="2"
                        v-if="items && card.DeleteFlag == 1"
                        class="d-flex"
                    >
                        <v-card style="flex: 1">
                            <v-img
                                :src="imgUrlPath(card.FilePath)"
                                alt="photo"
                                height="200px"
                            />
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-menu
                                        offset-y
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-btn 
                                                icon
                                                v-on="on"
                                            >
                                                <v-icon>
                                                    mdi-dots-vertical
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <v-list 
                                            dense 
                                            class="text-caption"
                                        >
                                            <v-list-item>
                                                <v-btn
                                                    text
                                                    @click="restoreItem(card)"
                                                >
                                                    復元する
                                                </v-btn>
                                            </v-list-item>
                                            <v-list-item>完全に削除する</v-list-item>
                                        </v-list>
                                    </v-menu>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import axios, { AxiosError }  from 'axios'
export default Vue.extend({
    middleware: 'authenticated',
    asyncData({ $axios, store }) {
        const authToken = store.getters.getAuthToken;
        return $axios.get('http://localhost:3010/TrashData', {
            headers: {
                Authorization: `token ${authToken}`
            }
        }).then(response => {

            if (response.data.status == 'ok') {
                return { items: response.data.items};
            } else if (response.data.status == 'NotFound') {
                return {
                    items: null,
                    NothingFlag: true
                };
            }
        }).catch(error => {
            console.log('取得前にエラーが発生');
            return { internalFailure: true };
        });
    }, 
    data() {
        return {
            drawer: false,
            items: null,
            NothingFlag: false,
            internalFailure: false,
        }
    },
    methods: {
        imgUrlPath (url: string)  {
            let imagePath = url.replace(/\\/g, "/");
            return `appData/${imagePath}`;
        },
        //復元を選択
        async restoreItem(card:any) {
            const param = {
                id: card.id,
                delete: false
            };
            //console.log('param', param);
            const authToken = this.$store.getters.getAuthToken;
            await axios.post('http://localhost:3010/restoreSelectItem/', param, {
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
            //後で確認
            location.reload();
        },
        uploadFailure (error: AxiosError<{error: string}>) {
            console.log('失敗した');
        },
    }
})
</script>
<style lang="scss" scoped>

</style>