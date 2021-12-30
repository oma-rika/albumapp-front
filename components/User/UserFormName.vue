<template>
    <v-text-field
        :value="name"
        :rules="reles"
        :counter="maxLength"
        @input="$emit('update:name', $event)"
        label="ユーザー名を入力"
        placeholder="あなたの表示名"
        outlined
    />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    data() {
        const maxLength = 30
        return {
            maxLength,
            reles: [
                //入力必須
                (value: string) => !!value || '',
                //30文字まで
                (value: string) => value.length <= maxLength || `${maxLength}文字以内で入力してください`
            ]
        }
    }
    /*computed: {
        setName: {
            get: () => {
                return this.name
            },
            set: (newValue) => {
                return this.$emit('update:name', newValue)
            }
        }
    }*/
})
</script>
