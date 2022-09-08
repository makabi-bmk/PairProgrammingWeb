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
        <td><v-btn v-on:click="deleteStudent(student.studentID)">削除</v-btn></td>
        <td>{{student.studentID}}@gmail.com</td>
        <td>{{student.student_name}}</td>
        <td>{{student.pair_num}}</td>
      </tr>
    </tbody>
    </table>


  <h2>生徒の追加</h2>
  <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="new_mail"
            label="メールアドレス"
            placeholder="mail@example.com"
            suffix="@gmail.com"
            outlined
            dense
            :rules="mailRules"
          ></v-text-field>
          <v-text-field
            v-model="new_student_name"
            label="生徒名"
            placeholder="15文字以内"
            outlined
            dense
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            v-model="new_pair_num"
            label="ペア番号"
            placeholder="8文字以上の半角英数記号"
            outlined
            dense
          ></v-text-field>
        <div class="text-center">
          <v-btn class="primary" :disabled="!valid" @click="addStudent">新規登録</v-btn>
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

var students = [];
 
// テーブルのヘッダー配列
const headers = [
  ' ',
  'メールアドレス',
  '生徒名',
  'ペア番号',
];

export default {
  layout: "default",
  name: "home",
//   middleware: "auth",
  data() {
    return {
      //TODO: ここあとでコメントアウト外す
      classID: this.$store.state.classID,
      valid: false,
      class_name: 'class_name',
      admin_name: 'admin_name',
      password: 'password',
      modalFlag: false,
      students: students,
      headers: headers,
      member_num: 0,
    }
  },
  created() {
    // console.log(this.$store.state.classID);
    if (this.classID == '') {
      const modal = document.querySelector('.window');
      disableBodyScroll(modal);
      this.consoleMessage = '再度ログインしてください';
      this.modalFlag = true;
      setTimeout(this.goToLogin, 3000);
    } else {
      this.$fire.database.ref(this.classID).on('value', (snapshot) => {
        this.class_name = snapshot.val().class_name;
        this.admin_name = snapshot.val().admin_name;
        this.password   = snapshot.val().password;
      });
    }

    this.$fire.database.ref(this.classID + '/students').on('value', (snapshot) => {
      // console.log(snapshot.val());
      students.splice(0);
      this.member_num = 0;
      for (var user in snapshot.val()) {
        if (typeof snapshot.val()[user] != 'string') {
          var mail_address  = user;
          var student_name  = (snapshot.val())[user]["student_name"];
          var pair_num      = (snapshot.val())[user]["pair_num"];
          students.push({
            studentID: mail_address,
            student_name: student_name,
            pair_num: pair_num
          });
          this.member_num++;
        } else {
          console.log(user);
          console.log('/' + this.classID + '/students/' + user);
          this.$fire.database.ref('/' + this.classID + '/students/' + user).remove();
        }
      }
      students.sort(this.compare);
    });
    
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
      setTimeout(this.closeModal, 1500);
    },
    closeModal() {
      // console.log("yobarerooooooooooo");
      this.modalFlag = false
    },
    goToLogin() {
      this.$router.push("login-teacher")
    },
    addStudent() {

      this.$fire.database.ref('/' + this.classID + '/students/' + this.new_mail).on('value', (snapshot) => {
                // console.log(snapshot.val());
                if (snapshot.val() != null) {
                  const modal = document.querySelector('.window');
                  disableBodyScroll(modal);
                  this.consoleMessage = 'そのアドレスは既に使われていて使用できません';
                  this.modalFlag = true;
                  setTimeout(this.closeModal, 1500);
                } else {
                  this.$fire.database.ref('/' + this.classID + '/students/').push(this.new_mail);
                  this.$fire.database.ref('/' + this.classID + '/students/' + this.new_mail + '/student_name/').set(this.new_student_name);
                  this.$fire.database.ref('/' + this.classID + '/students/' + this.new_mail + '/pair_num/').set(this.new_pair_num);
                  
                  const modal = document.querySelector('.window');
                  disableBodyScroll(modal);
                  this.consoleMessage = '生徒を追加しました';
                  this.modalFlag = true;
                  setTimeout(this.closeModal, 1500);
                }
      });


    },
    compare(a, b) {
      var r = 0;
      if (a.pair_num < b.pair_num) {
        r = -1;
      } else if(a.pair_num > b.pair_num) {
        r = 1;
      }
      return r;
    },
    deleteStudent(studentID) {
      this.$fire.database.ref('/' + this.classID + '/students/' + studentID).remove();
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