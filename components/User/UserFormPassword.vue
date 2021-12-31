<template>
    <v-text-field
        :value="password"
        :rules="form.rules"
        :hint="form.hint"
        @input="$emit('update:password', $event)"
        label="パスワードを入力"
        :placeholder="form.placeholder"
        hide-detailes=!setValidation
        :counter="setValidation"
        :append-icon="toggle.icon"
        :type="toggle.type"
        outlined
        autocomplete="on"
        @click:append="show = !show"
    />
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        password: {
            type: String,
            default: ''
        },
        setValidation: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            show: false
        }
    },
    computed: {
        form() {
            const minLength = '8文字以上'
            const msg = `${minLength}です。半角英数記号が使えます。`
            //ログインページ=入力必須
            //会員登録ページ=入力必須,8文字以上,72文字以下,書式チェック
            const required = (value: string) => !!value || '';
            const format = (value: string) => /^[\w-@!#,.$]{8,72}$/.test(value) || msg;
            const rules = this.setValidation ? [format] : [required];
            const hint = this.setValidation ? msg : undefined;
            const placeholder = this.setValidation ? minLength : undefined;
            return { rules, hint, placeholder}
        },
        toggle (): any {
            const icon = this.show ? 'mdi-eye' : 'mdi-eye-off'
            const type = this.show ? 'text' : 'password'
            return { icon, type }
        }
    }
})
</script>
