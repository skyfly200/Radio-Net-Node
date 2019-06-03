<template>
  <v-app>
    <v-toolbar app dense>
      <v-toolbar-title class="headline">Radio Net Node</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn to="/" flat>Dashboard</v-btn>
        <v-btn to="/history" flat>History</v-btn>
        <v-btn to="/events" flat>Events</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>
