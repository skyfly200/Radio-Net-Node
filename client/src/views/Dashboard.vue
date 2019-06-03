<template lang="pug">
v-container
  v-layout.dashboard(wrap)
    v-flex.controls.ma-3(sm12 md10 offset-md1)
      Controls(:nowPlaying="'Testing 123'" :streams="['test 1', 'test 2']")
    v-flex.queue.ma-3(sm12 md10 offset-md1)
      Queue(:queue="mockQueue")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Controls from "@/components/Controls.vue"; // @ is an alias to /src
import Queue from "@/components/Queue.vue"; // @ is an alias to /src

@Component({
  components: {
    Controls,
    Queue
  }
})
export default class Dashboard extends Vue {
  mockQueue = [
        {
            title: 'Willy The Pimp',
            artist: 'Frank Zappa',
            album: 'Hot Rats',
            genera: 'Classic Rock',
            date: new Date('October 10, 1969'),
            duration: 183.54
        },
        {
            title: 'Money',
            artist: 'Pink Floyd',
            album: 'Dark Side of the Moon',
            genera: 'Classic Rock',
            date: new Date('March 1, 1973'),
            duration: 183.54
        },
        {
            title: 'Dont mean a thing',
            artist: 'Ella Fitzgerald',
            album: 'The Classics',
            genera: 'Swing',
            date: new Date('2001'),
            duration: 183.54
        }
    ];
}
</script>
<style lang="sass" scoped>
  .dashboard
    justify-content: center
    .flex
      width: 100%
</style>
