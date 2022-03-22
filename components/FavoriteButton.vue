<template>
    <v-btn icon>
        <v-icon
            :color="shared == 1 ? 'red' : ''"
            v-on:click="$emit('click', !shared)"
        >
            mdi-heart
        </v-icon>
    </v-btn>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        shared: {
            type: Boolean,
            default: false
        }
    }
})
</script>