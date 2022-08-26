<template>
<div>
  <v-card class="d-flex flex-column my-6 mx-auto" width="374">
    <v-form ref="form" v-model="valid">
      <v-card-title class="d-flex justify-center pa-0 mt-6 mb-3"
        >クラスの新規登録</v-card-title
      >
      <v-card-text class="d-flex justify-center flex-column">
        <div class="mx-9">
          <v-text-field
            v-model="classID"
            @change="isDuplicate"
            label="クラスID"
            placeholder="8文字以上の半角英数記号"
            outlined
            dense
            :rules="IDRules"
          ></v-text-field>
          <v-text-field
            v-model="class_name"
            label="クラスの名前"
            placeholder="15文字以内"
            outlined
            dense
            :rules="nameRules"
          ></v-text-field>

          <v-text-field
            v-model="admin_name"
            label="管理者名"
            placeholder="15文字以内"
            outlined
            dense
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="パスワード"
            placeholder="8文字以上の半角英数記号"
            outlined
            dense
            :rules="pwRules"
          ></v-text-field>
          <!-- <v-text-field
            label="メールアドレス"
            placeholder="mail@example.com"
            outlined
            dense
            :rules="mailRules"
          ></v-text-field> -->

        </div>
        <div class="text-center">
          <v-btn class="primary" :disabled="!valid" @click="makeAccount">新規登録</v-btn>
        </div>
        <div class="text-center">
          <a href="./login">ログイン画面に戻る</a>
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
      <div>追加しました</div>
      <a href="./login-teacher">ログイン画面に戻る</a>
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
// import Vue from 'vue'
import Modal from '~/components/Modal.vue'
import {
    disableBodyScroll
} from 'body-scroll-lock'

export default {
  compotents: {
    Modal
  },
  data() {
    return {
      valid: false,
      modalFlag: false,
      IDRules: [
        (v) => !!v || "mail is required",
        // this.$fire.database.ref(this.classID).on('value', (snapshot) => {
        //     console.log(snapshot.val());
        //     return snapshot.val() == null || 'このIDは既に使われています'
        // })
        // // v => this.isDuplicate() || 'そのIDは既に使われています'
      ],
      mailRules: [
        (v) => !!v || "mail is required",
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',],
      pwRules: [(v) => !!v || "password is required"],
    };
  },
  methods: {
    isDuplicate() {
        if(this.classID != '') {
            this.$fire.database.ref(this.classID).on('value', (snapshot) => {
                // console.log(snapshot.val());
                if (snapshot.val() != null) {
                    alert('そのIDは既に使われていて利用できません')
                }
            })
        }
    },
    validate() {
      this.$refs.form.validate();
    },
    makeAccount() {
        this.$fire.database.ref(this.classID).set({
            class_name: this.class_name,
            admin_name: this.admin_name,
            password: this.password
        });
        const modal = document.querySelector('.window');
        disableBodyScroll(modal);

        this.modalFlag = true
        // alert("追加しました");
    }
  },
};
</script>