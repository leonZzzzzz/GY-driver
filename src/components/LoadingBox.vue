<template>
  <transition name="van-fade">
    <div class="loading-box" v-if="visible">
      <van-loading />
    </div>
  </transition>
</template>

<script>
import { Loading } from "vant";
export default {
  components: {
    [Loading.name]: Loading
  },
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.loading-box {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  .van-loading {
    color: $primary-color;
    .van-loading__spinner {
      width: 200px;
      height: 200px;
    }
  }
}
</style>
