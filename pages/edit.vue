<template>
    <section>
        <header />
        <div class="container">
            <h1 class="fs-5 fw-normal form-h1">Data Files Upload</h1>
            <p>取り込むデータを選択</p>
            <!--<el-upload
                class="upload-demo"
                ref="upload"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                :auto-upload="false"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
            </el-upload>
            <div class="form-group">
                <el-button type="success" @click="submitUpload">upload to server</el-button>
                <el-button type="info" @click="chancelBtn" class="btn">キャンセルする</el-button>
            </div>-->

            <br /><br /><br />

            <!--<el-button @click="visible = true">Button</el-button>-->
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
            [{{binaryFile}}]
            <!--<div class="image-preview">
                <img src="/images/dummy.jpg" v-if="!binaryFile" alt="プレビュー画像" />
                <img :src="binaryFile" v-if="binaryFile" alt="プレビュー画像" />
            </div>-->
            <div class="showImageFile">
                <img id="disp" :src="binaryFile" v-if="binaryFile.length > 0" />
            </div>
            <div class="form-group">
                <button type="button" @click="updateBinaryData" class="btn btn-primary">データを取り込む</button>
                <button type="button" @click="chancelBtn" class="btn btn-secondary">キャンセルする</button>
            </div>
        </div>
        <Footer />
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ElementUI from 'element-ui'
//import locale from 'element-ui/lib/locale/lang/ja'
import axios from 'axios'
import { v4 as uuid } from 'uuid';




export default Vue.extend({
    data() {
        return {
            binaryFile: '',
        }
    },
    methods: {
        // データベースにPOSTする
        updateBinaryData (): void {
            console.log('click');
            //Generate a v4 (random) id
            const guid: string = uuid();
            console.log('guild:', guid);
            if (this.binaryFile.length > 0) {
                axios.post('http://localhost:3010/fileUpload', {
                    //テストで暫定で1を選択
                    userId: 1,
                    imageId: guid,
                    imagePath: this.binaryFile,
                }).then((response) => {

                    console.log('response', response);
                })
            }
        },
        readImage (event: any): void {
            if (event.target.files && event.target.files[0]) {
                //const inputImage = (<HTMLInputElement>document.getElementById('selectImage'))!.files[0];
                const inputImage = event.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(inputImage);
                reader.onload = (e) => {
                    if (e.target) {
                        console.log('test:', new ArrayBuffer(10));
                        //https://stackoverflow.com/questions/52955710
                        const csv: string = e.target.result as string;
                        if (typeof csv === 'string') {
                            this.binaryFile = csv;
                        } else {
                            this.binaryFile = Buffer.from(csv).toString();
                        }
                    }
                }
                reader.onerror = (e) => {
                    alert('読み取り時にエラーが発生しました');
                }
            }
        },
        chancelBtn (): void {
             this.binaryFile = '';
        }
        // submitUpload() {
        //     console.log('click:');
        //     this.$refs.upload.submit();
        // },
        // handleRemove({file}:{file:any}, {fileList}:{fileList:any}) {
        //     console.log(file, fileList);
        // },
        // handlePreview(file) {
        //     console.log(file);
        // },
        // handleChange({file}:{file:any}, {fileList}:{fileList:any}): void {
        //     console.log('changeMethod');
        //     this.fileList = fileList.slice(-3);
        // }
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
