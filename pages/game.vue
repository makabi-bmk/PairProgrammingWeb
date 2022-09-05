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
  
</div>
</template>

<style>
.map {
  display: inline-block;
  padding-right: 50px;
}
.view {
  height: 420px;
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
        }
    },
    components: { Map }
}
</script>