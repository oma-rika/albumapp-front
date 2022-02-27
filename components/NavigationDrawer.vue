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
                     <v-img 
                        :src="require(`../assets/${userInfo.avatar}`)" alt="アバター画像"
                        contain
                        v-if="userInfo.avatar"
                    />
                    <v-icon v-else>
                        mdi-account-circle
                    </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title
                        v-if="userInfo && userInfo.NickName"
                    >
                        {{ userInfo.NickName }}
                    </v-list-item-title>
                    <v-list-item-title
                        v-else-if="userInfo && userInfo.userName"
                    >
                        {{ userInfo.userName }}
                    </v-list-item-title>
                    <v-list-item-title
                        v-else
                    >
                        ゲストさん
                    </v-list-item-title>
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
                :to="item.href"
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
                { title: 'Album', icon: 'mdi-image', href: 'album' },
                { title: 'Favorite', icon: 'mdi-heart', href: 'favorite' },
                { title: 'Share', icon: 'mdi-account-multiple-plus', href: 'share' },
                { title: 'dashboard', icon: 'mdi-view-dashboard-outline', href: 'dashboard' }
            ],
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
        },
        userInfo(): any {
            return (this as any).$store.getters.getCurrentUserInfo;
        }
    }
})
</script>