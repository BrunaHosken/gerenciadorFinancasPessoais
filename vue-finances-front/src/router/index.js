import Vue from "vue";
import VueRouter from "vue-router";
import authRoutes from "./../modules/auth/router";
import dashboardRoutes from "./../modules/dashboard/router";

Vue.use(VueRouter);

const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  { path: "", redirect: "/login" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
