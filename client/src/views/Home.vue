<template>
  <div class="home">
    <Controls/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Controls from "@/components/Controls.vue"; // @ is an alias to /src

@Component({
  components: {
    Controls
  }
})
export default class Home extends Vue {}
</script>
