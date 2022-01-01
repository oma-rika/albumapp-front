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
                                    アカウントを作成
                                </v-card-title>
                                <v-card-text class="pb-0">
                                        <v-form 
                                            ref="form"
                                            v-model="isValid"
                                        >
                                            <user-form-name
                                                :name.sync="params.user.name"
                                             />
                                            <user-form-email
                                                :email.sync="params.user.email"
                                                placeholder
                                             />
                                            <user-form-password
                                                :password.sync="params.user.password"
                                                set-validation
                                             />
                                            <v-btn
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
      name: '',
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
          setTimeout(() => {
              // Vuetify $refs.form.reset giving errors 
              // `https://stackoverflow.com/questions/51059402`
              const refForm: any = this.$refs.form;
              refForm.reset();
              for (const key in this.params.user) {
                  this.params.user[key] = '';
              }
              this.loading = false;
          }, 1500)
      }
  }
})
</script>
