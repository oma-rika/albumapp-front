<template>
    <v-app>
        <Header
            #navigation-toggle-button
            clipped-left
            >
                <v-app-bar-nav-icon
                @click="drawer = !drawer"
                />
        </Header>
        <NavigationDrawer
            :drawer.sync="drawer"
        />
        <v-main>
            <v-container>
                <v-row justify="center">
                    <v-col
                        cols="12"
                        align="center"
                    >
                        <v-fade-transition>
                            <!-- 送信成功メッセージ -->
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
                            <!-- 画像読み込みエラーメッセージ -->
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
                    </v-col>
                </v-row>
                <v-card
                    class="mx-auto mt-12"
                    max-width="600"
                >
                    <v-card-title>File Upload</v-card-title>
                    <v-card-text>
                        <v-file-input
                            label="取り込むデータを選択"
                            accept="image/*"
                            filled
                            prepend-icon="mdi-camera"
                            type="file"
                            @change="readImage"
                            v-model="inputVal"
                            clearable
                        ></v-file-input>
                    </v-card-text>
                </v-card>
                <v-card
                    v-if="binaryFile"
                    class="mx-auto mt-12"
                    max-width="600"
                >
                    <v-card-title>取り込んだデータを表示</v-card-title>
                    <v-card-text>
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
                            @click="resetVal"
                            :loading="loading"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            color="info"
                            class="ma-2 white--text"
                            @click="uploadFile"
                            :loading="loading"
                            :disabled="loading"
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
            </v-container>
        </v-main>
        <Footer />
    </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    middleware: 'authenticated',
    data() {
        return {
            drawer: false,
            binaryFile: '',
            width: 300,
            loading: false,
            filename: '',
            uploadSuccessfulFlag: false,
            uploadErrorMsgFlag: false,
            readErrorMsgFlag: false,
            clickCount: 0,
            inputVal: null,
        }
    },
    methods: {
        readImage(event: any): void {
            if (event) {
                const inputImage = event;
                //POSTする際にも使用
                this.filename = event;
                const reader = new FileReader();
                reader.readAsDataURL(inputImage);
                reader.onload = (e) => {
                    if (e.target) {
                        const csv: string = e.target.result as string;
                        if (typeof csv == 'string') {
                            this.binaryFile = csv;
                        } else {
                            this.binaryFile = Buffer.from(csv).toString();
                        }
                    }
                }
                reader.onerror = (e) => {
                    alert('読み取り時にエラーが発生しました');
                    this.readErrorMsgFlag = true;
                    setTimeout(() => {
                        this.readErrorMsgFlag = false;
                    }, 2500);
                }
            }
        },
        uploadFile(): void {
            this.loading = true;
            this.clickCount++;
            console.log('clickCount:', this.clickCount);
            
            if (this.binaryFile) {
                const authToken = this.$store.getters.getAuthToken;
                const formData = new FormData();
                formData.append('file', this.filename);
                axios.post('http://localhost:3010/imagefileUpload', formData, {
                    headers: {
                        Authorization:  `token ${authToken}`
                    }
                }).then(response => {
                    this.uploadSuccessful();
                }).catch(error => {
                    console.log('error:', error);
                    this.uploadFailure(error);
                });
            }

            setTimeout(() => {
                this.loading = false;
            }, 500);

        },
        // アップロードが成功した際の処理
        async uploadSuccessful() {
            this.uploadSuccessfulFlag = true;
            setTimeout(() => {
                this.uploadSuccessfulFlag = false;
            }, 2500);
            await this.resetVal();
        },
        // フォームの内容を初期化する
        resetVal(): void {
            this.binaryFile = '';
            this.filename = '';
            this.inputVal = null;
        },
        // 正常にアップロードされない場合はエラーメッセージを表示する
        uploadFailure({response}:{response:any}) {
            if (response && response.status === 500) {
                this.uploadErrorMsgFlag = true;
                setTimeout(() => {
                    this.uploadErrorMsgFlag = false;
                }, 2500);
            }
        }
    }
})
</script>
<style lang="scss" scoped>

</style>
