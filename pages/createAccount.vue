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
                                ref="form"
                                class="mt-12"
                                max-width="350"
                            >
                                <v-card-title>
                                    ログイン
                                </v-card-title>
                                <v-card-text class="pb-0">
                                        <v-form
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
                                                @click="submit"
                                                :disabled="!isValid"
                                                class="white--text"
                                            >
                                                ログイン
                                            </v-btn>
                                        </v-form>
                                        {{ params }}
                                </v-card-text>
                                <v-card-actions class="pt-4 pb-4 pr-0 pl-0 mr-4 ml-4">
                                    <!--<v-btn
                                    color="primary"
                                    x-large
                                    block
                                    @click="submit"
                                    >
                                    ログイン
                                    </v-btn>-->
                                </v-card-actions>
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
      name: 'qqq',
      params: {
          user: {
              name: '',
              email: '',
              password: ''
          }
      }
    }
  },
})
</script>
