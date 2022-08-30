<template>
    <div>
    <h1>クラス名</h1>
<v-tabs>
  <v-tab href="#tab-1">登録情報の編集</v-tab>
  <v-tab href="#tab-2">生徒情報の管理</v-tab>
  <!-- <v-tab href="#tab-3">Three</v-tab> -->

  <v-tab-item value="tab-1">

  
  <h2>登録情報</h2>
        <p>クラスID：{{class_name}}</p>
        <p>クラス名：{{class_name}}</p>
        <p>管理者名： {{admin_name}}</p>
        <p>パスワード：***</p>

      <button @click="logout">Logout</button>
    <p>ID = {{ message }}</p>

  <h2>登録情報の変更</h2>
        <v-form ref="form" v-model="valid">
        
        <div class="mx-9">
          <!-- <p><v-text-field
            v-model="classID"
            label="クラスID"
            placeholder="8文字以上の半角英数記号"
            outlined
            dense
            :rules="IDRules"
          ></v-text-field><v-btn>変更</v-btn></p> -->
          
          <v-text-field
            v-model="new_class_name"
            outlined
            label="クラスの名前"
            append-outer-icon="mdi-send"
            @click:append-outer="changeClassName"
          ></v-text-field>

          <v-text-field
            v-model="new_admin_name"
            outlined
            label="管理者名"
            append-outer-icon="mdi-send"
            @click:append-outer="changeAdminName"
          ></v-text-field>

          <v-text-field
            v-model="new_password"
            outlined
            label="パスワード"
            append-outer-icon="mdi-send"
            @click:append-outer="changePassword"
          ></v-text-field>

        </div>

    </v-form>

  </v-tab-item>

  <v-tab-item value="tab-2">
    Tab 2 Content
  </v-tab-item>
  <!-- <v-tab-item value="tab-3">
    Tab 3 Content
  </v-tab-item> -->
</v-tabs>

<Modal v-if="modalFlag">
      <div>{{consoleMessage}}</div>
      <!-- <a href="./login-teacher">閉じる</a> -->
  </Modal>

  </div>
</template>

<script>
import Modal from '~/components/Modal.vue'
import {
    disableBodyScroll
} from 'body-scroll-lock'
import { setTimeout } from 'timers';

export default {
  layout: "default",
  name: "home",
//   middleware: "auth",
  data() {
    return {
      // classID: this.$store.state.classID,
      classID: 'class4',
      class_name: 'class_name',
      admin_name: 'admin_name',
      password: 'password',
      User: this.$store.state.authUser,
      modalFlag: false,
    }
  },
  created() {
    // if (this.classID == '') {

    // }
    this.$fire.database.ref(this.classID).on('value', (snapshot) => {
      this.class_name = snapshot.val().class_name
      this.admin_name = snapshot.val().admin_name
      this.password   = snapshot.val().password
    })
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut()
    },
    changeClassName() {
      this.updateData('class_name', this.new_class_name)
    },
    changeAdminName() {
      this.updateData('admin_name', this.new_admin_name)
    },
    changePassword() {
      this.updateData('password', this.new_password);
    },
    updateData(key, value) {
      this.$fire.database.ref('/' + this.classID + '/' + key).set(value);

      const modal = document.querySelector('.window');
      disableBodyScroll(modal);
      this.consoleMessage = '変更しました';
      this.modalFlag = true;
      setTimeout(this.closeModal, 3000);
    },
    closeModal() {
      console.log("yobarerooooooooooo");
      this.modalFlag = false
    },
  }
}
</script>

<style scoped>
* {
  /* margin: 10px; */
  padding: 3px;
}
</style>