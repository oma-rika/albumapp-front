<template>
    <section>
        <v-app>
            <MenuBar />
            <v-main>
                <v-container fluid>
                    <!-- 登録失敗メッセージ -->
                    <v-alert
                        dense
                        outlined
                        type="error"
                        class="mx-auto"
                        max-width="600"
                        transition="fade-transition"
                        v-if="failure"
                    >
                        ログインに失敗しました
                    </v-alert>
                    <v-row justify="center">
                        <v-col
                            cols="12"
                            sm="10"
                            md="8"
                            lg="6"
                            align="center"
                        >
                             <v-card
                                class="mt-12"
                                max-width="350"
                            >
                                <v-card-title>
                                    ログイン
                                </v-card-title>
                                <v-card-text class="pb-0">
                                    <v-form
                                        ref="form"
                                        v-model="isValid"
                                        @submit.prevent="login"
                                    >
                                        <UserFormEmail
                                            :email.sync="params.user.email"
                                            />
                                        <userFormPassword
                                            :password.sync="params.user.password"
                                            />
                                        <v-card-actions class="px-0 py-0">
                                            <v-btn
                                                type="submit"
                                                color="primary"
                                                x-large
                                                block
                                                :disabled="!isValid || loading"
                                                :loading="loading"
                                                class="white--text"
                                            >
                                                ログイン
                                            </v-btn>
                                        </v-card-actions>
                                        <v-card-actions class="px-0">
                                            <nuxt-link
                                                to="#"
                                                class="body-2 text-decoration-none"
                                            >
                                                パスワードを忘れた場合はこちら
                                            </nuxt-link>
                                        </v-card-actions>
                                    </v-form>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-main>
            <Footer />
        </v-app>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'




export default Vue.extend({
    data() {
        return {
            isValid: false,
            loading: false,
            params: {
                user: {
                    email: '',
                    password: ''
                }
            },
            emailAddress: '',
            passWord: '',
            auth: [
                {token: 'dummy token'},
            ],
            failure: false,
        }
    },
    methods: {
        async login() {
            this.loading = true;
            if (this.isValid) {
                await this.$axios.post('/login', {
                    emailAddress: this.params.user.email,
                    passWord: this.params.user.password,
                }).then((response) => {
                    this.authSuccessful(response);
                }).catch(error => {
                    this.authFailure(error);
                })
            }
            setTimeout(() => {
                this.loading = false;
            }, 1500)
        },
        //ログイン処理
        authSuccessful (response:any) {
            //console.log('response:', response);
            switch(response.data.status) {
                case 'ok':
                    //console.log('responseData:', response.data.items);
                    this.auth.push(response.data.items[0]);
                    this.$store.dispatch("updateMessageAction", response.data.items[0]);
                    //this.auth = response.data.items[0];
                    //成功したらリダイレクト
                    this.$router.push('dashboard');
                    break;
                default:
                    //console.log('notAccount');
                    this.failure = true;
                    break;
            }
        },
        authFailure ({response}:{response:any}) {
            if (response && response.status === 400) {
                this.failure = true;
                //console.log('response.status:', response.status);
                setTimeout(() => {
                    const refForm: any = this.$refs.form;
                    refForm.reset();
                    //初期化する
                    this.params = {
                        user: {
                            email: '',
                            password: ''
                        }
                    };
                    this.failure = false;
                    this.loading = false;
                }, 1500)
            }
        }
    }
})

</script>

<style>

</style>
