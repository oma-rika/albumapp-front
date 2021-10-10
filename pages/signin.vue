<template>
    <section>
        <Header />
        <div class="container">
            <h1 class="fs-5 text-center fw-normal form-h1">ログイン</h1>
            <form action="/" method="post" class="signin-form">
                <div class="form-group">
                    <label for="name" class="form-label">名前</label>
                    <input type="text" id="name" class="form-control" placeholder="Please enter your name">
                </div>
                <div class="form-group">
                    <label for="possword" class="form-label">パスワード</label>
                    <input type="password" id="possword" class="form-control" aria-describedby="passwordHelpBlock">
                    <div id="passwordHelpBlock" class="form-text text-right">
                        <NuxtLink to="/possword_reset" class="fs-6">パスワードを忘れた場合はこちら</NuxtLink>
                    </div>
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-primary btn-block">Sign&nbsp;in</button>
                </div>
                <div class="form-group">
                    <NuxtLink to="/signup" class="signin-button">Create an account.</NuxtLink>
                </div>
            </form>
        </div>
        <Footer />
    </section>
</template>

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
