<template>
    <v-btn icon>
        <v-icon
            :color="shared == 1 ? 'primary' : ''"
            @click="$emit('click', !shared)"
        >
            mdi-account-plus
        </v-icon>
    </v-btn>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        shared: {
            default: 0
        }
    }
})
</script>
