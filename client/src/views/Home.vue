<template lang="pug">
.home
  h1 Welcome
  Status
</template>
<script>
import Status from"@/components/Status.vue";

export default {
  name: 'Home',
  components: { Status },
  data () {
    return {
      //
    }
  }
}
</script>
