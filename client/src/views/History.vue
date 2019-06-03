<template lang="pug">
v-container
  v-layout.history
    v-flex(lg10 offset-lg1)
      HistoryList
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HistoryList from "@/components/History.vue"; // @ is an alias to /src

@Component({
  components: {
    HistoryList
  }
})
export default class History extends Vue {}
</script>
