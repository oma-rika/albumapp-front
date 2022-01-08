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
                            <v-card >

                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-main>
        </v-app>

                                                                                
        <div class="container signinPage">
            <p>[{{$store.state.message}}]</p>
            <h1 class="fs-5 text-center fw-normal form-h1">ログイン</h1>
            <form action="http://localhost:3010/login" method="post" class="signin-form">
                <div class="form-group">
                    <label for="e-mailaddress" class="form-label">メールアドレス</label>
                    <input type="text" id="e-mailaddress" class="form-control" placeholder="Please enter your e-mail address" v-model="emailAddress">
                </div>
                <div class="form-group">
                    <label for="possword" class="form-label">パスワード</label>
                    <input type="password" id="possword" name="password" class="form-control" aria-describedby="passwordHelpBlock" v-model="passWord">
                    <div id="passwordHelpBlock" class="form-text text-right">
                        <NuxtLink to="/possword_reset" class="fs-6">パスワードを忘れた場合はこちら</NuxtLink>
                    </div>
                </div>
                <!--<div class="form-group">
                    <button type="button" @click="signIn" class="btn btn-primary btn-block">Sign&nbsp;in</button>
                </div>
                <div class="form-group">
                    <NuxtLink to="/signup" class="signin-button">Create an account.</NuxtLink>
                </div>-->
            </form>

            <!--<button @click="$store.dispatch('updateMessageAction', 'Dispatch Message')">ログインできました。</button>-->

        </div>
        <Footer />
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
                    this.authFailure(error)                   
                })
                this.loading = false;
            }
            /*setTimeout(() => {
                console.log('setLogin:');
                if (this.isValid) {
                    await axios.post('http://localhost:3010/login', {
                        emailAdress: this.params.user.email,
                        passWord: this.params.user.password,
                    }).then((response) => {
                        this.authSuccessful(response);
                    }).catch(error => {
                        this.authFailure(error)                   
                    })
                    this.loading = false;
                }
            }, 1500)*/
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
                    console.log('response.data.items:', response.data.items[0]);
                    this.$store.dispatch("updateMessageAction", response.data.items[0]);
                    this.$store.dispatch("login")
                    //this.auth = response.data.items[0];
                    //成功したらリダイレクト
                    this.$router.push('project');
                    break;
                default:
                    console.log('notAccount');
                    //20211114追加
                    //後程修正する
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
        },
        /*signIn(): void {
            axios.post('http://localhost:3010/login', {
                emailAddress: this.emailAddress,
                passWord: this.passWord,
            })
            .then((response) => {
                switch(response.data.status) {
                    case 'ok':
                        console.log('ok');
                        this.auth.push(response.data.items[0]);
                        //console.log('this.auth:', this.auth);
                        //console.log('response.data.items:' {response.data.items[0])};
                        this.$store.dispatch("updateMessageAction", this.auth);
                        //this.auth = response.data.items[0];
                        //成功したらリダイレクト
                        window.location.href = '/';
                        break;
                    case 'notAccount':
                        console.log('notAccount');
                        //20211114追加
                        //後程修正する
                        let msg = document.createElement('p');
                        msg.textContent =  '該当するアカウントはありません。もう一度お試し下さい';
                        const element = document.querySelector<HTMLElement>('.signinPage')
                        if (element) {
                            element.appendChild(msg);
                        }
                        break;
                }
            })
        }*/
    }
})

</script>

<style>
    .form-h1 {
        padding: 30px 0 0;
    }
    .signin-form {
        width: 100%;
        max-width: 410px;
        padding: 0 15px 15px 15px;
        margin: auto;
    }
    label {
        display: block;
    }

    .btn-block {
        display: block;
        width: 100%;
        text-align: center;
    }

    .form-group {
        margin-top: 5px;
        margin-bottom: 15px;
    }
</style>
