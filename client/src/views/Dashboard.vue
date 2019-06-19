<template lang="pug">
v-container
  v-layout.dashboard(wrap)
    v-flex.controls.ma-3(sm12 md10 offset-md1)
      Streams(:streams="streams")
    v-flex.queue.ma-3(sm12 md10 offset-md1)
      Queue(:queue="queue")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Streams from "@/components/Streams.vue";
import Queue from "@/components/Queue.vue";

@Component({
  components: {
    Streams,
    Queue
  },
})
export default class Dashboard extends Vue {
  queue: Array<object> = [{}];
  streams: Array<object> = [
    {text: 'Way High Radio', value: 96}
  ];

  created() {
    // init now playing and playlist
    this.getNP();
    setInterval(function (this: any) {
      (this as any).getNP();
    }.bind(this), 1000); 

    // get streams
  }
  getNP() {
    (this as any).$http.get("/radiodj/npjson")
    .then((body: any) => {
      this.queue = body.data.Playlist;
    });
  }
}
</script>
<style lang="sass" scoped>
  .dashboard
    justify-content: center
    .flex
      width: 100%
</style>
