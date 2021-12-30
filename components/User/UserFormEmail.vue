<template>
    <v-text-field
        :value="email"
        :rules="rules"
        @input="$emit('update:email', $event)"
        label="メールアドレスを入力"
        :placeholder="placeholder ? 'your@email.com' : undefined"
        outlined
    />
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        email: {
            type: String,
            default: ''
        },
        placeholder: {
            type: Boolean,
            default: false,
        }
    },
    data () {
        return {
            rules: [
                //入力必須
                (value: string) => !!value || '',
                //チェック
                //(value: string) => /.+@.+\..+/.test(value) || ''
                (value: string) => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'メールアドレスが正しくありません'
                },
            ]
        }
    }
})
</script>
