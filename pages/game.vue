<template>
  <div>
  <!-- <p>{{a}}</p>
  <p>{{b}}</p>
  <p>{{c}}</p> -->
  <!-- <section class="section">
    <div class="field">
      <div class="control">
        <input class="input" type="text" v-model="msg" @keypress.enter.exact="sendMessage">
      </div>
    </div>
    <article class="media" v-for="(msg, index) in msgs" :key="index">
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{ msg.name }}</strong>
            <br>
            {{ msg.text }}
          </p>
        </div>
      </div>
    </article>
  </section> -->

  <!-- <div class="map"> -->
    <div v-if="role==='探検係'">
      <img v-if="roadView===0" class="map view" src="../static/road.png" />
      <img v-if="roadView===1" class="map view" src="../static/road_square.png" />
      <img v-if="roadView===2" class="map view" src="../static/road_triangle.png" />
  <!-- </div> -->
  <!-- <div class="map"> -->
    <Map class="map" :cells="cells"></Map>
  <!-- </div> -->
    <!-- <img class="map" id="key" src="../static/key.png" usemap="#move" />
    <map name="move">
      <area shape="rect" coords="100,0,200,100" @click="ho(1)" alt="リンク1" />
      <area shape="rect" coords="0,100,100,200" @click="ho(2)" alt="リンク2" />
      <area shape="rect" coords="100,200,700,1000" @click="ho(3)" alt="リン3" />
      <area shape="rect" coords="200,100,1045,1000" @click="ho(4)" alt="リンク4" /> -->
    <!-- </map> -->

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
      <img id="question_img" :src="questionSrc" />
      <v-btn @click="exchangeRole()">相手と役目と交換する</v-btn>
    </div>

    <Modal v-if="modalFlag">
      <img class="modal_image" v-if="resultStatus==='goal'" src="../static/goal.png" />
      <img class="modal_image" v-if="resultStatus==='failed'" src="../static/failed.png" />
      <img class="modal_image" v-if="resultStatus==='loading'" src="../static/wait.png" />

      <div>{{modalMessage}}</div>

      <v-btn v-if="resultStatus==='start'" @click="modalFlag=false">ゲームスタート</v-btn>
      <v-btn v-if="resultStatus==='goal'" @click="modalFlag=false; updateQuestion()">つぎにすすむ</v-btn>
      <v-btn v-if="resultStatus==='failed'" @click="modalFlag=false; resetQuestion()">もういちど</v-btn>

      <!-- <a href="./login-teacher">閉じる</a> -->
  </Modal>
  </div>
</template>

<style>
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
  height: 60vh;
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

/*
var question = [
    [[5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [[5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [[5, 0, 0, 0, 2, 0, 0, 0, 0, 0],
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
];
*/

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
            msg: "",
            msgs: [],
            socket: "",
            modalMessage: "ペアを待っています…",
            modalFlag: true,
            resultStatus: "loading",
            locate: [0,0],
            role: '',
            questionNum: [0, 0],
            roadView: 0,
            questionSrc: require('../static/question/1-1.png'),
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
        this.$router.push("/login");
      } else {
        this.socket = io("http://ict-edu.okinawa-ct.ac.jp:3001");
        // this.socket.on("new-msg", msg => {
        //     console.log(msg);
        //     this.msgs.push(msg);
        // });
        this.socket.on("check_pair", msg => {
          console.log('check_pair');
            console.log(msg);

            if (Object.keys(msg).length == 0) {
              this.modalMessage = 'ペアを待っています…';
              this.resultStatus = 'loading';
              this.modalFlag = true;
            } else {
              var socketData = {
                pairID : this.pairID,
                level : 1
              };

            if (msg['role'] === '探検係') {
              console.log('get question');
              this.socket.emit("updateQuestion", socketData);
            }
            
            this.role = msg['role'];
              this.resultStatus = 'start';
              this.modalMessage = 'ゲームスタート！あなたは' + msg['role'] + 'です';
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

          this.questionSrc = require('../static/question/' + this.questionNum[0] + '-' + this.questionNum[1] + '.png');
          // console.log(this.questionSrc);
        });
        

        var socketData = {
          studentID : this.studentID
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
        // sendMessage() {
        //     this.msg = this.msg.trim();
        //     if (this.msg) {
        //         const message = {
        //             name: this.socket.id,
        //             text: this.msg,
        //         };
        //         // イベント元はブロードキャストを受けないので自分でmessageを追加する
        //         this.msgs.push(message);
        //         // send-msgイベントでmessageをサーバーサイドに投げる
        //         this.socket.emit("send-msg", message);
        //         this.msg = "";
        //     }
        // },
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
                    // console.log()
                    this.roadView = Question.road[this.questionNum[0] - 1][this.questionNum[1]][this.locate[0]][this.locate[1]];

                // switch(this.ans[present[0]][present[1]]) {
                //   // case 0:
                //   //   this.cells[present[0]][present[1]] = 2;
                //   // break;

                //   case 0:
                //   case 1:
                //   case 2:
                //     this.cells[this.locate[0]][this.locate[1]] = 4;
                //     this.cells[present[0]][present[1]] = 5;
                  
                //     this.locate[0] = present[0];
                //     this.locate[1] = present[1];
                //   break;

                //   // case 2:
                //   // this.cells[present[0]][present[1]] = 3;
                //   // break;
                // }
                
          }
        },
        research() {
          const ans = Question.ans[this.questionNum[0] - 1][this.questionNum[1]];
          console.log(ans);
          if(this.locate[0] == ans[0] && this.locate[1] == ans[1]) {
            this.resultStatus = 'goal';
            this.modalMessage = "せいこう！";
          } else {
            this.resultStatus = 'failed';
            this.modalMessage = "しっぱい…";
          }
          this.modalFlag = true;
        },
        updateQuestion() {
          var socketData = {
                pairID : this.pairID,
                level : Math.floor(Math.random() * 4)
          };

            // if (msg['role'] === '探検係') {
              // console.log('get question');
              this.socket.emit("updateQuestion", socketData);

              this.resetQuestion();
            
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
        },
        exchangeRole() {
          const socketData = {
            // studentID : this.$store.state.studentID,
            pairID : this.pairID
          };
          this.socket.emit("exchangeRole", socketData);
        }
    },
}
</script>