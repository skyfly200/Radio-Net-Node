import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./views/Dashboard.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard
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
    }
  ]
});
