<template lang="pug">
  v-app
    NavBar
    v-content
      router-view
    ControlBar
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import ControlBar from "@/components/ControlBar.vue";

export default {
  name: 'App',
  components: { NavBar, ControlBar },
  data () {
    return {
      //
    }
  }
}
</script>

<style lang="sass" scoped>
  .v-bottom-nav
    bottom: 60px
  .v-content
    margin-bottom: 60px
</style>

