<template>
  <div class="detail" :class="{'skeleton-style': !detail.id}">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-skeleton title :row="6" :loading="!detail.id">
        <div class="top">
          <div>订单号：{{detail.number}}</div>
          <div class="wait">{{detail.status | orderStatus}}</div>
        </div>
        <div class="contact-wrap-bg">
          <div class="contact-wrap">
            <div class="name">{{detail.receiver}} {{detail.mobile}}</div>
            <div class="contact-cell">
              <span class="iconfont icon-shijian" />
              <span>{{detail.deliveryTime}}</span>
            </div>
            <div class="contact-cell">
              <span class="iconfont icon-dizhi1" />
              <span>{{detail.address}}</span>
            </div>
          </div>
        </div>
        <div class="image-box">
          <van-cell title="取货照片" v-if="detail.pickUpImage">
            <van-image
              slot="label"
              width="100"
              height="100"
              :src="$cospath + detail.pickUpImage"
              @click="previewImage([detail.pickUpImage])"
            />
          </van-cell>
          <van-cell title="装车照片" v-if="detail.loadingImage">
            <van-image
              slot="label"
              width="100"
              height="100"
              :src="$cospath + detail.loadingImage"
              @click="previewImage([detail.loadingImage])"
            />
          </van-cell>
        </div>
        <div class="deliver-goods">
          <div class="deliver-goods-item" v-for="(order, i) in detail.orders" :key="i">
            <div class="shop-name-wrap van-hairline--bottom">
              <div class="name">
                <img
                  :src="$cospath + order.storeLogoIconUrl"
                  v-lazy="$cospath + order.storeLogoIconUrl"
                />
                <span>{{order.storeName}}</span>
              </div>
              <div class="num-wrap">
                共
                <span class="num">{{order.labelCount || 0}}</span>
                包
              </div>
            </div>
            <div class="goods-list">
              <div class="goods-item" v-for="(cell, j) in order.list" :key="j">
                <span class="dot"></span>
                <span class="goods-name">{{cell.name}}</span>
                <span class="weight">{{cell.weight * cell.qty / 1000}}kg</span>
              </div>
            </div>
            <div class="remark-wrap van-hairline--top">
              <div class="remark-item" v-if="order.remark">
                <div class="remark-cell">
                  <div class="title">买家备注</div>
                  <div class="content">{{order.remark}}</div>
                </div>
              </div>
              <div
                class="remark-item"
                :class="{'van-hairline--top': order.remark}"
                v-if="order.storeRemark"
              >
                <div class="remark-cell">
                  <div class="title">店铺备注</div>
                  <div class="content">{{order.storeRemark}}</div>
                </div>
                <div class="img-list" v-if="order.storeImageRemark">
                  <div
                    class="img-item van-hairline--surround"
                    v-for="(img, g) in order.storeImageRemark.split('_')"
                    :key="g"
                  >
                    <!-- @click="order.storeImageRemark.split('_')" -->
                    <van-image
                      width="100%"
                      height="100%"
                      fit="cover"
                      lazy-load
                      :src="$cospath + img"
                      @click="previewImage([img])"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="placeholder-box"
          v-if="detail.status === 'waitstock' || detail.status === 'stockup' || detail.status === 'waitloading' || detail.status === 'waitdelivery'"
        >
          <div class="ignore"></div>
        </div>

        <div
          class="btn-wrap"
          v-if="detail.id && detail.status === 'waitstock' || detail.status === 'stockup' || detail.status === 'waitloading' || detail.status === 'waitdelivery'"
        >
          <!-- @click="updateStatus('deliveryNoteLoading')" -->
          <van-button
            type="primary"
            size="large"
            color="#F28E00"
            @click="showSetImage('deliveryNoteLoading')"
            v-if="detail.status === 'waitstock' || detail.status === 'stockup' || detail.status === 'waitloading'"
          >装车完毕</van-button>
          <van-button
            type="primary"
            size="large"
            color="#58B84F"
            @click="showSetImage('deliveryNoteDeliveryCompleted')"
            v-if="detail.status === 'waitdelivery'"
          >送货完毕</van-button>
        </div>
      </van-skeleton>
    </van-pull-refresh>
    <!-- closeable -->
    <van-popup v-model="showImagePopup" position="bottom" :style="{ height: '230px' }">
      <div class="imageForm">
        <p style="line-height: 3;text-align: center;font-size: 16px;margin-bottom: 20px;"></p>
        <van-field
          name="uploader"
          :label="apiName == 'deliveryNoteDeliveryCompleted' ? '上传装车照片' : '上传取货照片'"
          label-width="100px"
          :border="false"
        >
          <template #input>
            <van-uploader
              v-model="uploaderList"
              :max-count="1"
              :preview-full-image="false"
              :after-read="afterRead"
            />
          </template>
        </van-field>
        <div class="imageForm-btns" style="padding: 20px 0;text-align: right;">
          <van-button type="default" style="margin-right: 20px;" @click="showImagePopup = false">取 消</van-button>
          <van-button type="primary" style="margin-right: 20px;" @click="updateStatus(apiName)">确认提交</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Button, Image, Skeleton, PullRefresh, Popup, Field, Uploader, Cell  } from "vant";
