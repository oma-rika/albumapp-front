<template>
    <section>
        <header>
            <NuxtLink to="/signin" class="signin-button">サインイン</NuxtLink>
        </header>
        <h1>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</h1>
        <div class="main">
            <img src="~/assets/cat.jpg" class="image">
            <div class="imageDownload-icon"></div>
            <div class="folderUpload-icon"></div>
        </div>
        <div class="edit-action">
            <p>バージョン履歴</p>
            <div class="session">
                <div class="datetime">2021/08/12(火)00:00:00</div>
                <div class="arrow"></div>
            </div>
            <div class="session">
                <div class="datetime">2021/08/12(火)00:00:00</div>
                <div class="arrow"></div>
            </div>
            <div class="session">
                <div class="datetime">2021/08/12(火)00:00:00</div>
                <div class="arrow"></div>
            </div>
        </div>
        <button>Download</button>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style>
  header {
    background-color: #24292e;
    padding: 5px 20px;
    height: 40px;
    display: flex;
  }

  .main,
  .edit-action {
      margin: 0 auto;
  }

  .signin-button {
    padding: 4px 8px;
    border-radius: 3px;
    border: 1px solid #fff;
    color: #fff;
    background: transparent;
  }
</style>
