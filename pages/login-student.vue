<template>
<div>
  <v-card class="d-flex flex-column my-6 mx-auto" width="374">
    <v-form ref="form" v-model="valid">
      <v-card-title class="d-flex justify-center pa-0 mt-6 mb-3"
        >生徒用ログイン</v-card-title
      >
      <v-card-text class="d-flex justify-center flex-column">
        <div class="mx-9">
          <v-text-field
            v-model="classID"
            label="クラスID"
            placeholder="15文字以内"
            outlined
            dense
            :rules="nameRules"
          ></v-text-field>
          <!-- <v-text-field
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
          <v-text-field
            v-model="studentID"
            label="生徒ID"
            placeholder="8文字以上の半角英数記号"
            outlined
            dense
            :rules="pwRules"
          ></v-text-field>
        </div>
        <div class="text-center">
          <v-btn class="primary" :disabled="!valid" @click="login">ログイン</v-btn>
        </div>
        <div class="text-center">
          <a href="./signup">新規登録はこちら</a>
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
  <Modal v-if="modalFlag">
      <div>{{loginMessage}}</div>
      <!-- <a href="./login-teacher">閉じる</a> -->
  </Modal>
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
import Modal from '~/components/Modal.vue'
import {
    disableBodyScroll
} from 'body-scroll-lock'
import { setTimeout } from 'timers';
// import store from '~/store/index'

export default {
  compotents: {
    Modal
  },
  data() {
    return {
      valid: false,
      modalFlag: false,
      loginMessage: 'test',
      mailRules: [
        (v) => !!v || "mail is required",
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',],
      pwRules: [(v) => !!v || "password is required"],
    };
  },
  methods: {
    login() {
      this.$fire.database.ref(this.classID + '/students/' + this.studentID).on('value', (snapshot) => {
                const modal = document.querySelector('.window');
                disableBodyScroll(modal);

                console.log(snapshot.val());
                if (snapshot.val() != null) {
                  this.loginMessage = 'ログインに成功しました'
                  console.log("login success")

                  this.$store.commit('SET_STUDENT', this.studentID);
                  this.$store.commit('SET_CLASS', this.classID);
                  // this.$store.commit('SET_CLASS', this.classID)
                  // console.log(this.$store.state.classID)
                  // this.$store.state.classID

                  this.modalFlag = true
                  setTimeout(this.goToHome, 1500)
                } else {
                  this.loginMessage = 'ログインに失敗しました'
                  console.log("login failured")

                  this.modalFlag = true
                  setTimeout(this.closeModal, 1500)
                }
            })
    },
    goToHome() {
      this.$router.push("/home")
    },
    closeModal() {
      this.modalFlag = false
    },
    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>