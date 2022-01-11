<template>
    <v-app>
        <Header />
        <v-main>
            <v-row justify="center">
                <v-col 
                    cols="12"
                    align="center"
                >
                    <!-- 送信成功メッセージ -->
                    <v-fade-transition>
                    <v-alert
                        dense
                        text
                        type="success"
                        class="mt-12"
                        max-width="600"
                        transition="fade-transition"
                        v-if="uploadSuccessfulFlag"
                    >
                        アップロードに成功しました。
                    </v-alert>

                    <!-- 送信エラーメッセージ -->
                    <v-alert
                        dense
                        outlined
                        type="error"
                        class="mt-12"
                        max-width="600"
                        transition="fade-transition"
                        v-if="uploadErrorMsgFlag"
                    >
                        送信に失敗しました。しばらく経ってから再度お試し下さい。
                    </v-alert>

                    <!-- 読み込みエラーメッセージ -->
                    <v-alert
                        dense
                        outlined
                        type="error"
                        class="mt-12"
                        max-width="600"
                        transition="fade-transition"
                        v-if="readErrorMsgFlag"
                    >
                        取り込みに失敗しました。再度お試し下さい。
                    </v-alert>
                    </v-fade-transition>

                    <v-card
                        class="mt-12"
                        max-width="600"
                    >
                        <v-card-title>File Upload</v-card-title>
                        <v-card-text>
                            <v-file-input
                                label="取り込むデータを選択"
                                v-model="filename"
                                accept="image/*"
                                filled
                                prepend-icon="mdi-camera"
                                type="file"
                                @change="readImage"
                            ></v-file-input>
                        </v-card-text>
                    </v-card>
                    <v-spacer />
                    <v-card
                        v-if="binaryFile"
                        class="mt-12"
                        max-width="600"
                    >
                        <v-card-title>取り込んだデータを表示</v-card-title>
                        <v-card-text>
                            <!--[{{ binaryFile  }}]-->
                            <div class="d-flex flex-column justify-space-between align-center">
                                <v-slider
                                    v-model="width"
                                    class="align-self-stretch"
                                    min="200"
                                    max="500"
                                    step="1"
                                ></v-slider>
                            
                                <v-img
                                    :aspect-ratio="16/9"
                                    :width="width"
                                    :src="binaryFile"
                                    contain
                                ></v-img>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                                color="blue-grey"
                                class="ma-2 white--text"
                                @click="cancelButton"
                                :loading="loading"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                color="info"
                                class="ma-2 white--text"
                                @click="updateBinaryData"
                            >
                                Upload
                                <v-icon
                                    right
                                    dark
                                >
                                    mdi-cloud-upload
                                </v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>   
                </v-col>
            </v-row>
        </v-main>
        <Footer />
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import ElementUI from 'element-ui'
import axios from 'axios'
import { v4 as uuid } from 'uuid';

export default Vue.extend({
    middleware: 'authenticated',
    data() {
        return {
            binaryFile: '',
            loading: false,
            width: 300,
            filename: '',
            readErrorMsgFlag: false,
            uploadErrorMsgFlag: false,
            uploadSuccessfulFlag: false,
        }
    },
    methods: {
        // データベースにPOSTする
        updateBinaryData (): void {
            this.loading = false;
            console.log('click');
            //Generate a v4 (random) id
            const guid: string = uuid();
            console.log('guild:', guid);
            const userId = this.$store.getters.getCurrentUserId;
            console.log('UserId:', userId);
            if (this.binaryFile.length > 0) {
                axios.post('http://localhost:3010/fileUpload', {
                    //テストで暫定で1を選択
                    userId: userId,
                    imageId: guid,
                    imagePath: this.binaryFile,
                }).then(response => {
                    console.log('response', response);
                    this.uploadSuccessful(response);
                }).catch(error => {
                    this.uploadFailure(error);
                })
            }
            setTimeout(() => {
                this.loading = false;
            }, 500);
        },
        async uploadSuccessful(response:any) {
            if (response) {
                this.uploadSuccessfulFlag = true;
                setTimeout(() => {
                    this.uploadSuccessfulFlag = false;
                }, 2500);
                await this.resetVal();
            }
        },
        uploadFailure({response}:{response:any}) {
            if (response && response.status === 500) {
                this.uploadErrorMsgFlag = true;
                setTimeout(() => {
                    this.uploadErrorMsgFlag = false;
                }, 2500);    
            }
        },
        readImage(e: any): void{
            console.log('readImage');
            if (e) {
                //const inputImage = (<HTMLInputElement>document.getElementById('selectImage'))!.files[0];
                const inputImage = e;
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
                    //読み込みエラー
                    this.readErrorMsgFlag = true;
                    setTimeout(() => {
                        this.readErrorMsgFlag = false;
                    }, 2500); 
                }
            }
        },
        /*readImage (event: any): void {
            console.log('readImage');
            if (event.target.files && event.target.files[0]) {
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
        },*/
        cancelButton (): void {
            this.loading = true;
            setTimeout(() => {
                this.resetVal();
                this.loading = false;
            }, 500);
        },
        resetVal(): void {
            console.log('初期化する');
            this.binaryFile = '';
            this.filename = '';
            this.loading = false;
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
</style>
