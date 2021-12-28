<template>
    <v-app id="inspire">
        <v-sheet>
            <Header />
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
                                        <!--<v-avatar
                                            color="indigo"
                                            size="120"
                                        >
                                        </v-avatar>-->
                                        <v-badge
                                            bordered
                                            bottom
                                            color="deep-purple accent-4"
                                            icon="mdi-camera"
                                            overlap
                                            offset-x="30"
                                            offset-y="30"
                                        >
                                            <v-icon size="100">
                                                mdi-account-circle
                                            </v-icon>
                                        </v-badge>
                                        <v-card>
                                            <v-card-title>ユーザー情報の変更</v-card-title>
                                            <v-card-subtitle>プロフィール情報を更新する場合はこちらから変更してください。</v-card-subtitle>
                                            <v-card-text>
                                                <v-form ref="form">
                                                    <v-text-field
                                                        v-model="name"
                                                        :counter="10"
                                                        :rules="nameRules"
                                                        label="ユーザー名"
                                                        outlined
                                                    ></v-text-field>
                                                
                                                    <v-text-field
                                                        v-model="email"
                                                        :rules="emailRules"
                                                        label="メールアドレス"
                                                        outlined
                                                    ></v-text-field>
                                                    プライバシー設定
                                                    <v-checkbox v-model="checkbox">
                                                        <template v-slot:label>
                                                            <div>自分のアルバムを公開する</div>
                                                        </template>
                                                    </v-checkbox>
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
                            <v-card flat>
                                 <v-card-title>
                                    パスワード
                                </v-card-title>
                                <v-card-text>
                                    <v-divider classs="mb-4" />
                                    <v-row 
                                        class="d-flex justify-center mt-4"
                                        align="center">
                                        <v-card>
                                            <v-card-title>
                                                現在のパスワードを変更
                                            </v-card-title>
                                            <v-card-subtitle>
                                                パスワードを変更するには、必要な項目を記入して更新してください。
                                            </v-card-subtitle>
                                            <v-card-text>
                                                <v-form ref="form">
                                                    <v-text-field
                                                        v-model="password"
                                                        label="現在のパスワード"
                                                        outlined
                                                    ></v-text-field>
                                                    <v-text-field
                                                        v-model="newPassword"
                                                        label="新しいパスワード"
                                                        outlined
                                                    ></v-text-field>
                                                    <v-text-field
                                                        v-model="passwordConfirm"
                                                        label="新しいパスワードの確認"
                                                        outlined
                                                    ></v-text-field>
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
                        <!-- アクティビティ -->
                        <v-tab-item>
                            <v-card flat>
                                <v-card-title>
                                    アクティビティ
                                </v-card-title>
                                <v-card-text>
                                        <v-divider classs="mb-4" />
                                        <v-card class="mt-4">
                                            <v-data-table
                                                :headers="headers"
                                                :items="logs"
                                                item-key="id"
                                                hide-default-footer
                                            >
                                                <template v-slot:item.filename="{item}">
                                                <nuxt-link to="/" class="text-decoration-none">
                                                        {{item.filename}}
                                                    </nuxt-link>
                                                </template>
                                                <template v-slot:item.datetime="{item}">
                                                        {{item.datetime}}
                                                </template>
                                            </v-data-table>
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
export default Vue.extend({
  data() {
    return {
      checkbox: false,
      headers: [
            {
               text: '更新したファイル名',
               value: 'filename'
            },
            {
                text: '更新日',
                value: 'datetime'
            }
      ],
      logs: [
          {id: 1, filename: "Sample01.jpg", datetime: "2021/12/27 18:30"},
          {id: 2, filename: "Sample02.png", datetime: "2021/12/27 18:35"},
          {id: 3, filename: "Sample03.jpg", datetime: "2021/12/27 18:37"},
          {id: 4, filename: "Sample04.gif", datetime: "2021/12/27 18:38"},
          {id: 5, filename: "Sample05.jpg", datetime: "2021/12/28 18:39"}, 
      ]
    }
  }
})
</script>
<style>
</style>