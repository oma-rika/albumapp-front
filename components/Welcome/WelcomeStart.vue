<template>
    <v-row align="center" class="pb-10">
        <v-col
            cols="12"
            class="text-center"
        >
            <h1>{{ $t('welcomeStart.title') }}</h1>
            <p>{{ $t('welcomeStart.subtitle') }}</p>
            <v-btn
                x-large
                color="primary"
                to="/createAccount"
            >
                新規会員登録
            </v-btn>
        </v-col>
    </v-row>
</template>
<style lang="scss">
</style>
<script lang="ts">


</script>
