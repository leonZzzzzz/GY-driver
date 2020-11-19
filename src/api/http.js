import axios from "axios";
import qs from "qs";
import { APIPATH } from "@/config";
import { Toast } from "vant";
import Vue from "../main";

axios.defaults.timeout = 60000; // 响应时间
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8"; // 配置请求头
axios.defaults.baseURL = APIPATH;

axios.interceptors.response.use(
  res => {
    console.log("api接口请求=======>", res.config.url);
    console.log("params", res.config.params);
    console.log("res.data", res.data);
    if (res.data.code === 20000) {
      return res;
    } else if (res.data.code === 10000) {
      let l = location;
      let url =
        l.origin + l.pathname + "POUND" + l.hash.substr(1, l.hash.length - 1);
      // alert('跳转连接：' + url)
      location.href = url;
    } else if (res.data.code === 50103) {
      Vue.$router.replace("/login");
      return Promise.reject(res);
    } else {
      Toast(res.data.message);
      return Promise.reject(res);
    }
  },
  function axiosRetryInterceptor(err) {
    return Promise.reject(err);
  }
);
export const get = (url, params) => {
  return axios.get(url, { params });
};

export const post = (url, params) => {
  return axios.post(url, qs.stringify(params));
};
export const json = (url, params) => {
  return axios.post(url, params, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};
export const upload = (url, params) => {
  return axios.post(url, params, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
