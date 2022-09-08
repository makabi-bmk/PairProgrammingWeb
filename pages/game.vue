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
    <Map class="map"></Map>
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
          <td><img id="up" src="../static/key2.png" /></td>
          <td></td>
        </tr>
        <tr>
          <td><img id="left" src="../static/key2.png" /></td>
          <td><img id="down" src="../static/key2.png" /></td>
          <td><img id="right" src="../static/key2.png" /></td>
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
    data() {
        return {
            msg: "",
            msgs: [],
            socket: "",

        };
    },
    mounted() {
        this.socket = io("http://localhost:3001");
        this.socket.on("new-msg", msg => {
            console.log(msg);
            this.msgs.push(msg);
        });
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
        }
    },
    components: { Map }
}
</script>