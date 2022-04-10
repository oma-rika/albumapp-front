<template>
    <v-fade-transition>
        <v-btn 
            @click="goToTop"
            fixed
            right
            dark
            large
            fab
            color="primary"
            v-show="this.scrollY > 200"
            class="mb-3"
        >
            <v-icon dark>
                mdi-chevron-up 
            </v-icon>
        </v-btn>
    </v-fade-transition>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data() {
        return {
            timer: null,
            scrollY: 0
        }
    },
    created () {
        window.addEventListener('scroll', this.handleScroll)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        //スムーススクロール
        goToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        },
        handleScroll() {
            this.scrollY = window.scrollY;
        }
    }
})
</script>