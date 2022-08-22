<template>
    <v-app id="inspire">
        <v-sheet>
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
                <v-container align="center">
                    <v-tabs vertical>
                        <v-tab>プロフィール</v-tab>
                        <v-tab>パスワード</v-tab>
                        <v-tab>アクティビティ</v-tab>
                        <!-- プロフィール -->
                        <v-tab-item>
                            <v-fade-transition>
                                <!-- アバター登録成功メッセージ -->
                                <v-alert
                                    dense
                                    text
                                    type="success"
                                    class="mt-12"
                                    max-width="600"
                                    transition="fade-transition"
                                    v-if="avatarChageSuccessFlag"
                                >
                                    アイコンを更新しました
                                </v-alert>
                            </v-fade-transition>
                            <v-card flat>
                                <v-card-title>
                                    プロフィール
                                </v-card-title>
                                <v-card-text>
                                    <v-divider classs="mb-4" />
                                    <v-row 
                                        class="d-flex flex-column justify-center pt-4"
                                        align="center"    
                                    >
                                        <v-avatar size="100">
                                            <v-icon 
                                                size="100"
                                                v-if="!avatarBinaryFile"
                                            >
                                                mdi-account-circle
                                            </v-icon>
                                            <v-img
                                                :aspect-ratio="16/9"
                                                width="100"
                                                :src="avatarBinaryFile"
                                                contain
                                                v-if="avatarBinaryFile"
                                            ></v-img>        
                                        </v-avatar>
                                        <v-dialog
                                            v-model="dialog"
                                            width="300"
                                            dense
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    fab
                                                    x-small
                                                    dark
                                                    depressed
                                                    color="primary"
                                                    class="d-flex cameraIcon-position"
                                                    style="border: 2px solid #fff"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    <v-icon dark>
                                                        mdi-camera
                                                    </v-icon>
                                                </v-btn>
                                            </template>
                                            <v-card>
                                                <v-form
                                                    ref="form"
                                                    @submit.prevent="adminAvatar"
                                                    enctype="multipart/form-data"
                                                >
                                                    <v-card-actions
                                                    >
                                                        <v-file-input
                                                            accept="image/*"
                                                            label="画像をアップロード"
                                                            outlined
                                                            prepend-icon="mdi-camera"
                                                            hide-details
                                                            dense
                                                            class="pt-2 pb-2"
                                                            name="filename"
                                                            @change="inputAvatarImage"
                                                        ></v-file-input>
                                                    </v-card-actions>
                                                    <v-divider />
                                                    <v-card-actions
                                                    >
                                                    <v-btn @click="resetForm" text>デフォルト画像を表示</v-btn>
                                                    </v-card-actions>
                                                    <v-divider />
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn
                                                            color="blue darken-1"
                                                            text
                                                            @click="dialogCancel"
                                                        >
                                                        Cancel
                                                        </v-btn>
                                                        <v-btn
                                                            color="blue darken-1"
                                                            text
                                                            type="submit"
                                                            @click="adminAvatar"
                                                            :disabled="!avatarFilename"
                                                        >
                                                        Save
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-form>
                                            </v-card>
                                        </v-dialog>

                                        <v-card>
                                            <v-card-title>ユーザー情報の変更</v-card-title>
                                            <v-card-subtitle>プロフィール情報を更新する場合はこちらから変更してください。</v-card-subtitle>
                                            <v-card-text>
                                                <v-form 
                                                    ref="form"
                                                    v-model="isValid"
                                                    @submit.prevent="profileUpdate"    
                                                >
 
                                                    <UserFormName
                                                        :name.sync="params.user.name"
                                                    />    
                                                    
                                                    <UserFormEmail
                                                        :email.sync="params.user.email"
                                                    />

                                                    <!--プライバシー設定
                                                    <v-checkbox v-model="checkbox">
                                                        <template v-slot:label>
                                                            <div>自分のアルバムを公開する</div>
                                                        </template>
                                                    </v-checkbox>-->
                                                    <nuxt-link to="/">アカウントを削除される場合はこちら</nuxt-link>
                                                </v-form>
                                            </v-card-text>
                                            <v-card-actions class="pr-4 pl-4 pb-4">
                                                    <v-btn
                                                        disabled
                                                        block
                                                    >
                                                        更新する
                                                    </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <!-- パスワード -->
                        <v-tab-item>
                            <SettingsPasswordChange />
                        </v-tab-item>
                        <!-- アクティビティ -->
                        <v-tab-item>
                            <SettingsActivitylogs :logMessage="logs" />
                        </v-tab-item>
                    </v-tabs>
                </v-container>
            </v-main>
            <Footer />
        </v-sheet>
    </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    middleware: 'authenticated',
    asyncData({$axios, params, store }) {
        const authToken = store.getters.getAuthToken;
        //アクティビティ情報取得
        return $axios.get('/messagelog', {
            headers: {
                Authorization: `token ${authToken}`
            }
        }).then(response => {
            return { logs: response.data.items }
        }).catch(error => {
            console.log('error');
        });
    },
    data() {
        return {
            isValid: false,
            checkbox: false,
            avatarFilename: '',
            params: {
                user: {
                    name: '',
                    email: '',
                    password: ''
                }
            },
            dialog: false,
            avatarBinaryFile: '',
            drawer: false,
            serverErrorFlag: false,
            loading: false,
            logs: null,
            avatarChageSuccessFlag: false, //アバターの登録成功
        }
    },
    methods: {
        //アバター画像を選択した際に実行される
        inputAvatarImage(event: any): void {
            if (event) {
                console.log('event:', event);
                const inputImage = event;
                //POSTする際にも使用
                this.avatarFilename = event;
                const reader = new FileReader();
                reader.readAsDataURL(inputImage);
                reader.onload = (e) => {
                    if (e.target) {
                        const csv: string = e.target.result as string;
                        if (typeof csv == 'string') {
                            this.avatarBinaryFile = csv;
                        } else {
                            this.avatarBinaryFile = Buffer.from(csv).toString();
                        }
                    }
                }
                reader.onerror = (e) => {
                    alert('読み取り時にエラーが発生しました');
                }
            }
        },
        //デフォルト画像に戻す
        changeDefaultAvatar(): void {
            //this.avatarBinaryFile = '';
            //this.avatarFilename = '';
            this.resetForm();
        },
        adminAvatar(e:any): void {
            //console.log('フォームを送信');
            const userId = this.$store.getters.getCurrentUserId;
            console.log('userId:', userId);
            if (this.avatarFilename) {
                console.log('this.avatarFilename', this.avatarFilename);
                console.log('this->e:', e);
                const formData = new FormData();
                formData.append('file', this.avatarFilename);
                this.$axios.post(`http://localhost:3010/avatarUpload/${userId}`, formData)
                .then(response => {
                    this.adminAvatarSuccess();
                    console.log({response});
                }).catch(error => {
                    console.log({error});
                })
            }
            this.dialog = false;
        },
        //ダイアログ表示中にキャンセルボタンが実行された
        dialogCancel(): void {
            this.dialog = false;
            this.resetForm();
        },
        //入力値の初期化
        resetForm() {
            if (this.avatarBinaryFile) {
                this.avatarBinaryFile = '';
            }
        },
        //アバター画像登録に成功した場合の処理
        adminAvatarSuccess() {
            this.avatarChageSuccessFlag = true;
            setTimeout(() => {
                this.avatarChageSuccessFlag = false;
            }, 1500);
        }
    }
})
</script>
<style lang="scss">
.cameraIcon-position {
    bottom: 50px;
    left: 50px;
}
</style>