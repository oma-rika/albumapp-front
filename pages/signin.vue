<template>
    <div>
        <p>サインインページ</p>
        <form action="/" method="post">
            <div>
                <label>名前</label>
                <input type="text" name="name" placeholder="名前" />
            </div>
            <div>
                <label>パスワード</label>
                <input type="password" name="possword" />
            </div>
            <div>
                <input type="submit" value="Sign in">
            </div>
        </form>
         <NuxtLink to="/signup" class="signin-button">Create an account.</NuxtLink>
    </div>
</template>
