<template>
  <div>
  <p v-text="message"></p>
  <!-- <div class="map"> -->
    <div v-if="role==='探検係'">
      <img v-if="roadView===0" class="map view" src="../static/road.png" />
      <img v-if="roadView===1" class="map view" src="../static/road_square.png" />
      <img v-if="roadView===2" class="map view" src="../static/road_triangle.png" />
  <!-- </div> -->
  <!-- <div class="map"> -->
    <Map class="map" :cells="cells"></Map>
  <!-- </div> -->

    <div class="map" id="key">
      <table>
        <tr>
          <td></td>
          <td><img class="button" id="up" @click="move('up')" src="../static/key2.png" /></td>
          <td></td>
        </tr>
        <tr>
          <td><img class="button" id="left" @click="move('left')" src="../static/key2.png" /></td>
          <td></td>
          <td><img class="button" id="right" @click="move('right')" src="../static/key2.png" /></td>
        </tr>
        <tr>
          <td></td>
          <td><img class="button" id="down" @click="move('down')" src="../static/key2.png" /></td>
        </tr>
      </table>
      <v-btn id="go" @click="research()">しらべる！</v-btn>
    </div>

    </div>

    <div v-if="role==='案内係'">
      <table id="navigator_view">
        <tr>
          <th colspan="2">
            <v-btn @click="showHint()">ヒントを見る</v-btn>
            <v-btn @click="exchangeRole()">相手と役目と交換する</v-btn>
            <v-btn v-if="isHelp===true" @click="requestHelp()">ヘルプを出す</v-btn>
            <v-btn @click="passQuestion()">この問題をパスする</v-btn>
          </th>
        </tr>
        <tr>
          <th><img id="question_img" :src="questionSrc" /></th>
          <th><img id="hint_img" v-if="hintFlag===true" :src="hintSrc" /></th>
        </tr>
      </table>
    </div>

    <Modal v-if="modalFlag">
      <img class="modal_image" v-if="resultStatus==='goal'" src="../static/goal.png" />
      <img class="modal_image" v-if="resultStatus==='failed'" src="../static/failed.png" />
      <img class="modal_image" v-if="resultStatus==='loading'" src="../static/wait.png" />
      <img class="modal_image" v-if="resultStatus==='help'" src="../static/wait.png" />

      <div>{{modalMessage}}</div>

      <v-btn v-if="resultStatus==='start'" @click="modalFlag=false">ゲームスタート</v-btn>
      <v-btn v-if="resultStatus==='goal'" @click="modalFlag=false; updateQuestion();">つぎにすすむ</v-btn>
      <v-btn v-if="resultStatus==='failed'" @click="modalFlag=false; resetQuestion()">もういちど</v-btn>
      <v-btn v-if="resultStatus==='help'" @click="modalFlag=false; startTimer()">自分の宝さがしに戻る</v-btn>

      <!-- <a href="./login-teacher">閉じる</a> -->
  </Modal>
  </div>
</template>

<style>
* {
  font-size: x-large;
}
#up {
  transform: rotate(270deg);
}
#right {
  transform: rotate(0deg);
}
#left {
  transform: rotate(180deg);
}
#down {
  transform: rotate(90deg);
}
#go {
  margin: 10px;
}
#question_img {
  /* height: 60vh; */
  width: 60vh;
  border: solid #459BAB;
}
#hint_img {
  width: 60vh;
  border: solid #459BAB;
}
#navigator_view {
  text-align: left;
  border-collapse: separate;
  border-spacing: 3vh;
  /* padding: 50px; */
}
.area {
  background-color: black;
}
.button {
  height: 7vh;
  /* margin: 0.5vh; */
}
.map {
  display: inline-block;
  vertical-align: top;
  margin: 1vh;
  text-align: center;
}
.view {
  height: 60vh;
  /* height: 23em; */
}
.modal_image {
  /* height: 15em; */
  height: 40vh;
}
</style>

<script>
import io from 'socket.io-client';
import Map from '~/components/Map.vue';
import Question from '~/components/Question';
import Modal from '~/components/Modal.vue';
import Pages from './index.vue';

