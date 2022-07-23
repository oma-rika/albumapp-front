<template>
    <v-card flat>
        <v-card-title>
            アクティビティ
        </v-card-title>
        <v-card-text>
                <v-divider classs="mb-4" />
                <v-card class="mt-4 pa-2" v-if="logMessage.length <= 0">
                    履歴はありません
                </v-card>
                <v-card class="mt-4" v-else>
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
                                v-for="item in logMessage"
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
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        logMessage: {
            type: Array,
            required: true
        }
        
    },
    data () {
        return {
            
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
    }
})
</script>