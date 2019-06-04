<template lang="pug">
v-container
  v-layout.events
    v-flex(lg10 offset-lg1)
      EventList
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EventList from "@/components/Events.vue"; // @ is an alias to /src

@Component({
  components: {
    EventList
  }
})
export default class Events extends Vue {}
</script>
