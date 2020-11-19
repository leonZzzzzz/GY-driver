<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    console.log('App created ===> 自动登录')
    this.$api.autoLogin().then(() => {
      sessionStorage.setItem('disabledLogin', 'no')
    }).catch(res => {
      if (/当前司机已冻结/.test(res.data.message)) {
        sessionStorage.setItem('disabledLogin', 'yes')
        this.$router.push(`/error?errMsg=${res.data.message}`)
      } else {
        sessionStorage.setItem('disabledLogin', 'no')
      }
    })
  }
};
</script>

<style lang="scss">
// @import "//at.alicdn.com/t/font_1434692_dgwtbc7p7wf.css";
@import "//at.alicdn.com/t/font_1434692_lpncatl76ek.css";

html,
body {
  background: #f6f6f6;
  // height: 100vh;
}
* {
  margin: 0;
  padding: 0;
}
img {
  width: 100%;
  height: auto;
  vertical-align: top;
  content: normal !important;
}
.van-uploader__preview-delete {
  top: 0px !important;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
