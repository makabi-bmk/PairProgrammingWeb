<template>
  <div>
    <p v-if="User != null">Your e-mail is {{ User.email }}</p>
    <button @click="logout">Logout</button>
    <h2>User Profile</h2>

          <!-- <h2>検索結果</h2> -->

  <v-card v-if="isSuccessLogin">
    <v-form ref="form" v-model="valid">
      <v-card-title>{{class_name}}</v-card-title>
      <v-card-text>{{student_name}}さん<br/>
      ペア番号：{{pair_num}}</v-card-text>
      <v-btn @click="gameStart">ゲームスタート</v-btn>
    </v-form>
  </v-card>
    
    <Modal v-if="modalFlag">
      <img id="search" v-if="User != null" src="../static/serarch.png" />
      <div>{{modalMessage}}</div>
      <v-text-field
            v-model="classID"
            label="クラスを検索"
            placeholder="先生から聞いたクラス名を入力しよう"
            outlined
            dense
          ></v-text-field>
          <v-btn class="primary" @click="login">検索</v-btn>
  </Modal>
  </div>
</template>

<style scoped>
#search {
  height: 10em;
}
</style>

<script>
export default {
  layout: "default",
  name: "home",
//   middleware: "auth",
  data() {
    return {
      User: this.$store.state.authUser,
      modalMessage: '先生からきいたクラス名を打とう！',
      modalFlag: true,
      isSuccessLogin: false,
      class_name: '',
      student_name: '',
      pair_num: '',
    }
  },
  mounted() {
    // studentID = this.User.email.split('@')[0];
    // console.log(this.classID);
    // this.$fire.database.ref('/' + this.classID + '/students/' + studentID).on('value', (snapshot) => {
    //             console.log(snapshot.val());
    // //             if (snapshot.val() == null) {
    // //               const modal = document.querySelector('.window');
    // //               disableBodyScroll(modal);
    // //               this.consoleMessage = 'そのアドレスは既に使われていて使用できません';
    // //               this.modalFlag = true;
    // //               setTimeout(this.closeModal, 1500);
    // //             } else {
    // //               this.$fire.database.ref('/' + this.classID + '/students/').push(this.new_mail);
    // //               this.$fire.database.ref('/' + this.classID + '/students/' + this.new_mail + '/student_name/').set(this.new_student_name);
    // //               this.$fire.database.ref('/' + this.classID + '/students/' + this.new_mail + '/pair_num/').set(this.new_pair_num);
                  
    // //               const modal = document.querySelector('.window');
    // //               disableBodyScroll(modal);
    // //               this.consoleMessage = '生徒を追加しました';
    // //               this.modalFlag = true;
    // //               setTimeout(this.closeModal, 1500);
    // //             }
    //   });
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut()
    },
    login() {
      var studentID = this.User.email.split('@')[0];
      this.$store.commit('SET_STUDENT', studentID);
      
      console.log(this.classID);
      this.$fire.database.ref('/' + this.classID + '/students/' + studentID).on('value', (snapshot) => {
        console.log(snapshot.val());
        if (snapshot.val() == null) {
          this.isSuccessLogin = false;

          // const modal = document.querySelector('.window');
          // disableBodyScroll(modal);
          this.modalMessage = 'もう一度入力してみてね';
          // this.modalFlag = true;
          // setTimeout(this.closeModal, 3000);
        } else {
          this.$fire.database.ref('/' + this.classID).on('value', (snapshot) => {
            this.class_name = (snapshot.val())["class_name"];
          });

          this.student_name = (snapshot.val())["student_name"];
          this.pair_num = (snapshot.val())["pair_num"];
          this.isSuccessLogin = true;
          this.modalFlag = false;

          this.$store.commit('SET_CLASS', this.classID);
          
          this.$store.commit('SET_STUDENT_NAME', this.student_name);
          this.$store.commit('SET_PAIR_NUM', this.pair_num);
        }
      });
    },
    closeModal() {
      this.modalFlag = false;
    },
    gameStart() {
      this.$router.push("/game");
    }
  }
}
</script>