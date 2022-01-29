<template>
    <v-navigation-drawer
        v-model="setDrawer"
        app
        clipped
        :mobile-breakpoint="mobileBreakpoint"
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
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    props: {
        drawer: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            userId: '',
            mobileBreakpoint: 960,
            items: [
                { title: 'Album', icon: 'mdi-image'},
                { title: 'Favorite', icon: 'mdi-heart'},
                { title: 'Group', icon: 'mdi-account-multiple-plus'}
            ],
            count: 1,
        }
    },
    computed: {
        setDrawer:{
            get(): Boolean {
                return (this as any).drawer;
            },
            set(newVal:Boolean) {
                return this.$emit('update:drawer', newVal)
            }
        }
    }
})
</script>