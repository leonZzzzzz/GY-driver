import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import VueWechatTitle from "vue-wechat-title";
Vue.use(VueWechatTitle);

import { Toast, Notify, Lazyload } from "vant";
Vue.use(Toast, Notify);
Vue.use(Lazyload);

import { ImagePreview } from 'vant';
Vue.use(ImagePreview);
Vue.prototype.$ImagePreview = ImagePreview

import vConsole from "vconsole";
new vConsole();

import util from "@/utils/util";
Vue.prototype.$util = util;

import api from "@/api";
Vue.prototype.$api = api;

import { COSPATH } from "@/config";
Vue.prototype.$cospath = COSPATH;

Vue.config.productionTip = false;


let _vue = new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

export default _vue;
