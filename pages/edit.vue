<template>
    <v-app>
        <Header />
        <v-main>
            <v-row justify="center">
                <v-col 
                    cols="12"
                    align="center"
                >
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
                                @change="readImageTest"
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
                                @click="chancelBtn"
                                :loading="loading"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                color="info"
                                class="ma-2 white--text"
                                @click="readImage"
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
    data() {
        return {
            binaryFile: '',
            loading: false,
            width: 300,
            filename: '',
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
        readImageTest(e: any): void{
            console.log('readImageTest');
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
                    alert('読み取り時にエラーが発生しました');
                }
            }
        },
        readImage (event: any): void {
            console.log('readImage');
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
            this.loading = true;
            setTimeout(() => {
                this.binaryFile = '';
                this.filename = '';
                this.loading = false;
            }, 500);
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
