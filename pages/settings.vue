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
                                                            :disabled="!avatarFilename"
                                                        >
                                                        Save
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-form>
                                            </v-card>
                                        </v-dialog>

                                        <!--<v-form
                                            ref="form"
                                            v-model="isValid"
                                            @submit.prevent="adminAvatar"
                                        >-->
                                            <!--<v-badge
                                                bordered
                                                bottom
                                                color="deep-purple accent-4"
                                                icon="mdi-camera"
                                                overlap
                                                offset-x="30"
                                                offset-y="30"
                                            >-->
                                                    <!--<v-file-input
                                                        v-model="avatarFilename"
                                                        accept="image/*"
                                                        filled
                                                        prepend-icon="mdi-camera"
                                                        type="file"
                                                        hide-input
                                                        color="deep-purple"
                                                        @change="adminAvatar"
                                                        name="file"
                                                    ></v-file-input>-->
                                            <!--</v-badge>-->
                                        <!--</v-form>-->
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
                            <v-fade-transition>
                                <!-- 送信成功メッセージ -->
                                <v-alert
                                    dense
                                    text
                                    type="success"
                                    class="mt-12"
                                    max-width="600"
                                    transition="fade-transition"
                                    v-if="passwordChageSuccessFlag"
                                >
                                    パスワードの更新に成功しました。
                                </v-alert>
                                <!-- エラーメッセージ -->
                                <v-alert
                                    dense
                                    text
                                    type="error"
                                    class="mt-12"
                                    max-width="600"
                                    transition="fade-transition"
                                    v-if="serverErrorFlag"
                                >
                                    パスワードの更新に失敗しました。
                                </v-alert>
                            </v-fade-transition>
                            <v-card flat>
                                <v-card-title>
                                    パスワード
                                </v-card-title>
                                <v-card-text>
                                    <v-divider classs="mb-4" />
                                    <v-row 
                                        class="d-flex justify-center mt-4"
                                        align="center">
                                        <v-card
                                            max-width="600"
                                        >
                                            <v-card-title>
                                                現在のパスワードを変更
                                            </v-card-title>
                                            <v-card-subtitle>
                                                パスワードを変更するには、必要な項目を記入して更新してください。
                                            </v-card-subtitle>
                                            <v-card-text>
                                                <v-form 
                                                    ref="form"
                                                    v-model="isValid"  
                                                >
                                                    <p class="mb-3">現在のパスワード</p>
                                                    <UserFormPassword
                                                        :password.sync="params.password.current"
                                                    />
                                                    <p class="mb-3">新しいパスワード</p>
                                                    <UserFormPassword
                                                        :password.sync="params.password.new"
                                                        set-validation
                                                    />
                                                    <p class="mb-3">新しいパスワードの確認</p>
                                                    <v-text-field
                                                        v-model="params.password.confirm"
                                                        :rules="confirmPasswordRules"
                                                        :append-icon="toggle.icon"
                                                        outlined
                                                        autocomplete="on"
                                                        :type="toggle.type"
                                                        label="パスワードを入力"
                                                        @click:append="show = !show"
                                                    />
                                                    <v-btn
                                                        :disabled="!isValid || loading"
                                                        :loading="loading"
                                                        block
                                                        class="white--text"
                                                        color="primary"
                                                        @click="passwordChange"
                                                    >
                                                        更新する
                                                    </v-btn>
                                                </v-form>
                                            </v-card-text>
                                        </v-card>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <!-- アクティビティ -->
                        <v-tab-item>
                            <v-card flat>
                                <v-card-title>
                                    アクティビティ
                                </v-card-title>
                                <v-card-text>
                                        <v-divider classs="mb-4" />
                                        <v-card class="mt-4">
                                            <v-simple-table>
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left">
                                                                変更内容
                                                            </th>
                                                            <th class="text-left">
                                                                日時
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr
                                                        v-for="item in logs"
                                                        :key="item.name"
                                                    >
                                                        <td>{{ item.message }}</td>
                                                        <td>{{ item.updateTime | datetime }}</td>
                                                    </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                        </v-card>
                                </v-card-text>
                            </v-card>
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
        return $axios.get('http://localhost:3010/messagelog', {
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
                },
                password: {
                    current: '',
                    new: '',
                    confirm: ''
                }
            },
            dialog: false,
            avatarBinaryFile: '',
            drawer: false,
            show: false,
            passwordChageSuccessFlag: false,
            serverErrorFlag: false,
            loading: false,
            logs: null,
        }
    },
    computed: {
        //新しいパスワードと確認用に入力した値が一致するか確認
        confirmPasswordRules () {
            return [
                (value :string) => !!value || '',
                (value :string) => value === (this as any).params.password.new || '新しいパスワードと一致させてください'
            ];
        },
        //パスワードの表示非表示
        toggle (): any {
            const icon = this.show ? 'mdi-eye' : 'mdi-eye-off'
            const type = this.show ? 'text' : 'password'
            return { icon, type }
        }
    },
    filters: {
        datetime: function(val:any) {
            if (!val) return;
            const date = new Date(val);
            const yyyy = date.getFullYear();
            console.log(yyyy);
            // 0埋めにする
            const MM = `0${date.getMonth() + 1}`.slice(-2);
            const dd = `0${date.getDate()}`.slice(-2);
            const HH = `0${date.getHours()}`.slice(-2);
            const mm = `0${date.getMinutes()}`.slice(-2);
            const ss = `0${date.getSeconds()}`.slice(-2);
            
            return `${yyyy}年${MM}月${dd}日 ${HH}:${mm}:${ss}`;
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
            console.log('フォームを送信');
            const userId = this.$store.getters.getCurrentUserId;
            console.log('userId:', userId);
            if (this.avatarFilename) {
                console.log('this.avatarFilename', this.avatarFilename);
                console.log('this->e:', e);
                const formData = new FormData();
                formData.append('file', this.avatarFilename);
                axios.post(`http://localhost:3010/avatarUpload/${userId}`, formData)
                .then(response => {
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
        //パスワードの更新を実行する
        passwordChange() {
            if((this as any).$refs.form.validate()) {
                const authToken = this.$store.getters.getAuthToken;
                const p = {
                    currentPassword: this.params.password.current,
                    newPassword: this.params.password.new
                };
                axios.post('http://localhost:3010/passwordChange', p, {
                    headers: {
                       Authorization:  `token ${authToken}` 
                    }
                }).then(response => {
                    //console.log('成功');
                    //this.passwordChageSuccessFlag = true;
                    this.passwordChangeSuccess();
                }).catch(error => {
                    this.passwordChangeFailure(error);
                });
                this.loading = true;
                setTimeout(() => {
                    this.pwformReset();
                    this.loading = false
                }, 2500);
            }
        },
        //パスワードの入力値を初期化する
        pwformReset() {
            (this as any).$refs.form.reset();
            this.params = {
                user: {
                    name: '',
                    email: '',
                    password: ''
                },
                password: {
                    current: '',
                    new: '',
                    confirm: ''
                }
            };
        },
        //パスワードの更新に失敗した場合の処理
        passwordChangeFailure({response}:{response:any}) {
            //console.log('送信失敗')
            //console.log('response:', response);
            if (response && response.status === 403 || response && response.status === 500) {
                console.log('FlagOON');
                this.serverErrorFlag = true;
                setTimeout(() => {
                    this.serverErrorFlag = false;
                }, 2500);
                
            }
        },
        //パスワード更新に成功した場合の処理
        passwordChangeSuccess() {
            this.passwordChageSuccessFlag = true;
            setTimeout(() => {
                this.passwordChageSuccessFlag = false;
                this.$router.push('signin');
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