<template>
    <section>
        <header />
        <div class="container">
            <h1 class="fs-5 fw-normal form-h1">Data Files Upload</h1>
            <div class="form-group">
                <label for="selectFile" class="form-label">取り込むデータを選択</label>
                <input type="file" id="selectFile" class="form-control">
            </div>
            <div class="form-group">
                <button @click="countUp" type="button" class="btn btn-primary">ファイル内容を表示</button>
            </div>
            <div class="showImageFile">
                [{{ count }}]
                <img id="disp" />
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-primary">データを取り込む</button>
                <button type="button" class="btn btn-secondary">キャンセルする</button>
            </div>


            <div class="main">
                <img src="~/assets/cat.jpg" class="image">
                <div class="imageDownload-icon"></div>
                <div class="folderUpload-icon"></div>
            </div>
            <div class="edit-action">
                <h2 class="fs-5 fw-normal form-h2">バージョン履歴</h2>
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
        </div>
        <Footer />
    </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data() {
        return {
            posts: [],
            count: 'Hello',
        }
    },
    methods: {
        countUp (): String {
            console.log('Hello');
            return this.count += 'world'
        }
    }
})
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
