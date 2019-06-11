<template lang="pug">
v-container
  v-layout.history
    v-flex(lg10 offset-lg1)
      SongsList
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SongsList from "@/components/Songs.vue"; // @ is an alias to /src

@Component({
  components: {
    SongsList
  }
})
export default class Songs extends Vue {}
</script>
