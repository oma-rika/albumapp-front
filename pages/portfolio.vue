<template>
    <section>
        <header>
            <NuxtLink to="/signin" class="signin-button">サインイン</NuxtLink>
        </header>
            <div class="grid">
                <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
            </div>
    </section>
</template>
<style>
    .grid {
        display: flex;
        flex-wrap: wrap;
    }
    .column {
        box-sizing: border-box;
        flex: 0 0 33.3333%;
        padding: 25px 0 0 20px;
        max-width: 33.3333%;
        min-width: 0;
        word-wrap:break-word;
    }
    .image {
        max-width: 100%;
    }
    header {
        background-color: #24292e;
        padding: 5px 20px;
        height: 40px;
        display: flex;
    }
</style>
