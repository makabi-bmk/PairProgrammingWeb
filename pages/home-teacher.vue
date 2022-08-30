<template>
    <div>
    <h1>クラス名</h1>
<v-tabs>
  <v-tab href="#tab-1">登録情報の編集</v-tab>
  <v-tab href="#tab-2">生徒情報の管理</v-tab>
  <v-tab href="#tab-3">過去の授業ログ</v-tab>

  <v-tab-item value="tab-1">
  
  <h2>登録情報</h2>
        <p>クラスID：{{classID}}</p>
        <p>クラス名：{{class_name}}</p>
        <p>管理者名： {{admin_name}}</p>
        <p>パスワード：***</p>

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
        
    <h2>生徒一覧</h2>
    <p>生徒数：{{member_num}}名</p>
    <table>
    <thead>
      <tr>
        <th v-for="(header, index) in headers"
            v-bind:key="index">
          {{header}}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(student, index) in students"
          v-bind:key="student.id">
        <!-- <th>{{index + 1}}</th> -->
        <td>{{student.studentID}}</td>
        <td>{{student.student_name}}</td>
        <td>{{student.pair_num}}</td>
      </tr>
    </tbody>
    </table>


  <h2>生徒の追加</h2>
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
  <v-tab-item value="tab-3">
    Tab 3 Content
  </v-tab-item>
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
import { getMaxListeners } from 'process';

const students = [
  {
    studentID: 'nojiko0101@gmail.com',
    student_name: '田中角栄',
    pair_num: 1730,
  },
  {
    studentID: 'nojiko0101@gmail.com',
    student_name: '佐藤栄作',
    pair_num: 1730,
  },
];
 
// テーブルのヘッダー配列
const headers = [
  // 'No',
  'メールアドレス',
  '生徒名',
  'ペア番号',
];

export default {
  layout: "default",
  name: "home",
  member_num: "0",
//   middleware: "auth",
  data() {
    return {
      //TODO: ここあとでコメントアウト外す
      // classID: this.$store.state.classID,
      classID: 'class4',
      class_name: 'class_name',
      admin_name: 'admin_name',
      password: 'password',
      modalFlag: false,

      students: students,
      headers: headers,
    }
  },
  created() {
    console.log(this.$store.state.classID);
    if (this.classID == '') {
      const modal = document.querySelector('.window');
      disableBodyScroll(modal);
      this.consoleMessage = '再度ログインしてください';
      this.modalFlag = true;
      setTimeout(this.goToLogin, 3000);
    } else {
      this.$fire.database.ref(this.classID).on('value', (snapshot) => {
        this.class_name = snapshot.val().class_name
        this.admin_name = snapshot.val().admin_name
        this.password   = snapshot.val().password
      });
    }
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
    goToLogin() {
      this.$router.push("login-teacher")
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