<template lang="pug">
v-container
  v-layout.dashboard(wrap)
    v-flex.controls.ma-3(sm12 md10 offset-md1)
      Controls
    v-flex.queue.ma-3(sm12 md10 offset-md1)
      Queue
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
export default class Dashboard extends Vue {}
</script>
<style lang="sass" scoped>
  .dashboard

</style>
