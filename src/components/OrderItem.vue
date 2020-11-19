<template>
  <div class="order-item" :class="{ 'order-item-top': index === 0 }">
    <div class="box" @click="$router.push(`/detail?id=${item.id}`)">
      <div class="top">
        <div>订单号：{{ item.number }}</div>
        <div :class="`${item.status}`">{{ item.status | orderStatus }}</div>
      </div>
      <div class="contact-wrap">
        <div class="name">{{ item.receiver }} {{ item.mobile }}</div>
        <div class="contact-cell">
          <span class="iconfont icon-shijian" />
          <span>{{ item.deliveryTime }}</span>
        </div>
        <div class="contact-cell">
          <span class="iconfont icon-dizhi1" />
          <span>{{ item.address }}</span>
        </div>
      </div>
      <div
        class="deliver-goods-item"
        v-for="(order, j) in item.orders"
        :key="j"
      >
        <div class="shop-name-wrap van-hairline--bottom">
          <div class="name">
            <img
              :src="$cospath + order.storeLogoIconUrl"
              v-lazy="$cospath + order.storeLogoIconUrl"
            />
            <span>{{ order.storeName }}</span>
          </div>
          <div class="num-wrap">
            共
            <span class="num">{{ order.labelCount || 0 }}</span>
            包
          </div>
        </div>
        <div class="goods-list">
          <div class="goods-item" v-for="(cell, k) in order.list" :key="k">
            <span class="dot"></span>
            <span class="goods-name">{{ cell.name }}</span>
            <span class="weight" v-if="(cell.weight * cell.qty)">{{ (cell.weight * cell.qty) / 1000 }}kg</span>
            <span class="weight" v-else>--</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    item: Object
  },
  filters: {
    orderStatus: status => {
      return {
        waitstock: "待备货",
        stockup: "已备货",
        waitloading: "待装车",
        waitdelivery: "待送货",
        takeover: "已收货",
        finish: "已完成"
      }[status];
    }
  }
};
</script>

<style lang="scss" scoped>
.order-item {
  padding: 0 20px 20px;
  background: #f6f6f6;
  &.order-item-top {
    padding-top: 20px;
  }
  .box {
    background: #fff;
    border-radius: 10px;
    padding-bottom: 30px;
    .top {
      padding: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      color: #666666;
      .waitstock,
      .stockup,
      .waitloading {
        color: #eb5122;
      }
      .waitdelivery,
      .takeover {
        color: #f28e00;
      }
      .finish {
        color: #58b84f;
      }
    }
    .contact-wrap {
      margin: 0 30px;
      padding: 20px;
      background: #f2f2f2;
      border-radius: 10px;
      .name {
        color: #222222;
        font-weight: 600;
        font-size: 30px;
        margin-bottom: 15px;
      }
      .contact-cell {
        color: #333333;
        font-size: 28px;
        display: flex;
        // align-items: center;
        margin-top: 5px;
        .iconfont {
          color: $primary-color;
          margin-right: 10px;
          padding-top: 2px;
          line-height: 1.2;
          // align-self: flex-start;
        }
      }
    }
    .deliver-goods-item {
      .shop-name-wrap {
        margin: 0 30px;
        padding: 30px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
          display: flex;
          align-items: center;
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-right: 10px;
            background: rgb(240, 240, 240);
          }
        }
        .num-wrap {
          font-size: 28px;
          color: #999999;
          .num {
            color: $primary-color;
          }
        }
      }
      .goods-list {
        // padding: 20px 0;
        padding-top: 10px;
        .goods-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px 0 100px;
          margin-top: 8px;
          color: #222222;
          position: relative;
          font-size: 28px;
          .dot {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: $primary-color;
            left: 70px;
            top: 50%;
            transform: translateY(-50%);
          }
          // .goods-name {
          //   &::before {
          //     // content: "";
          //     position: absolute;
          //     width: 10px;
          //     height: 10px;
          //     border-radius: 50%;
          //     background: $primary-color;
          //     left: -30px;
          //     top: 50%;
          //     transform: translateY(-50%);
          //   }
          // }
          .weight {
            color: #999999;
            flex-shrink: 0;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