export default {
  components: {
    Map,
    Pages
},
    data() {
        return {
            // a: this.$store.state.classID,
            // b: this.$store.state.pair_num,
            // c: this.$store.state.pairID,
            pairID: this.$store.state.pairID,
            studentID: this.$store.state.studentID,
            studentName: this.$store.state.student_name,
            isHelp: this.$store.state.isHelp,
            helpStudentName : '',
            resetNum: 0,
            countRate: [0, 0, 0],
            answer_i: 0,
            msg: "",
            msgs: [],
            socket: "",
            modalMessage: "ペアを待っています…",
            modalFlag: true,
            hintFlag: false,
            resultStatus: "loading",
            locate: [0,0],
            role: '',
            ifFirst: true,
            questionNum: [0, 0],
            message: 0-0,
            roadView: 0,
            level: 1,
            requestFlag : false,
            questionSrc: require('../static/question/1-1.png'),
            hintSrc: require('../static/hint/1-1.png'),

            startTime: 0,
            endTime: 0,
            exchange: false,
            pass: false,
            helpReq: false,
            helpUse: false,
            helpStudentName: '',
            cells :  [
                [5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            ans :  [
                [1, 1, 0, 3, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 2, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
        };
    },
    mounted() {
      if (this.studentID == '') {
        this.$router.push("/login-student");
      } else {
        console.log('help = ' + this.isHelp);

        // this.socket = io("http://ict-edu.okinawa-ct.ac.jp:3001");
        
        this.socket = io("http://localhost:3001");

        this.socket.on("check_pair", msg => {
          console.log('check_pair');
            console.log(msg);

            if (Object.keys(msg).length == 0) {
              this.modalMessage = 'ペアを待っています…';
              this.resultStatus = 'loading';
              this.modalFlag = true;
            } else {
              this.exchange = msg['exchange'];
              if (msg['role'] === '探検係') {
                if (!this.exchange) {
                  console.log('get question');
                  this.socket.emit("updateQuestion", {
                    pairID : this.pairID,
                    level : 1
                  });
                  // this.ifFirst = false;
                }
              }
            
              this.role = msg['role'];
                this.resultStatus = 'start';
                this.modalMessage = 'あなたは' + msg['role'] + 'です';
                this.modalFlag = true;
            }
        });
        this.socket.on("join", _ => {
          var socketData = {
            studentID: this.studentID,
            pairID : this.pairID
          };
          this.socket.emit("check_pair", socketData);
        });
        this.socket.on("updateQuestion", msg => {
          console.log("updateQuestion");
          console.log(msg);

          this.questionNum[0] = (msg['num'])[0];
          this.questionNum[1] = (msg['num'])[1];

          this.message = this.questionNum[0] + '-' + this.questionNum[1];
          this.questionSrc = require('../static/question/' + this.questionNum[0] + '-' + this.questionNum[1] + '.png');
          this.hintSrc     = require('../static/hint/' + this.questionNum[0] + '-' + this.questionNum[1] + '.png');

          // this.questionSrc.splice();
          // this.hintSrc.splice();

          if (msg['help'] == true) {
            // alert('助けて！！' + msg['help_name']);
            this.resultStatus = 'help';
            this.helpStudentName = msg['help_name'];
            this.modalMessage = this.helpStudentName + 'さん達のお助け係になろう！';
            this.modalFlag = true;
          }

          this.requestFlag = false;
          this.hintFlag = false;
          this.exchange = false;
          this.pass     = false;
          this.helpReq = false;
          this.helpUse = false;
          this.resetNum = false;
          this.helpStudentName = '';
          this.helpedStudentID = '';
          this.startTime = performance.now();
        });

        this.socket.on("help_accept", msg => {
          console.log('help_accept');
          this.helpedStudentID = msg['help_sutdentID'];
          alert('お助け係がくるよ！少し待っていてね');
          this.helpUse = true;
        });
        
        var socketData = {
          studentID : this.studentID,
          is_help: this.isHelp
        };
        this.socket.emit("join", socketData);
      }
    },
    beforeDestroyed() {
      //こいつ動いてないから後でどうにかする
      const socketData = {
          studentID : this.$store.state.studentID
      };
      this.socket.emit("close", socketData);
    },
    methods: {
        ho(a) {
          alert(a);
        },
        move(direction) {
          // console.log(this.cells);
          var present = [this.locate[0], this.locate[1]];

          if (direction === 'up') {
            present[0]--;
          } else if(direction === 'down') {
            present[0]++;
          } else if(direction === 'left') {
            present[1]--;
          } else if(direction === 'right') {
            present[1]++;
          }
          if (0 <= present[0] && present[0] < this.cells[0].length &&
              0 <= present[1] && present[1] < this.cells.length) {
                this.cells[this.locate[0]][this.locate[1]] = 4;
                    this.cells[present[0]][present[1]] = 5;
                  
                    this.locate[0] = present[0];
                    this.locate[1] = present[1];
                    this.cells.splice();

                    console.log(Question.road[this.questionNum[0] - 1][this.questionNum[1]]);
                    this.roadView = Question.road[this.questionNum[0] - 1][this.questionNum[1]][this.locate[0]][this.locate[1]];               
          }
        },
        research() {
          const ans = Question.ans[this.questionNum[0] - 1][this.questionNum[1]];
          console.log(ans);
          if(this.locate[0] == ans[0] && this.locate[1] == ans[1]) {
            this.countWin(1);
            this.resultStatus = 'goal';
            this.modalMessage = "せいこう！";
          } else {
            this.resultStatus = 'failed';
            this.modalMessage = "しっぱい…";
          }
          this.modalFlag = true;
        },
        updateQuestion() {
          this.endTime = performance.now();
              this.socket.emit("updateQuestion", {
                classID: this.$store.state.classID,
                studentID: this.studentID,
                pairID: this.pairID,
                questionNum: this.questionNum,
                level: this.level,
                // level: Math.floor(Math.random() * 4) + 1,
                interval: this.endTime - this.startTime,
                hint: this.hintFlag,
                exchange: this.exchange,
                help_req: this.helpReq,
                help_use: this.helpUse,
                help_student_name: this.helpStudentName,
                pass: this.pass,
              });

          this.resetQuestion();
            
        },
        startTimer() {
          this.startTime = performance.now();
        },
        resetQuestion() {
          this.locate[0] = 0;
          this.locate[1] = 0;
          this.cells =  [
                [5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ];
          this.cells.splice();
          if (this.resetNum < 2) {
            this.resetNum++;
          } else {
            // alert('むずかしい時は、「ヒント」「ヘルプを出す」「役目を交代する」を使ってみよう！');
            this.resetNum = 0;
            if (this.isHelp) {
              this.requestHelp();
            }
            
          }
        },
        
        exchangeRole() {
          this.socket.emit("exchangeRole", {pairID : this.pairID});
        },
        passQuestion() {
          this.countWin(0);
          this.pass = true;
          this.updateQuestion();
        },
        showHint() {
          console.log('ヒント押された');
          this.hintFlag = true;
        },
        requestHelp() {
          if (this.requestFlag == false) {
            this.requestFlag = true;
            this.socket.emit("requestHelp", {level : this.level, name: this.studentName});
            this.helpReq = true;
          }
          alert('お助け係を探しているよ！待っていてね。');
        },
        countWin(result) {
          console.log(this.countRate);
          console.log(this.answer_i);
          this.countRate[this.answer_i] = result;
          this.answer_i = this.answer_i + 1;
          console.log('level' + this.level);
          if (this.answer_i >= 3) {
            this.answer_i = 0;
            if (this.countRate[0] + this.countRate[1] + this.countRate[2]) {
              if (this.level >= 4) {
                this.level = 4;
              } else {
                this.level = this.level + 1;
              }
            } else {
              if (this.level <= 1) {
                this.level = 1;
              } else {
                this.level = this.level - 1;
              }
            }
          }
        },
    },
}
</script>