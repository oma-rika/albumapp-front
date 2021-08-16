<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col bg-primary">
                    <div class="grid">
                        <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                        <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                        <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                        <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                        <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                        <div class="column"><img src="~/assets/cat.jpg" class="image"></div>
                    </div>
                </div>
                <NextLogo />
            </div>
        </div>
    </section>
</template>
<script>
</script>
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
</style>
