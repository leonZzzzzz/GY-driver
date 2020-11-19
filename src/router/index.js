import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/index"
    },
    {
      path: "/login",
      name: "login",
      meta: {
        title: "司机认证"
      },
      component: () =>
        import(/* webpackChunkName: "main" */ `@/views/Login.vue`)
    },
    {
      path: "/login-pc",
      name: "login-pc",
      meta: {
        title: "扫码认证"
      },
      component: () =>
        import(/* webpackChunkName: "main" */ `@/views/LoginPC.vue`)
    },
    {
      path: "/login-success",
      name: "login-success",
      meta: {
        title: "登录成功"
      },
      component: () =>
        import(/* webpackChunkName: "main" */ `@/views/Success.vue`)
    },
    {
      path: "/error",
      name: "error",
      meta: {
        title: "错误提示"
      },
      component: () =>
        import(/* webpackChunkName: "main" */ `@/views/Error.vue`)
    },
    {
      path: "/index",
      name: "index",
      meta: {
        title: "今日配送"
      },
      component: () =>
        import(/* webpackChunkName: "main" */ `@/views/Index.vue`)
    },
    {
      path: "/detail",
      name: "detail",
      meta: {
        title: "订单详情"
      },
      component: () =>
        import(/* webpackChunkName: "main" */ `@/views/Detail.vue`)
    },
    {
      path: "*",
      redirect: "/index"
    }
  ]
});
