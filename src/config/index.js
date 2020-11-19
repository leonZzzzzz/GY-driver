const ENV_DEVELOPMENT = process.env.NODE_ENV === "development";

// 图片前缀
export const COSPATH = "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com";

// 接口地址
export const APIPATH = ENV_DEVELOPMENT
  ? "mrguyu"
  : location.origin + location.pathname.match(/\/\w+/g)[0];

// 全局跳转
export const ROOTPATH = ENV_DEVELOPMENT
  ? "guyu"
  : location.origin + location.pathname.match(/\/\w+/g)[0];
