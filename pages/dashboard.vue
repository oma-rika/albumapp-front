<template>
    <v-app id="inspire">
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
                <h2 class="mb-5">ダッシュボード</h2>
                <h4 class="mb-5">表示画面に移動</h4>
                <v-row
                    align="center"
                >
                    <v-col
                        class="mb-md-10"
                        v-for="(menu, i) in menuList"
                        :key="i"
                        cols="12"
                        md="4"
                        sm="6"
                    >
                            <v-hover v-slot="{ hover }">
                                <v-card
                                    outlined
                                    :elevation="hover ? 12 : 2"
                                    :class="{ 'on-hover': hover }"
                                    class="d-flex justify-space-between align-stretch"
                                >
                                    <v-card-text>
                                        <v-list-item>
                                            <v-list-item-icon
                                                title
                                                size="80"
                                            >
                                                <v-icon v-text="menu.icon" />
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title
                                                    class="text-h5 mb-1"
                                                >
                                                    <nuxt-link
                                                        :to="menu.link"
                                                        class="body-2 text-decoration-none"
                                                        v-if="menu.link"
                                                    >
                                                        {{ menu.title }}
                                                    </nuxt-link>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="vlist-subtitle">
                                                    {{ menu.text }}
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card-text>
                                </v-card>
                            </v-hover>
                    </v-col>
                </v-row>
                <h4 class="mt-10 mt-md-0 mb-5">サービス一覧</h4>
                <v-row
                    align="center"
                    class="mb-sm-15"
                    v-for="(service, i) in serviceList"
                >
                    <v-col
                        class="mb-md-10"
                        cols="12"
                        md="4"
                        sm="6"
                    >
                        <v-hover v-slot="{ hover }">
                            <v-card
                                outlined
                                :elevation="hover ? 12 : 2"
                                :class="{ 'on-hover': hover }"
                                :key="i"
                                class="d-flex justify-space-between align-stretch"
                            >
                                <v-card-text>
                                    <v-list-item>
                                        <v-list-item-icon
                                            title
                                            size="80"
                                        >
                                            <v-icon v-text="service.icon" />
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                class="text-h5 mb-1"
                                            >
                                                <nuxt-link
                                                    :to="service.link"
                                                    class="body-2 text-decoration-none"
                                                >
                                                    {{ service.title }}
                                                </nuxt-link>
                                            </v-list-item-title>
                                            <v-list-item-subtitle class="vlist-subtitle">
                                                {{ service.text }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
            </v-container>
            <!--<v-btn @click="Test">テストボタン</v-btn>-->
        </v-main>
        <Footer />
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    middleware: 'authenticated',
    data() {
        return {
            userId: '',
            drawer: false,
            items: [
                { title: 'Album', icon: 'mdi-image-multiple'},
                { title: 'Favorite', icon: 'mdi-heart'},
                { title: 'Share', icon: 'mdi-account-multiple-plus'}
            ],
            menuList: [
                {
                    title: 'アルバムを表示',
                    text: '投稿したものを一覧表示する。',
                    link: '#',
                    icon: 'mdi-image-multiple',
                },
                {
                    title: 'お気に入りを表示',
                    text: '追加したものを一覧表示する。',
                    link: '#',
                    icon: 'mdi-heart'
                },
                {
                    title: '共有した画像を表示',
                    text: '共有したものを一覧表示する。',
                    link: '#',
                    icon: 'mdi-account-multiple-plus'
                }
            ],
            serviceList: [
                {
                    title: 'アップロード画面に移動',
                    text: 'デスクトップにあるデータを選択して投稿する。',
                    link: 'upload',
                    icon: 'mdi-tray-arrow-up'
                }
            ]
        }
    },
    mounted() {
        const userId = this.$store.getters.getCurrentUserId;
        console.log('userId:', userId);
        if (userId) {
            this.menuList[0].link = 'album';
            this.menuList[1].link = 'favorite';
            this.menuList[2].link = 'share';
        }
        console.log('menuList:', this.menuList);
    },
    methods: {
        async Test() {
            const authToken = this.$store.getters.getAuthToken;
            await axios.get('http://localhost:3010/api', {
                headers: {
                    Authorization:  `token ${authToken}`
                }
            }
            ).then((response) => {
                console.log('アクセス成功');
                console.log(response);
            }).catch(error => {
                console.log('error');
            })
        },
    }
})
</script>
<style lang="scss" scoped>
.vlist-subtitle {
    white-space: normal;
}
</style>
