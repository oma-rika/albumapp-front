<template>
    <section>
      <v-app>
        <MenuBar />
        <v-main>
          <v-container fluid>
            <!-- 登録完了メッセージ -->
            <v-alert
              dense
              type="success"
              class="mx-auto"
              max-width="600"
              transition="fade-transition"
              v-if="createSuccessfulFlag"
            >
              登録完了しました。
            </v-alert>

            <!-- 登録失敗メッセージ -->
            <v-alert
                dense
                outlined
                type="error"
                class="mx-auto"
                max-width="600"
                transition="fade-transition"
                v-if="createErrorMsgFlag"
            >
              ユーザー登録に失敗しました
            </v-alert>

            <v-row justify="center">
                <v-col
                    cols="12"
                    sm="10"
                    md="8"
                    lg="6"
                    align="center"
                >
                    <v-card
                        class="mt-12"
                        max-width="350"
                    >
                        <v-card-title>
                            アカウントを作成
                        </v-card-title>
                        <v-card-text>
                                <v-form 
                                    ref="form"
                                    v-model="isValid"
                                    @submit.prevent="signup"
                                >
                                    <UserFormName
                                        :name.sync="params.user.name"
                                      />
                                    <UserFormEmail
                                        :email.sync="params.user.email"
                                        placeholder
                                      />
                                    <UserFormPassword
                                        :password.sync="params.user.password"
                                        set-validation
                                      />
                                    <v-btn
                                        type="submit"
                                        color="primary"
                                        x-large
                                        block
                                        @click="signup"
                                        :disabled="!isValid || loading"
                                        :loading="loading"
                                        class="white--text"
                                    >
                                        新規登録
                                    </v-btn>
                                </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-app>
      <Footer />
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios, { AxiosError }  from 'axios'

export default Vue.extend({
  data() {
    return {
      isValid: false,
      loading: false,
      createSuccessfulFlag: false,
      createErrorMsgFlag: false,
      params: {
        user: {
          name: '',
          email: '',
          password: ''
        }
      }
    }
  },
  methods: {
    signup() {
      this.loading = true;
      console.log('name', this.params.user.name);
      console.log('email', this.params.user.email);
      console.log('password', this.params.user.password);
      this.$axios.post('/signup', {
        UserName: this.params.user.name,
        email: this.params.user.email,
        password: this.params.user.password,
      })
      .then((response) => {
        this.createSuccessful();
      }).catch(error => {
        this.createFailure(error);
      })
    },
    createSuccessful () {
        this.createSuccessfulFlag = true;
        setTimeout(() => {
            // Vuetify $refs.form.reset giving errors 
            // `https://stackoverflow.com/questions/51059402`
            const refForm: any = this.$refs.form;
            refForm.reset();
            //初期化する
            this.params = {
                user: {
                    name: '',
                    email: '',
                    password: ''
                }
            };
          this.createSuccessfulFlag = false;
          this.loading = false;
        }, 1500)
    },
    createFailure (error: AxiosError<{error: string}>) {
      this.createErrorMsgFlag = true;
      setTimeout(() => {
          const refForm: any = this.$refs.form;
          refForm.reset();
          //初期化する
          this.params = {
              user: {
                  name: '',
                  email: '',
                  password: ''
              }
          };
        this.createErrorMsgFlag = false;
        this.loading = false;
      }, 2000);
    }
  }
})
</script>

