import { get, post, upload } from "./http";

export default {
  // 上传图片
  uploadImage: params => upload("/api/v1/attachments/images/tencent_cloud", params),
  // 发送手机验证码
  sendCode: params => get("api/driver/v1/driverLogin/sendCode", params),
  // 手机号登录
  login: params => post("api/driver/v1/driverLogin/login", params),
  // 自动登录
  autoLogin: params => post("api/driver/v1/driverLogin/autoLogin", params),
  // 退出登录
  logout: params => get("api/driver/v1/driverLogin/logout", params),
  // 送货单列表
  deliveryNoteGetNoteList: params =>
    get("api/driver/v1/deliveryNote/getNoteList", params),
  // 送货单详情
  deliveryNoteGetDetail: params =>
    get("api/driver/v1/deliveryNote/getDetail", params),
  // 装车完毕
  deliveryNoteLoading: params =>
    post("api/driver/v1/deliveryNote/loading", params),
  // 送货完毕
  deliveryNoteDeliveryCompleted: params =>
    post("api/driver/v1/deliveryNote/deliveryCompleted", params),
  // 扫码认证pc页面
  sweepCodeAutoLogin: params =>
    post("api/driver/v1/driverLogin/sweepCodeAutoLogin", params),
  // 扫码手机号验证码认证pc
  sweepCodeLogin: params =>
    post("api/driver/v1/driverLogin/sweepCodeLogin", params),
  /**
   * 取货装车上传照片
   * 取货就传id和pickUpImage
   * 装车就传id和loadingImage
   */
  setDeliveryImage: params =>
    post("api/driver/v1/deliveryNote/setImage", params)
};
