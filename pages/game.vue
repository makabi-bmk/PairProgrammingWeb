<template>
  <div>
  <section class="section">
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
  </section>

  <!-- <div class="map"> -->
    <img class="map view" src="../static/road.png" />
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
          <td><img id="up" @click="move('up')" src="../static/key2.png" /></td>
          <td></td>
        </tr>
        <tr>
          <td><img class="button" id="left" @click="move('left')" src="../static/key2.png" /></td>
          <td><img class="button" id="down" @click="move('down')" src="../static/key2.png" /></td>
          <td><img class="button" id="right" @click="move('right')" src="../static/key2.png" /></td>
        </tr>
      </table>
      <v-btn id="go">しらべる！</v-btn>
    </div>
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
.area {
  background-color: black;
}
.map {
  display: inline-block;
  vertical-align: top;
  margin: 1em;
  text-align: center;
}
.view {
  height: 23em;
}
</style>

<script>
import io from 'socket.io-client';
import Map from '~/components/Map.vue';

export default {
  components: {
    Map
  },
    data() {
        return {
            msg: "",
            msgs: [],
            socket: "",
            locate: [0,0],
            cells :  [
                [5, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
            ],
            ans :  [
                [1, 1, 0, 3, 0, 0],
                [0, 1, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0],
                [0, 1, 1, 2, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
            ],
        };
    },
    mounted() {
        this.socket = io("http://localhost:3001");
        this.socket.on("new-msg", msg => {
            console.log(msg);
            this.msgs.push(msg);
        });
    },
    computed() {
      
    },
    methods: {
        sendMessage() {
            this.msg = this.msg.trim();
            if (this.msg) {
                const message = {
                    name: this.socket.id,
                    text: this.msg,
                };
                // イベント元はブロードキャストを受けないので自分でmessageを追加する
                this.msgs.push(message);
                // send-msgイベントでmessageをサーバーサイドに投げる
                this.socket.emit("send-msg", message);
                this.msg = "";
            }
        },
        ho(a) {
          alert(a);
        },
        move(direction) {
          console.log(this.cells);
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
                switch(this.ans[present[0]][present[1]]) {
                  case 0:
                    this.cells[present[0]][present[1]] = 2;
                  break;

                  case 1:
                    this.cells[this.locate[0]][this.locate[1]] = 4;
                    this.cells[present[0]][present[1]] = 5;
                  
                    this.locate[0] = present[0];
                    this.locate[1] = present[1];
                  break;

                  case 2:
                  this.cells[present[0]][present[1]] = 3;
                  break;
                }
                this.cells.splice();
          }
        },
        checkRoot(x, y) {
          if (this.ans[x][y] == 1) {
            return true;
          }
          else false;
        }
    },
}
</script>