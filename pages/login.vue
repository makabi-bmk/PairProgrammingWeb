<template>
<div>
  <v-card class="d-flex flex-column my-6 mx-auto" width="374">

    <v-text-field
            v-model="classID"
            label="クラスID"
            placeholder="15文字以内"
            outlined
            dense
            :rules="nameRules"
    ></v-text-field>

    <v-text-field
            v-model="studentID"
            label="生徒ID"
            placeholder="15文字以内"
            outlined
            dense
            :rules="nameRules"
    ></v-text-field>
    <v-form ref="form">
      <v-card-title class="d-flex justify-center pa-0 mt-6 mb-3"
        >ログイン</v-card-title
      >
      <v-card-text class="d-flex justify-center flex-column">
        <div class="mx-9">
          <!-- <v-text-field
            label="クラスID"
            placeholder="15文字以内"
            outlined
            dense
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            label="生徒ID"
            placeholder="15文字以内"
            outlined
            dense
            :rules="nameRules"
          ></v-text-field> -->
          <!-- <v-text-field
            label="メールアドレス"
            placeholder="mail@example.com"
            outlined
            dense
            :rules="mailRules"
          ></v-text-field> -->
          <!-- <v-text-field
            label="パスワード"
            placeholder="8文字以上の半角英数記号"
            outlined
            dense
            :rules="pwRules"
          ></v-text-field> -->
        </div>
        <div class="text-center">
          <v-btn class="primary" @click="signInWithGoogle">Googleアカウントでログイン</v-btn>
        </div>
        <div class="text-center">
          <a href="./login-teacher">教員用ログインはこちら</a>
          <!-- <v-btn class="primary" :disabled="!valid">教員用ログイン</v-btn> -->
        </div>
        <!-- <p class="signUp-border-top text-center mt-6 mb-0 pt-6">
          教員用ログインはこちら
        </p>
        <v-btn
          class="fill-width mt-6 text-capitalize caption mx-4"
          rounded
          color="#00ACEE"
          dark
          depressed
          height="48px"
          @click="submitTwitter"
        >
          ログイン
        </v-btn>
        <v-btn
          class="fill-width mt-6 text-capitalize caption mx-4 mb-6"
          rounded
          height="48px"
          outlined
          style="border-color: #979797"
          @click="submitGoogle"
        >
          講師用ログイン
        </v-btn> -->
      </v-card-text>
    </v-form>
  </v-card>
  </div>

  <!-- <div>
  <v-card class="d-flex flex-column my-6 mx-auto" width="374">
    <v-form ref="form" v-model="valid">
      <v-card-title class="d-flex justify-center pa-0 mt-6 mb-3"
        >新規登録</v-card-title
      >
      <v-card-text class="d-flex justify-center flex-column">
        <div class="mx-9">
          <v-text-field
            label="ユーザー名"
            placeholder="15文字以内"
            outlined
            dense
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            label="メールアドレス"
            placeholder="mail@example.com"
            outlined
            dense
            :rules="mailRules"
          ></v-text-field>
          <v-text-field
            label="パスワード"
            placeholder="8文字以上の半角英数記号"
            outlined
            dense
            :rules="pwRules"
          ></v-text-field>
        </div>
        <div class="text-center">
          <v-btn class="primary" :disabled="!valid">登録</v-btn>
        </div>
        <p class="signUp-border-top text-center mt-6 mb-0 pt-6">
          ソーシャルアカウントでログイン
        </p>
        <v-btn
          class="fill-width mt-6 text-capitalize caption mx-4"
          rounded
          color="#00ACEE"
          dark
          depressed
          height="48px"
          @click="submitTwitter"
        >
          <img
            class="button-logo-img mr-4"
            src="~/static/v.png"
            style="height: 20px"
          />
          twitterでログイン
        </v-btn>
        <v-btn
          class="fill-width mt-6 text-capitalize caption mx-4 mb-6"
          rounded
          height="48px"
          outlined
          style="border-color: #979797"
          @click="submitGoogle"
        >
          <img
            class="button-logo-img mr-4"
            src="https://madeby.google.com/static/images/google_g_logo.svg"
            style="height: 24px"
          />
          Googleでログイン
        </v-btn>
      </v-card-text>
    </v-form>
  </v-card>
  </div> -->
</template>
 
<script>
  export default {
    layout: "default",
    name: "login",
    methods: {
      async signInWithGoogle() {
      const provider = new this.$fireModule.default.auth.GoogleAuthProvider();
      await this.$fire.auth.signInWithPopup(provider).then(res => {
  
        res.user.getIdToken(true).then(idToken => {
          localStorage.setItem('access_token', idToken.toString())
          localStorage.setItem('refresh_token', res.user.refreshToken.toString())
        })
      })
      console.log('成功しました')
      this.$router.push("/home");
    },
    },
  }
</script>