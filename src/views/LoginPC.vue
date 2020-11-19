<template>
  <div class="login">
    <div class="title-wrap" v-if="type === 2">
      <div class="title">请输入您的手机号码进行认证</div>
      <div>手机号码必须在系统中存在相应的送货单数据</div>
    </div>
    <div class="field-wrap" v-if="type === 2">
      <van-cell-group class="cell-group" :border="false">
        <van-field
          v-model="model.mobile"
          placeholder="请输入您的手机号码"
          type="tel"
          size="large"
          center
          clearable
        >
          <span slot="left-icon" class="iconfont icon-shouji ignore" />
        </van-field>
      </van-cell-group>
      <van-cell-group class="cell-group" :border="false">
        <van-field
          v-model="model.code"
          placeholder="请输入短信验证码 "
          size="large"
          type="digit"
          center
          clearable
        >
          <span slot="left-icon" class="iconfont icon-xiugaimima1 ignore" />
          <van-button
            slot="button"
            size="small"
            type="primary"
            :plain="countDownVisible"
            :disabled="countDownVisible"
            @click="sendCode()"
          >
            <van-count-down
              :time="time"
              format="重新获取sss"
              @finish="countDownVisible = false"
              v-if="countDownVisible"
            />
            <span v-else>发送验证码</span>
          </van-button>
        </van-field>
      </van-cell-group>
    </div>
    <div class="submit-btn">
      <van-button
        type="primary"
        size="large"
        @click="sweepCodeAutoLogin()"
        v-if="type === 1"
        :disabled="disabledLogin === 'yes'"
        >登录PC</van-button
      >
      <van-button type="primary" size="large" @click="handleSubmit()" :disabled="disabledLogin === 'yes'" v-else
        >登录PC</van-button
      >
    </div>
  </div>
</template>

<script>
import { Field, CellGroup, Button, Icon, CountDown } from "vant";

export default {
  components: {
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [CountDown.name]: CountDown
  },
  data() {
    return {
      model: {
        mobile: "",
        code: "",
        key: this.$route.query.key
      },
      disabledLogin: 'no',
      time: 60 * 1000,
      countDownVisible: false,
      type: 1
    };
  },
  created() {
    this.disabledLogin = sessionStorage.getItem('disabledLogin')
  },
  methods: {
    async sweepCodeAutoLogin() {
      try {
        console.log(this.$route.query.key);
        const res = await this.$api.sweepCodeAutoLogin({
          key: this.model.key
        });
        console.log(res);
        this.$toast.success("PC登录成功");
        setTimeout(() => {
          this.$router.replace('/login-success')
        }, 1500);
      } catch (err) {
        console.error(err);
        if (err.data.code === 40001) {
          this.$toast("需手机号认证登录");
          this.type = 2;
        }
      }
    },
    async sendCode() {
      if (!this.model.mobile) {
        this.$notify("请输入您的手机号码");
        return;
      }
      if (!this.$util.checkPhone(this.model.mobile)) {
        this.$notify("手机号格式错误");
        return;
      }
      this.$toast.loading({
        message: "发送中...",
        forbidClick: true,
        duration: 0
      });
      await this.$api.sendCode({ mobile: this.model.mobile });
      this.$toast.clear();
      this.countDownVisible = true;
    },
    handleFinish() {
      console.log("handleFinish");
      this.time = 60 * 1000;
    },
    handleSubmit() {
      if (!this.model.mobile) {
        this.$notify("请输入您的手机号码");
        return;
      }
      if (!this.model.code) {
        this.$notify("请输入短信验证码");
        return;
      }
      if (!this.$util.checkPhone(this.model.mobile)) {
        this.$notify("手机号格式错误");
        return;
      }

      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
        duration: 0
      });
      this.login();
    },
    async login() {
      await this.$api.sweepCodeLogin(this.model);
      this.$toast.success("PC登录成功");
      setTimeout(() => {
        this.$router.replace('/login-success')
      }, 1500);
      
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  .title-wrap {
    padding: 50px 30px 30px;
    color: #999999;
    font-size: 26px;
    .title {
      color: #222222;
      font-size: 36px;
      margin-bottom: 10px;
    }
  }
  .field-wrap {
    .cell-group {
      margin: 30px;
      border: 1px solid #d1d1d1;
      border-radius: 10px;
      overflow: hidden;
      .ignore {
        color: #d1d1d1;
        font-size: 20px;
        display: flex;
        margin-right: 10px;
      }
    }
  }
  .submit-btn {
    padding: 100px 30px 30px;
  }
}
</style>
