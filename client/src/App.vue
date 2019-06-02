<template>
  <v-app>
    <v-toolbar app compact>
      <v-toolbar-title class="headline">Radio Net Node</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" flat>Home</v-btn>
      <v-btn to="/about" flat>About</v-btn>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      //
    }
  }
}
</script>
