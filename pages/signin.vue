<template>
    <section>
        <Header />
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
                <div class="form-group">
                    <button type="button" @click="signIn" class="btn btn-primary btn-block">Sign&nbsp;in</button>
                </div>
                <div class="form-group">
                    <NuxtLink to="/signup" class="signin-button">Create an account.</NuxtLink>
                </div>
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
            emailAddress: '',
            passWord: '',
            auth: [],
        }
    },
    methods: {
        signIn(): void {
            axios.post('http://localhost:3010/login', {
                emailAddress: this.emailAddress,
                passWord: this.passWord,
            })
            .then(function (response) {
                switch(response.data.status) {
                    case 'ok':
                        console.log('ok');
                        this.$store.dispatch("updateMessageAction", response.data.items[0]);
                        //console.log('response.data.items:' {response.data.items[0])};
                        //this.auth = response.data.items[0];
                        //成功したらリダイレクト
                        //window.location.href = '/';
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
        }
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
