<template>
    <v-row justify="center">
        <v-col
            cols="12"
            align="center"
            v-if="noDataFlag"
            class="mt-10"
        >
            <v-alert
                prominent
                type="error"
                outlined
                class="pt-20"
                max-width="600"
            >
                <v-row align="center">
                    <v-col class="grow">
                        1件もまだ登録されていません。まずは編集画面から登録してください。
                    </v-col>
                    <v-col class="shrink">
                        <v-btn
                            depressed
                            color="error"
                            to="/dashboard"
                        >
                            Access dashboard
                        </v-btn>
                    </v-col>
                </v-row>
            </v-alert>
        </v-col>
    </v-row>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        noDataFlag: {
            type: Boolean,
            default: false
        }
    }
})
</script>