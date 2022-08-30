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
      <tr v-for="(book, index) in books"
          v-bind:key="book.id">
        <th>{{index + 1}}</th>
        <td>{{book.id}}</td>
        <td>{{book.title}}</td>
        <td>{{book.price.toLocaleString()}}</td>
        <td>{{book.published}}</td>
        <td>{{book.isbn}}</td>
      </tr>
    </tbody>
    </table>

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

const books = [
  {
    id: 101,
    title: 'Vue.jsでレンダリング',
    price: 1730,
    published: '2021-01-01',
    isbn: '978-4-111111-11-1'
  },
  {
    id: 201,
    title: 'Vue.js入門',
    price: 1500,
    published: '2021-01-15',
    isbn: '978-4-222222-22-2'
  },
  {
    id: 301,
    title: 'Bulmaのすすめ',
    price: 1340,
    published: '2021-02-01',
    isbn: '978-4-333333-33-3'
  },
  {
    id: 401,
    title: 'Nuxt.js入門',
    price: 2400,
    published: '2021-02-15',
    isbn: '978-4-444444-44-4'
  },
  {
    id: 501,
    title: 'JavaScript入門',
    price: 1800,
    published: '2021-03-01',
    isbn: '978-4-555555-55-5'
  },
  {
    id: 601,
    title: '実践 JavaScript',
    price: 1590,
    published: '2021-03-15',
    isbn: '978-4-666666-66-6'
  },
  {
    id: 701,
    title: 'CSS3リファレンス',
    price: 2680,
    published: '2021-04-01',
    isbn: '978-4-777777-77-7'
  },
  {
    id: 801,
    title: 'HTML5リファレンス',
    price: 1470,
    published: '2021-04-15',
    isbn: '978-4-888888-88-8'
  },
  {
    id: 901,
    title: 'Vue.js 3.x 基礎',
    price: 2230,
    published: '2021-05-01',
    isbn: '978-4-999999-99-9'
  }
];
 
// テーブルのヘッダー配列
const headers = [
  'No',
  'ID',
  'タイトル',
  '価格',
  '発行日',
  'ISBN'
];

export default {
  layout: "default",
  name: "home",
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

      books: books,
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