export default {
  components: {
    [Button.name]: Button,
    [Image.name]: Image,
    [Skeleton.name]: Skeleton,
    [PullRefresh.name]: PullRefresh,
    [Popup.name]: Popup,
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [Cell.name]: Cell,

  },
  data() {
    return {
      detail: {},
      isLoading: false,  //是否处于下拉刷新状态,
      showImagePopup: false,
      apiName: '',
      uploaderList: [],
      imageUrl: ''
    };
  },
  created() {
    this.deliveryNoteGetDetail();
  },
  methods: {
    previewImage(list) {
      this.$ImagePreview({
        images: list.map(img => this.$cospath + img),
        closeable: true
      })
    },
    onRefresh() {
      console.log("onRefresh");
      //下拉刷新
      this.isLoading = false;
      this.detail = {};
      this.deliveryNoteGetDetail();
    },
    async deliveryNoteGetDetail() {
      const res = await this.$api.deliveryNoteGetDetail({
        id: this.$route.query.id
      });
      console.log(res.data);
      this.detail = res.data.data;
      // this.detail.orders = [...this.detail.orders, ...this.detail.orders];
    },
    async afterRead(e) {
      console.log('afterRead==>', e);
      // 此时可以自行将文件上传至服务器
      const file = e.file
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isLt3M) {
        this.$toast.fail("图片大小不能超过 3MB!");
        return
      }
      const toast = this.$toast.loading({
        message: "上传中...",
        forbidClick: true,
        duration: 0
      });
      try {
        let formFile = new FormData()
        formFile.append("file", file)
        formFile.append("imageType", 'deliveryImage')
        const res = await this.$api.uploadImage(formFile)
        toast.clear()
        this.$toast.success("上传成功")
        console.log(res.data.data)
        this.imageUrl = res.data.data.imageUrl
      } catch (error) {
         console.log(error)
         this.uploaderList = []
         this.imageUrl = ''
      }
    },
    showSetImage(type) {
      this.showImagePopup = true
      this.apiName = type
    },
    async updateStatus(api) {
      if (!this.imageUrl || this.imageUrl == 'undefined') {
        this.$toast.fail("请先上传照片");
        return false
      }
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
        overlay: false,
        duration: 0
      });
      
      let params = {
        id: this.detail.id || this.$route.query.id,
      }
      if (this.apiName == 'deliveryNoteLoading') params.pickUpImage = this.imageUrl
      if (this.apiName == 'deliveryNoteDeliveryCompleted') params.loadingImage = this.imageUrl
      await this.$api.setDeliveryImage(params)
      const res = await this.$api[api]({
        id: this.$route.query.id
      });
      this.showImagePopup = false
      this.imageUrl = ''
      this.uploaderList = []
      console.log(res.data);
      this.detail = {};
      this.$toast.success("更新成功");
      this.deliveryNoteGetDetail();
    }
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
.skeleton-style {
  background: #fff;
  padding: 50px 0;
}
.detail {
  min-height: 100vh;
  .van-uploader__preview-delete {
    top: 0;
  }
  .van-pull-refresh {
    min-height: 100vh;
  }
  .top {
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #666666;
    .wait {
      color: #eb5122;
    }
    .ing {
      color: #f28e00;
    }
    .success {
      color: #58b84f;
    }
  }
  .contact-wrap-bg {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAKBAMAAACOO0tGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMoaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ5QzNCOTcwN0I3RTExRTc5NTRFQ0QxNzZCOTBDQTlGIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5QzNCOTZGN0I3RTExRTc5NTRFQ0QxNzZCOTBDQTlGIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDlDM0I5NkI3QjdFMTFFNzk1NEVDRDE3NkI5MENBOUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDlDM0I5NkM3QjdFMTFFNzk1NEVDRDE3NkI5MENBOUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7R4hTYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRF////7G1ti7Xo7PP8ncHs8Y2N/vDw7nt70OH2+93d+MPDuNLy9Kam7nV17+fthdCLygAAAFJJREFUKM9jYIAALkHsYAFUnqFJCSvQgMlPxK5fBibPjF2/0gaoPFshdgMCYAaYYNevApNnxa5fPAGmwAm7Ac4w+YPYDZCEyXPj8IHBaBBSIwgBrBY4UQ+sC74AAAAASUVORK5CYII=) -7px
        top repeat-x,
      url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAKBAMAAACOO0tGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMoaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ5QzNCOTcwN0I3RTExRTc5NTRFQ0QxNzZCOTBDQTlGIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5QzNCOTZGN0I3RTExRTc5NTRFQ0QxNzZCOTBDQTlGIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDlDM0I5NkI3QjdFMTFFNzk1NEVDRDE3NkI5MENBOUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDlDM0I5NkM3QjdFMTFFNzk1NEVDRDE3NkI5MENBOUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7R4hTYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRF////7G1ti7Xo7PP8ncHs8Y2N/vDw7nt70OH2+93d+MPDuNLy9Kam7nV17+fthdCLygAAAFJJREFUKM9jYIAALkHsYAFUnqFJCSvQgMlPxK5fBibPjF2/0gaoPFshdgMCYAaYYNevApNnxa5fPAGmwAm7Ac4w+YPYDZCEyXPj8IHBaBBSIwgBrBY4UQ+sC74AAAAASUVORK5CYII=) -7px
        bottom repeat-x;
    background-size: 100px 8px;
    padding: 8px 0;
    .contact-wrap {
      // margin: 0 30px;
      padding: 30px;
      // background: #f2f2f2;
      border-radius: 10px;
      background-color: #fff;

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
  }
  .deliver-goods {
    padding-bottom: 30px;
    .deliver-goods-item {
      background-color: #fff;
      margin-top: 20px;
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

        .goods-item {
          // padding-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px 20px 100px;
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
          .weight {
            color: #999999;
            flex-shrink: 0;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .remark-wrap {
    // margin-top: 20px;
    background-color: #fff;
    .remark-item {
      padding: 30px 0;
      margin: 0 30px;
      .remark-cell {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #222222;
        .content {
          color: #666666;
          text-align: right;
          width: 500px;
          font-size: 28px;
        }
      }
      .img-list {
        display: flex;
        flex-wrap: wrap;
        .img-item {
          width: 210px;
          height: 210px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 30px 0 0 30px;
          &:nth-child(3n + 1) {
            margin-left: 0;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .placeholder-box {
    padding: 30px 0;
    .ignore {
      height: 50px;
    }
  }
  .btn-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px;
    background-color: #f6f6f6;
  }
}
</style>
