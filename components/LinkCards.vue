<template>
    <div id="linkcards">
        <!-- 更新失敗メッセージ -->
        <v-alert
            dense
            outlined
            type="error"
            class="mx-auto mt-10"
            max-width="600"
            transition="fade-transition"
            v-if="UploadFailureFlag"
        >
            更新失敗しました
        </v-alert>
        <v-row
            align="center"
            class="pt-10 pb-10"
        >
            <v-col
                v-for="card in cards"
                :key="card.subtitle"
                :cols="card.flex"
                class="d-flex"
            >
                <v-card style="flex-basis:500px">
                    <v-img :src="`appData/${card.FilePath}`" height="200px" />
                    <v-card-subtitle>{{ card.UpdateTime | datetime }}</v-card-subtitle>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            icon
                            @click="updateFavoriteFlag(card)"
                        >
                            <v-icon>
                                mdi-heart
                            </v-icon>
                            {{card.likes}}
                        </v-btn>
                        <v-btn
                            icon
                            :href="`http://localhost:3010/download?filepath=${card.FilePath}`"
                        >
                        <v-icon>mdi-tray-arrow-down</v-icon> 
                        </v-btn>
                        <!--<a href="http://localhost:3010/download?filepath=assets%2Fupdir%2Fusers%2F2%2Fe08fd1c0-9565-11ec-9881-f14ce0db0432%2F11-500x300.jpg">
                            <v-icon>mdi-tray-arrow-down</v-icon>
                        </a>-->
                        <v-dialog
                            v-model="dialog"
                            width="500"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn 
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    color="gray"
                                >
                                    <v-icon>mdi-share-variant</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>共有リンクを取得</v-card-title>
                                <v-card-text　class="pb-0">
                                    このリンクを知っている全員が閲覧できます。
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            sm="8"
                                        >
                                            <v-text-field
                                                v-model="linkPath"
                                                filled
                                        ></v-text-field>
                                        </v-col>
                                        <v-col
                                        cols="12"
                                        sm="4"
                                        align-self="center"
                                        >
                                        <v-btn 
                                            @click="clipCopy"
                                        >
                                            リンクをコピー
                                        </v-btn> 
                                        </v-col>
                                    </v-row>
                                    <v-chip
                                        color="primary"
                                        outlined
                                        pill
                                    >
                                    ファイル名
                                    </v-chip>
                                    <v-card-actions class="px-0 pu-0">
                                        <v-spacer />
                                        <v-btn
                                            text
                                            @click="dialog = false"
                                        >
                                        閉じる
                                        </v-btn>
                                    </v-card-actions>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import axios, { AxiosError } from 'axios'

export default Vue.extend({
    props: {
        cards: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialog: false,
            linkPath: '',
            UploadFailureFlag: false,
        }
    },
    mounted() {
        //console.log('this.mounted()');
        //console.log(this.cards);
        try {
            this.linkPath = 'http://localhost:3000/appData/' + (this.cards[0] as any).FilePath;
        } catch (error) {
            console.log(error);
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
        async updateFavoriteFlag(card:any) {
            const param = {
                fileId: card.ID
            };
            const authToken = this.$store.getters.getAuthToken;
            await this.$axios.post('/favorite/', param, {
                headers: {
                    Authorization:  `token ${authToken}`
                }
            }).then(response => {
                this.addFavoriteSuccessful(response);
            }).catch(error => {
                this.addFavoriteFailure(error);
            });
        },
        addFavoriteSuccessful (response:any) {
            console.log('成功した');
            location.reload();
        },
        addFavoriteFailure (error: AxiosError<{error: string}>) {
            console.log('失敗した');
            this.UploadFailureFlag = true;
            setTimeout(() => {
                this.UploadFailureFlag = false;
            }, 1500);
        },
        clipCopy() {
            console.log('ClipCopy');
            navigator.clipboard.writeText(this.linkPath);
        },
        //データをダウンロードする
        async download(card:any) {
            let filename = card.FilePath.split('/').pop();
            console.log('filename:', filename);
            await this.$axios.get(
                '/download', {
                    params: {
                        filepath: card.FilePath
                    },
                    responseType: 'blob'
                }
            ).then((response) => {
                //解決策 -> https://stackoverflow.com/questions/59421482
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
            });
        }
    }
})
</script>
