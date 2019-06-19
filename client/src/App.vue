<template lang="pug">
  v-app
    NavBar
    v-content
      router-view
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: 'App',
  components: { NavBar },
  data () {
    return {
      //
    }
  }
}
</script>
