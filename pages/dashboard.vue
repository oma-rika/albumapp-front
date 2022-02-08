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
        <!--<v-navigation-drawer
           v-model="drawer"
           app
        >
            <template v-slot:prepend>
                <v-list-item two-line>
                    <v-list-item-avatar>
                        <img src="https://randomuser.me/api/portraits/women/81.jpg">
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>User Name</v-list-item-title>
                        <v-list-item-subtitle />
                    </v-list-item-content>
                </v-list-item>
            </template>
            <v-divider></v-divider>
            <v-list
                dense
                nav
            >
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>test</v-toolbar-title>
        </v-app-bar>-->
        <v-main>
            <v-container>
                <h2>表示画面に移動</h2>
                <p>this.is dashboard</p>
                <v-row
                    align="center"
                    justify="center"
                >
                    <v-col 
                        :key="i"
                        cols="12"
                        class="d-flex justify-space-between mb-10"
                    >
                        <template v-for="(menu, i) in menuList">
                            <v-hover v-slot="{ hover }">
                                <v-card
                                    max-width="350"
                                    outlined
                                    :elevation="hover ? 12 : 2"
                                    :class="{ 'on-hover': hover }"
                                >
                                    <v-list-item>
                                        <v-list-item-avatar
                                            title
                                            size="80"
                                            color="grey"
                                        >
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-title
                                                class="text-h5 mb-1"
                                            >
                                                <nuxt-link 
                                                    to="project/2"
                                                    class="body-2 text-decoration-none"
                                                >
                                                    {{ menu.title }}
                                                </nuxt-link>
                                            </v-list-title>
                                            <v-list-subtitle>
                                                {{ menu.text }}
                                            </v-list-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card>
                            </v-hover>
                        </template>
                    </v-col>
                </v-row>
                <h2 class="mb-5">サービス一覧</h2>
                 <v-row
                    align="center"
                    justify="center"
                >
                    <v-col 
                        cols="12"
                        class="d-flex justify-space-between"
                    >
                        <template v-for="(service, i) in serviceList">
                            <v-hover v-slot="{ hover }">
                                <v-card
                                    max-width="350"
                                    outlined
                                    :elevation="hover ? 12 : 2"
                                    :class="{ 'on-hover': hover }"
                                >
                                    <v-list-item>
                                        <v-list-item-avatar
                                            title
                                            size="80"
                                            color="grey"
                                        >
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-title
                                                class="text-h5 mb-1"
                                            >
                                                <nuxt-link 
                                                    to="project/2"
                                                    class="body-2 text-decoration-none"
                                                >
                                                    {{ service.title }}
                                                </nuxt-link>
                                            </v-list-title>
                                            <v-list-subtitle>
                                                {{ service.text }}
                                            </v-list-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card>
                            </v-hover>
                        </template>
                    </v-col>
                </v-row>
            </v-container>
            <nuxt-link to="project/2">アルバム</nuxt-link>
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
                { title: 'Album', icon: 'mdi-image'},
                { title: 'Favorite', icon: 'mdi-heart'},
                { title: 'Group', icon: 'mdi-account-multiple-plus'}
            ],
            menuList: [
                {
                    title: 'アルバムを表示',
                    text: '投稿したものを一覧表示する。',
                    link: '#'
                },
                {
                    title: 'お気に入りを表示',
                    text: 'お気に入り登録したものを一覧表示する。',
                    link: '#'                   
                },
                {
                    title: '共有フォルダを表示',
                    text: '共有したものを一覧表示する。',
                    link: '#'
                }
            ],
            serviceList: [
                {
                    title: 'アップロード画面に移動',
                    text: 'デスクトップにあるデータを選択して投稿する。',
                },
                {
                    title: '共有フォルダを作成',
                    text: '共有フォルダを作成して共有したい相手を選択する。'
                },
                {
                    title: '編集画面に移動',
                    text: '投稿したデータを削除したり更新できる。'
                }
            ]
        }
    }
})
//serviceList[0].link = 'aaa';
</script>