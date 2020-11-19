<template>
  <div class="box">
    <div>
      <span class="iconfont icon-zhuyi chenggong"></span>
    </div>
    <p>{{this.$route.query.errMsg}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.box{
  padding: 60px 0;
  text-align: center;
  .chenggong{
    font-size: 120px;
    color: rgb(255, 157, 53)
  }
  p{
    font-size: 32px;
    margin: 40px 0;
    color: #666;
  }
}
</style>


