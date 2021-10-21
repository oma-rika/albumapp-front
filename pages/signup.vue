<template>
    <section>
      <Header />
      <div class="container">
        <h1 class="fs-5 text-center fw-normal form-h1">アカウントを作成</h1>
        <form action="/" method="post"　class="signup-form">
            <div class="form-group">
              <label for="name" class="form-label">ユーザー名</label>
              <input type="text" id="name" class="form-control" placeholder="Please enter your name">
            </div>
            <div class="form-group">
              <label for="e-mailaddress" class="form-label">メールアドレス</label>
              <input type="text" id="e-mailaddress" class="form-control" placeholder="Please enter your e-mail address">
            </div>
            <div class="form-group">
              <label for="possword" class="form-label">パスワード</label>
              <input type="password" id="possword" class="form-control" aria-describedby="passwordHelpBlock">
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-primary btn-block">新規登録</button>
            </div>
        </form>
      </div>
      <Footer />
    </section>
</template>

export default Vue.extend({
  data() {
    return {
      firstname: 'foo',
    }
  },
  mounted() {
    axios.get('/server/api')
      .then(response => this.posts = response.data)
    console.log("7777" + "[" + this.posts + "]");
  },
  methods: {

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

