<template>
    <header>
        <NuxtLink to="/signin" class="signin-button">サインイン</NuxtLink>
    </header>
</template>
<style lang="scss" scoped>
    header {
        background-color: #24292e;
        padding: 5px 20px;
        height: 40px;
        display: flex;
    }
    .signin-button {
        padding: 4px 8px;
        border-radius: 3px;
        border: 1px solid #fff;
        color: #fff;
        background: transparent;
    }
</style>
