<template>
    <div id="passwordChange">
        <v-fade-transition>
            <!-- 送信成功メッセージ -->
            <v-alert
                dense
                text
                type="success"
                class="mt-12"
                max-width="600"
                transition="fade-transition"
                v-if="passwordChageSuccessFlag"
            >
                パスワードの更新に成功しました。
            </v-alert>
            <!-- エラーメッセージ -->
            <v-alert
                dense
                text
                type="error"
                class="mt-12"
                max-width="600"
                transition="fade-transition"
                v-if="serverErrorFlag"
            >
                パスワードの更新に失敗しました。
            </v-alert>
        </v-fade-transition>
        <v-card flat>
            <v-card-title>
                パスワード
            </v-card-title>
            <v-card-text>
                <v-divider classs="mb-4" />
                <v-row 
                    class="d-flex justify-center mt-4"
                    align="center">
                    <v-card
                        max-width="600"
                    >
                        <v-card-title>
                            現在のパスワードを変更
                        </v-card-title>
                        <v-card-subtitle>
                            パスワードを変更するには、必要な項目を記入して更新してください。
                        </v-card-subtitle>
                        <v-card-text>
                            <v-form 
                                ref="form"
                                v-model="isValid"  
                            >
                                <p class="mb-3">現在のパスワード</p>
                                <UserFormPassword
                                    :password.sync="params.password.current"
                                />
                                <p class="mb-3">新しいパスワード</p>
                                <UserFormPassword
                                    :password.sync="params.password.new"
                                    set-validation
                                />
                                <p class="mb-3">新しいパスワードの確認</p>
                                <v-text-field
                                    v-model="params.password.confirm"
                                    :rules="confirmPasswordRules"
                                    :append-icon="toggle.icon"
                                    outlined
                                    autocomplete="on"
                                    :type="toggle.type"
                                    label="パスワードを入力"
                                    @click:append="show = !show"
                                />
                                <v-btn
                                    :disabled="!isValid || loading"
                                    :loading="loading"
                                    block
                                    class="white--text"
                                    color="primary"
                                    @click="passwordChange"
                                >
                                    更新する
                                </v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>
<style lang="scss">
</style>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    data() {
        return {
            isValid: false,
            loading: false,
            passwordChageSuccessFlag: false,
            serverErrorFlag: false,
            show: false,
            params: {
                password: {
                    current: '',
                    new: '',
                    confirm: ''
                }
            },
        }
    },
    computed: {
        //新しいパスワードと確認用に入力した値が一致するか確認
        confirmPasswordRules () {
            return [
                (value :string) => !!value || '',
                (value :string) => value === (this as any).params.password.new || '新しいパスワードと一致させてください'
            ];
        },
        //パスワードの表示非表示
        toggle (): any {
            const icon = this.show ? 'mdi-eye' : 'mdi-eye-off'
            const type = this.show ? 'text' : 'password'
            return { icon, type }
        }
    },
    methods: {
        //パスワードの更新を実行する
        passwordChange() {
            if((this as any).$refs.form.validate()) {
                const authToken = this.$store.getters.getAuthToken;
                const p = {
                    currentPassword: this.params.password.current,
                    newPassword: this.params.password.new
                };
                axios.post('http://localhost:3010/passwordChange', p, {
                    headers: {
                       Authorization:  `token ${authToken}` 
                    }
                }).then(response => {
                    console.log('成功');
                    this.passwordChangeSuccess();
                }).catch(error => {
                    console.log('失敗');
                    this.passwordChangeFailure(error);
                });
                this.loading = true;
                setTimeout(() => {
                    this.pwformReset();
                    this.loading = false
                }, 2500);
            }
        },
        //パスワードの入力値を初期化する
        pwformReset() {
            (this as any).$refs.form.reset();
            this.params = {
                password: {
                    current: '',
                    new: '',
                    confirm: ''
                }
            };
        },
        //パスワードの更新に失敗した場合の処理
        passwordChangeFailure({response}:{response:any}) {
            console.log('送信失敗')
            //console.log('response:', response);
            if (response && response.status === 403 || response && response.status === 500) {
                this.serverErrorFlag = true;
                setTimeout(() => {
                    this.serverErrorFlag = false;
                }, 2500);
                
            }
        },
        //パスワード更新に成功した場合の処理
        passwordChangeSuccess() {
            console.log('パスワード成功');
            this.passwordChageSuccessFlag = true;
            setTimeout(() => {
                this.passwordChageSuccessFlag = false;
                this.$router.push('signin');
            }, 1500);
        },
    }
})
</script>