<template>
    <v-btn icon>
        <v-icon
            :color="favorite == 1 ? 'red' : ''"
            @click="$emit('click', !favorite)"
        >
            mdi-heart
        </v-icon>
    </v-btn>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        favorite: {
            default: 0
        }
    }
})
</script>