<template lang="pug">
v-container
  v-layout.dashboard(wrap)
    v-flex.controls.ma-3(sm12 md10 offset-md1)
      Controls(:nowPlaying="current" :streams="streams")
    v-flex.queue.ma-3(sm12 md10 offset-md1)
      Queue(:queue="queue")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Controls from "@/components/Controls.vue"; // @ is an alias to /src
import Queue from "@/components/Queue.vue"; // @ is an alias to /src

@Component({
  components: {
    Controls,
    Queue
  },
})
export default class Dashboard extends Vue {
  current: object = {};
  queue: Array<object> = [{}];
  streams: Array<string> = ['test 1', 'test 2'];

  created() {
    // init now playing and playlist
    this.getQueue();

    // get streams
  }
  getQueue() {
    (this as any).$http.get("/npjson")
    .then((body: any) => {
      console.log(body.data);
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
