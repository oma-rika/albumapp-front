<template>
    <v-app id="inspire">
        <v-navigation-drawer
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
        </v-app-bar>
        <v-main>
            <p>this.is dashboard</p>
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
            ]
        }
    }
})

</script>