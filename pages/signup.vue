<template>
    <section>
      <Header />
      <div class="container">
        <h1 class="fs-5 text-center fw-normal form-h1">アカウントを作成</h1>
        <form action="http://localhost:3010/api" method="POST"　class="signup-form">
            <div class="form-group">
              <label for="name" class="form-label">ユーザー名</label>
              <input type="text" id="name" class="form-control" placeholder="Please enter your name" v-model="name">
            </div>
            <div class="form-group">
              <label for="e-mailaddress" class="form-label">メールアドレス</label>
              <input type="text" id="e-mailaddress" class="form-control" placeholder="Please enter your e-mail address" v-model="mailAddress">
            </div>
            <div class="form-group">
              <label for="possword" class="form-label">パスワード</label>
              <input type="password" id="possword" name="password" class="form-control" aria-describedby="passwordHelpBlock" v-model="password">
            </div>
            <div class="form-group">
                <button type="button" @click="signUp" class="btn btn-primary btn-block">新規登録</button>
            </div>
        </form>
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
      name: '',
      mailAddress: '',
      password: '',
    }
  },
  methods: {
    signUp(): void {
      console.log('signUpClick');
      axios.post('http://localhost:3010/api', {
        UserName: this.name,
        email: this.mailAddress,
        password: this.password,
      })
      .then(function (response) {
        console.log('res:', response);
      })
    }
  }
})
</script>

<style>
    .form-h1 {
        padding: 30px 0 0;
    }
    .signup-form {
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

