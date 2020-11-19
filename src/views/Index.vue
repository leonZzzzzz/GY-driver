<template>
  <div>
    <div class="tabs ignore">
      <van-tabs v-model="pageData.section" @click="onRefresh">
        <van-tab title="今日待送" name="today"></van-tab>
        <van-tab title="历史配送" name="before"></van-tab>
      </van-tabs>
    </div>
    <div style="height: 44px;" />
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      class="refresh-box ignore"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="
          pageData.total === 0 && pageData.pageNum > 0
            ? '暂无数据'
            : '没有更多了'
        "
        @load="onLoad"
      >
        <order-item
          v-for="(item, i) in list"
          :key="i"
          :item="item"
          :index="i"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import OrderItem from "@/components/OrderItem";
import { List, PullRefresh, Tab, Tabs } from "vant";
export default {
  components: {
    OrderItem,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs
  },
  data() {
    return {
      active: 0,
      list: [],
      loading: false, //是否处于加载状态
      finished: false, //是否已加载完所有数据
      isLoading: false, //是否处于下拉刷新状态
      pageData: {
        pageSize: 20,
        pageNum: 0,
        total: 0,
        section: "today"
      }
    };
  },

  methods: {
    onRefresh() {
      console.log("onRefresh");
      //下拉刷新
      this.loading = true;
      this.finished = false;
      this.isLoading = false;
      this.pageData.pageNum = 0;
      this.pageData.total = 0;
      this.list = [];
      this.onLoad();
    },
    onLoad() {
      console.log("onLoad");
      this.pageData.pageNum++;
      this.deliveryNoteGetNoteList();
    },
    async deliveryNoteGetNoteList() {
      try {
        const res = await this.$api.deliveryNoteGetNoteList(this.pageData);
        console.log(res.data);
        const data = res.data.data;
        this.list = [...this.list, ...data.list];
        this.pageData.total = data.total;
        this.loading = false;
        if (this.list.length >= data.total) this.finished = true;
      } catch (err) {
        this.loading = false;
        this.finished = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tabs.ignore {
  height: 44px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
.refresh-box.ignore {
  height: calc(100vh - 44px);
  overflow-y: auto;
}
</style>
