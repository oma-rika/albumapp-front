<template>
    <section>
        <v-app>
            <MenuBar />
            <v-main>
                <v-container fluid>
                    <v-row justify="center">
                        <v-col
                            cols="12"
                            sm="10"
                            md="8"
                            lg="6"
                        >
                            <v-form>
                                <v-card ref="form" class="mt-12">
                                    <v-card-title>
                                        ログイン
                                    </v-card-title>
                                    <v-card-text class="pb-0">
                                            <v-text-field
                                                label="メールアドレス"
                                                outlined
                                            ></v-text-field>
                                            <v-text-field
                                                label="パスワード"
                                                outlined
                                            ></v-text-field>
                                    </v-card-text>
                                    <!--<v-divider></v-divider>-->
                                    <v-card-actions class="pt-4 pb-4 pr-0 pl-0 mr-4 ml-4">
                                        <v-btn
                                        color="primary"
                                        x-large
                                        block
                                        @click="submit"
                                        >
                                        ログイン
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-main>
            <Footer />
        </v-app>
    </section>
</template>