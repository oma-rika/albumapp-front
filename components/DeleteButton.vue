<template>
    <v-dialog
        v-model="dialog"
        max-width="500px"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                >
                    mdi-trash-can
                </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                アイテムをゴミ箱に移動しますか？
            </v-card-title>
            <v-card-text>
                ゴミ箱に移動したアイテムは復元することができます。30日後に完全に削除されます。
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="dialog = false"
                >
                    キャンセル
                </v-btn>
                <v-btn
                    text
                    @click="removeItem(trash)"
                >
                    ゴミ箱に移動
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        trash: {
            default: 0
        }
    },
    data () {
        return {
            dialog: false
        }
    },
    methods: {
        removeItem(param:number) {
            let p = !param;
            this.$emit('delete', p)
            this.dialog = false;
        }
    }
})
</script>