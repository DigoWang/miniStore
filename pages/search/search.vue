<template>
  <view>
    <view class="header">
      <view class="input-box">
        <view class="icon search"></view>
        <input
          placeholder="机顶盒"
          placeholder-style="color:#c0c0c0;"
          v-model="inputVal"
          :focus="firstFocus"
        />
      </view>
      <button type="warn" size="mini" class="right-button" @tap="search">
        搜索
      </button>
    </view>
    <view class="main">
      <view class="recentSearch">
        <view class="top">
          <text class="title">最近搜索</text>
          <text class="icon shanchu" @click="remove"></text>
        </view>
        <view class="content" @click="cardSearch">
          <text
            class="card"
            :data-name="item"
            v-for="(item, index) in recentList"
            :key="index"
            >{{ item }}</text
          >
        </view>
      </view>
      <view class="hotSearch">
        <view class="top">
          <text class="title">热门搜索</text>
          <text class="shanchu" @click="isShow = !isShow">{{
            isShow ? "隐藏" : "显示"
          }}</text>
        </view>
        <view class="content" @click="cardSearch" v-if="isShow"
          ><text
            :data-name="item"
            class="card"
            v-for="(item, index) in hotList"
            >{{ item }}</text
          ></view
        >
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
      firstFocus: false,
      inputVal: "",
      recentList: [],
      hotList: [],
    };
  },
  methods: {
    // 初始化数据
    async initData() {
      this.recentList = wx.getStorageSync("RECENT_LIST") || [];
      const res = await this.$API("/goods/hot_search");
      if (res.code === 200) {
        this.hotList = res.data;
      }
    },
    // 点击搜索 跳转页面 同时给storage添加历史记录
    async search() {
      const val = this.inputVal.trim();
      // 变更list
      if (val) {
        const index = this.recentList.findIndex((item) => item === val);
        if (index >= 0) {
          this.recentList.splice(index, 1);
        }
        this.recentList.unshift(val);
        wx.setStorageSync("RECENT_LIST", this.recentList);
        // 发送请求 跳转的逻辑
        this.$store.commit("REMOVE_GOODS_LIST");
        const res = await this.$store.dispatch("getGoodsList", {
          keyword: this.inputVal.trim(),
        });
        if (res) {
          uni.navigateTo({
            url: `/pages/goods/goods-list/goods-list?name=${this.inputVal.trim()}`,
          });
        } else {
          uni.showToast({
            icon: "error",
            title: "搜索失败",
            duration: 2000,
          });
        }
      } else {
        wx.showToast({
          title: "请勿输入空信息",
          icon: "error",
        });
      }
      this.inputVal = "";
    },
    // 点击卡片跳转
    async cardSearch(e) {
      let keyword = e.target.dataset.name;
      if (keyword) {
        const index = this.recentList.findIndex((item) => item === keyword);
        if (index >= 0) {
          this.recentList.splice(index, 1);
        }
        this.recentList.unshift(keyword);
        wx.setStorageSync("RECENT_LIST", this.recentList);
        // 发送请求 跳转的逻辑
        this.$store.commit("REMOVE_GOODS_LIST");
        const res = await this.$store.dispatch("getGoodsList", {
          keyword,
        });
        if (res) {
          uni.navigateTo({
            url: `/pages/goods/goods-list/goods-list?name=${keyword}`,
          });
        } else {
          uni.showToast({
            icon: "error",
            title: "搜索失败",
            duration: 2000,
          });
        }
      }
      this.inputVal = "";
    },
    // 删除
    remove() {
      this.recentList = [];
      uni.setStorageSync("RECENT_LIST", this.recentList);
    },
  },
  mounted() {
    this.initData();
    // 自动获取焦点
    this.firstFocus = true;
  },
};
</script>

<style lang="scss">
.header {
  margin-top: 20upx;
  height: 80upx;
  border-bottom: 3upx solid #eee;
  display: flex;
  .input-box {
    margin-left: 20upx;
    width: 75%;
    height: 60upx;
    background-color: #f5f5f5;
    border-radius: 30upx;
    position: relative;
    display: flex;
    align-items: center;
    .icon {
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      left: 30upx;
      width: 60upx;
      height: 60upx;
      font-size: 34upx;
      color: #c0c0c0;
    }
    input {
      padding-left: 128upx;
      height: 28upx;
      font-size: 28upx;
    }
  }
  .right-button {
    margin-left: 10upx;
    height: 60upx;
    line-height: 60upx;
  }
}
.main {
  padding: 20upx 30upx 0;
  .recentSearch,
  .hotSearch {
    margin-top: 20upx;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 38upx;
      }
      .shanchu {
        font-size: 35upx;
        color: #999;
      }
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    .card {
      height: 30upx;
      line-height: 30upx;
      background-color: #eee;
      padding: 10upx;
      font-size: 28upx;
      color: #999;
      border-radius: 10upx;
      margin: 10upx 20upx 10upx 0;
    }
  }
}
</style>
