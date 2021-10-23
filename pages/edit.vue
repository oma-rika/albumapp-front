<template>
    <section>
        <header />
        <div class="container">
            <h1 class="fs-5 fw-normal form-h1">Data Files Upload</h1>
            <!--<div class="form-group">
                <label for="selectFile" class="form-label">取り込むデータを選択</label>
                <input type="file" v-on:change="handleFile" id="selectFile" class="form-control">
            </div>
            <div class="form-group">
                <button @click="showImageFile" type="button" class="btn btn-primary">ファイル内容を表示</button>
            </div>-->
            <div class="form-group">
                <label for="selectFile" class="form-label">取り込むデータを選択</label>
                <input type="file" accept="image/*" @change="readImage" id="selectImage" class="form-control" />
            </div>
            <div class="image-preview">
                <img src="/images/dummy.jpg" v-if="!binaryFile" alt="プレビュー画像" />
                <img :src="binaryFile" v-if="binaryFile" alt="プレビュー画像" />
            </div>
            <div class="showImageFile">
                <img id="disp" :src="binaryFile" v-if="binaryFile.length > 0" />
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-primary">データを取り込む</button>
                <button type="button" @click="chancelBtn" class="btn btn-secondary">キャンセルする</button>
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
            binaryFile: '',
            testUrl: '',
            file: '',
        }
    },
    methods: {
        //handleFile ({e}: {e:any}): void {
        readImage (): void {
            const inputImage = (<HTMLInputElement>document.querySelector('#selectImage'))!.files[0];
            console.log('inputImage.files:', inputImage);
            if (inputImage.length == 0) return;
            const reader = new FileReader();
            reader.readAsDataURL(inputImage);
            reader.onload = (e) => {
                this.binaryFile =  e.target.result;
            }
            reader.onerror = (e) => {
                alert('読み取り時にエラーが発生しました');
            }
        },
        chancelBtn (): void {
            this.binaryFile = '';
        },
        showImageFile (): Object {
            console.log('Hello');
            console.log('this.binaryFile:', this.binaryFile);
            /*this.binaryFile = 'get Image';
            const reader = new FileReader();
            const selectFile = document.querySelector('#selectFile');

            if (selectFile != null) {
                let fileInfo = selectFile.files;
                console.log('fileInfo:', fileInfo);
                reader.readAsDataURL(fileInfo[0]);
            }

            reader.onerror = function(event) {
                alert('読み取り時にエラーが発生しました');
            };

            reader.onload = function(event) {
                console.log('get Loading');
                console.log(event);
                let tmpTxt = event.target.result;
                this.binaryFile = tmpTxt;
            };
            console.log('77777', this.binaryFile);*/
            return this.binaryFile;
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
