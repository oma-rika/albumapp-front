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
                            align="center"
                        >
                            <v-card
                                class="mt-12"
                                max-width="350"
                            >
                                <v-card-title>
                                    ログイン
                                </v-card-title>
                                <v-card-text class="pb-0">
                                        <v-form
                                            ref="form"
                                            v-model="isValid"
                                        >
                                            <user-form-email
                                                :email.sync="params.user.email"
                                             />
                                            <user-form-password
                                                :password.sync="params.user.password"
                                             />
                                            <v-card-actions class="px-0 py-0">
                                                <v-btn
                                                    color="primary"
                                                    x-large
                                                    block
                                                    @click="login"
                                                    :disabled="!isValid || loading"
                                                    :loading="loading"
                                                    class="white--text"
                                                >
                                                    ログイン
                                                </v-btn>
                                            </v-card-actions>
                                            <v-card-actions class="px-0">
                                                <nuxt-link
                                                    to="#"
                                                    class="body-2 text-decoration-none"
                                                >
                                                    パスワードを忘れた場合はこちら
                                                </nuxt-link>
                                            </v-card-actions>
                                        </v-form>
                                        {{ params }}
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-main>
            <Footer />
        </v-app>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      isValid: false,
      loading: false,
      params: {
          user: {
              email: '',
              password: ''
          }
      }
    }
  },
  methods: {
      login() {
          this.loading = true;
          setTimeout(() => {
              this.$refs.form.reset()
              this.loading = false;
          }, 1500)
      }
  }
})
</script>
