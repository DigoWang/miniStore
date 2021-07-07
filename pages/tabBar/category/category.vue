<template>
  <view>
    <!-- 状态栏 -->
    <view class="status" :style="{ position: headerPosition }"></view>
    <view class="header" :style="{ position: headerPosition }">
      <view class="addr">
        <view class="icon location"></view>
        {{ city }}
      </view>
      <view class="input-box">
        <input
          placeholder="请输入关键字"
          placeholder-style="color:#c0c0c0;"
          @tap="toSearch()"
        />
        <view class="icon search"></view>
      </view>
      <view class="icon-btn"
        ><view class="icon tongzhi" @tap="toMsg"></view
      ></view>
    </view>
    <!-- 占位 -->
    <view class="place"></view>
    <view class="category-list">
      <!-- 左侧分类导航 -->
      <scroll-view scroll-y="true" class="left">
        <view
          class="row"
          v-for="(category, index) in category1List"
          :key="category.id"
          :class="[category.id == showCategoryId ? 'on' : '']"
          @tap="showCategory(category.id)"
        >
          <view class="text">
            <view class="block"></view>
            {{ category.name }}
          </view>
        </view>
      </scroll-view>
      <!-- 右侧子导航 -->
      <scroll-view scroll-y="true" class="right">
        <view class="category">
          <view class="banner"
            ><image src="../../../static/img/category/banner.jpg"></image
          ></view>
          <view v-for="c2 in fmtCategory2List" :key="c2.id">
            <view class="c2-title">{{ c2.name }}</view>
            <view class="list">
              <view
                class="box"
                v-for="(box, i) in category3List"
                :key="box.id"
                @tap="toCategory(box)"
                v-if="box.parentId === c2.id"
              >
                <image :src="box.picUrl"></image>
                <view class="text">{{ box.name }}</view>
              </view></view
            >
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
//高德SDK
import amap from "@/common/SDK/amap-wx.js";
export default {
  data() {
    return {
      showCategoryId: "",
      showCategory2Id: "",
      headerPosition: "fixed",
      city: "北京",
      //分类列表
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  onPageScroll(e) {
    //兼容iOS端下拉时顶部漂移
    if (e.scrollTop >= 0) {
      this.headerPosition = "fixed";
    } else {
      this.headerPosition = "absolute";
    }
  },
  onLoad() {
    this.getCategory1List();
    this.getCategory2List();
    this.getCategory3List();
    // this.amapPlugin = new amap.AMapWX({
    // 	//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
    // 	key: '7c235a9ac4e25e482614c6b8eac6fd8e'
    // });
    // //定位地址
    // this.amapPlugin.getRegeo({
    // 	success: (data) => {
    // 		this.city = data[0].regeocodeData.addressComponent.city.replace(/市/g,'');//把"市"去掉
    // 	}
    // });
  },
  methods: {
    //获取左侧列表
    async getCategory1List() {
      const res = await this.$API("/category/category_one");
      if (res.code === 200) {
        this.category1List = res.data.category1List;
        this.showCategoryId = res.data.category1List[0].id;
      }
    },
    //获取左侧列表
    async getCategory2List() {
      const res = await this.$API("/category/category_two");
      if (res.code === 200) {
        this.category2List = res.data.category2List;
      }
    },
    async getCategory3List() {
      const res = await this.$API("/category/category_three");
      if (res.code === 200) {
        this.category3List = res.data.category3List;
      }
    },
    //消息列表
    toMsg() {
      uni.navigateTo({
        url: "../../msg/msg",
      });
    },
    //分类切换显示
    showCategory(id) {
      this.showCategoryId = id;
    },
    // 去分类列表
    async toCategory(e) {
      this.$store.commit("REMOVE_GOODS_LIST");
      this.$store.dispatch("getCategoryGoodsList", {
        category3Id: e.id,
      });
      uni.navigateTo({
        url: `/pages/goods/goods-list/goods-list?name=${e.name}&id=${e.id}`,
      });
    },
    //搜索跳转
    toSearch() {
      uni.navigateTo({
        url: `/pages/search/search`,
      });
    },
  },
  computed: {
    // 筛选2级分类列表
    fmtCategory2List() {
      return this.category2List.filter(
        (item) => item.parentId === this.showCategoryId
      );
    },
    // // 筛选3级分类列表
    // fmtCategory3List() {
    //   return this.category3List.filter(
    //     (item) => item.parentId === this.showCategory2Id
    //   );
    // },
  },
};
</script>
<style lang="scss">
.status {
  width: 100%;
  height: 0;
  position: fixed;
  z-index: 10;
  background-color: #fff;
  top: 0;
  /*  #ifdef  APP-PLUS  */
  height: var(--status-bar-height); //覆盖样式
  /*  #endif  */
}

.header {
  width: 92%;
  padding: 0 4%;
  height: 100upx;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 10;
  background-color: #fff;
  /*  #ifdef  APP-PLUS  */
  top: var(--status-bar-height);
  /*  #endif  */

  .addr {
    width: 120upx;
    height: 60upx;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    font-size: 28upx;
    .icon {
      height: 60upx;
      margin-right: 5upx;
      display: flex;
      align-items: center;
      font-size: 42upx;
      color: #ffc50a;
    }
  }
  .input-box {
    width: 100%;
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
      right: 0;
      width: 60upx;
      height: 60upx;
      font-size: 34upx;
      color: #c0c0c0;
    }
    input {
      padding-left: 28upx;
      height: 28upx;
      font-size: 28upx;
    }
  }
  .icon-btn {
    width: 60upx;
    height: 60upx;
    flex-shrink: 0;
    display: flex;
    .icon {
      width: 60upx;
      height: 60upx;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 42upx;
    }
  }
}
.place {
  background-color: #ffffff;
  height: 100upx;
  /*  #ifdef  APP-PLUS  */
  margin-top: var(--status-bar-height);
  /*  #endif  */
}
.category-list {
  width: 100%;
  background-color: #fff;
  display: flex;
  .left,
  .right {
    position: absolute;

    top: 100upx;
    /*  #ifdef  APP-PLUS  */
    top: calc(100upx + var(--status-bar-height));
    /*  #endif  */
    bottom: 0upx;
  }
  .left {
    width: 24%;
    left: 0upx;
    background-color: #f2f2f2;
    .row {
      width: 100%;
      height: 90upx;
      display: flex;
      align-items: center;
      .text {
        width: 100%;
        position: relative;
        font-size: 28upx;
        display: flex;
        justify-content: center;
        color: #3c3c3c;
        .block {
          position: absolute;
          width: 0upx;
          left: 0;
        }
      }
      &.on {
        height: 100upx;
        background-color: #fff;
        .text {
          font-size: 30upx;
          font-weight: 600;
          color: #2d2d2d;
          .block {
            width: 10upx;
            height: 80%;
            top: 10%;
            background-color: #f06c7a;
          }
        }
      }
    }
  }
  .right {
    width: 76%;
    left: 24%;
    .category {
      width: 94%;
      padding: 20upx 3%;
      .banner {
        width: 100%;
        height: 24.262vw;
        border-radius: 10upx;
        overflow: hidden;
        box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.3);
        margin-bottom: 50upx;
        image {
          width: 100%;
          height: 24.262vw;
        }
      }
      .list {
        margin-top: 40upx;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .box {
          width: calc(71.44vw / 3);
          margin-bottom: 30upx;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;

          image {
            width: 60%;
            height: calc(71.44vw / 3 * 0.6);
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 2upx 5upx 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4upx);
            -webkit-backdrop-filter: blur(4upx);
            border-radius: 10upx;
            border: 1upx solid rgba(255, 255, 255, 0.18);
          }
          .text {
            margin-top: 5upx;
            width: 100%;
            display: flex;
            justify-content: center;
            font-size: 26upx;
          }
        }
      }
    }
  }
}
.mian {
  padding-top: 30upx;
}
</style>
