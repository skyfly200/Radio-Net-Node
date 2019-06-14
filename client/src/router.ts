import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () =>
        import(/* webpackChunkName: "home" */ "./views/Dashboard.vue")
    },
    {
      path: "/history",
      name: "history",
      component: () =>
        import(/* webpackChunkName: "history" */ "./views/History.vue")
    },
    {
      path: "/events",
      name: "events",
      component: () =>
        import(/* webpackChunkName: "events" */ "./views/Events.vue")
    },
    {
      path: "/songs",
      name: "songs",
      component: () =>
        import(/* webpackChunkName: "songs" */ "./views/Songs.vue")
    }
  ]
});
