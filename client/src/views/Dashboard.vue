<template lang="pug">
v-container
  v-layout.dashboard(wrap)
    v-flex.controls.ma-3(sm12 md10 offset-md1)
      Streams(:nowPlaying="current" :streams="streams" :status="status")
    v-flex.queue.ma-3(sm12 md10 offset-md1)
      Queue(:queue="queue")
  ControlBar
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Streams from "@/components/Streams.vue";
import ControlBar from "@/components/ControlBar.vue";
import Queue from "@/components/Queue.vue";

@Component({
  components: {
    Streams,
    ControlBar,
    Queue
  },
})
export default class Dashboard extends Vue {
  current: object = {};
  queue: Array<object> = [{}];
  status: Boolean = false;
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
      this.status = (this.current as any).Position < body.data.CurrentTrack.Position;
      this.current = body.data.CurrentTrack;
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
