<template>
    <section>
        <v-app>
            <MenuBar />
            <v-main>
                <v-container fluid>
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
                                [{{ $route.fullPath }}]
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
                //TODO 削除する
                user: {
                    email: 'test@gmail.com',
                    password: 'possword'
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
                await axios.post('http://localhost:3010/login', {
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
        authSuccessful (response:any) {
            console.log('ログイン成功');
            console.log(response);
            //TODO ログイン処理
            switch(response.data.status) {
                case 'ok':
                    console.log('ok');
                    this.auth.push(response.data.items[0]);
                    //console.log('this.auth:', this.auth);
                    //console.log('response.data.items:', response.data.items[0]);
                    this.$store.dispatch("updateMessageAction", response.data.items[0]);
                    //this.auth = response.data.items[0];
                    //成功したらリダイレクト
                    this.$router.push('dashboard');
                    break;
                default:
                    console.log('notAccount');
                    this.failure = true;
                    break;
            }
            //TODO 記憶ルートリダイレクト
        },
        authFailure ({response}:{response:any}) {
            if (response && response.status === 404) {
                console.log('response.status:', response.status);
            }
            //console.log("エラー発生");
        }
    }
})

</script>

<style>

</style>
