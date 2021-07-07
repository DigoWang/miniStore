<template>
  <view>
    <view
      v-if="showHeader"
      class="status"
      :style="{ position: headerPosition, top: statusTop }"
    ></view>
    <view
      v-if="showHeader"
      class="header"
      :style="{ position: headerPosition, top: headerTop }"
    >
      <view class="title">购物车</view>
    </view>
    <!-- 占位 -->
    <view v-if="showHeader" class="place"></view>
    <!-- 商品列表 -->
    <view class="goods-list">
      <view class="back" v-if="isExpire">
        <button type="primary" @click="toLogin">去登录</button></view
      >
      <view class="tis" v-if="!isExpire && goodsList.length == 0"
        >购物车是空的哦~</view
      >
      <view class="row" v-for="(row, index) in goodsList" :key="index">
        <!-- 删除按钮 -->
        <view class="menu" @tap.stop="deleteGoods(row)">
          <view class="icon shanchu"></view>
        </view>
        <!-- 商品 -->
        <view
          class="carrier"
          :class="[
            theIndex == index ? 'open' : oldIndex == index ? 'close' : '',
          ]"
          @touchstart="touchStart(index, $event)"
          @touchmove="touchMove(index, $event)"
          @touchend="touchEnd(index, $event)"
        >
          <!-- checkbox -->
          <view class="checkbox-box" @tap="selected(row)">
            <view class="checkbox">
              <view :class="[row.isChecked === 1 ? 'on' : '']"></view>
            </view>
          </view>
          <!-- 商品信息 -->
          <view class="goods-info">
            <view class="img">
              <image @tap="toGoods(row)" :src="row.imgUrl"></image>
            </view>
            <view class="info">
              <view @tap="toGoods(row)" class="title">{{ row.skuName }}</view>
              <view class="spec">规格:{{ row.brandName }}</view>
              <view class="price-number">
                <view class="price">￥{{ row.skuPrice }}</view>
                <view class="number">
                  <view class="sub" @tap.stop="changeCount(row, -1)">
                    <view class="icon jian"></view>
                  </view>
                  <view class="input">
                    <input
                      type="number"
                      v-model.number="row.skuNum"
                      @change.stop="changeCount(row)"
                    />
                  </view>
                  <view class="add" @tap.stop="changeCount(row, 1)">
                    <view class="icon jia"></view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 脚部菜单 -->
    <view class="footer" :style="{ bottom: footerbottom }">
      <view class="settlement">
        <view class="sum"
          >合计:<view class="money"
            >￥{{ (totalPrice || 0).toFixed(2) }}</view
          ></view
        >
        <view class="btn" @tap="toConfirmation">结算({{ selectedCount }})</view>
      </view>
      <view v-if="goodsList.length" class="checkbox-box" @tap="allSelect">
        <view class="checkbox">
          <view :class="[isAllselected ? 'on' : '']"></view>
        </view>
        <view class="text">全选</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      headerPosition: "fixed",
      headerTop: null,
      statusTop: null,
      showHeader: true,

      goodsList: [],
      //控制滑动效果
      theIndex: null,
      oldIndex: null,
      isStop: false,
      isExpire: false,
    };
  },
  onPageScroll(e) {
    //兼容iOS端下拉时顶部漂移
    this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
    this.headerTop = e.scrollTop >= 0 ? null : 0;
    this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + "px";
  },
  //下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
  async onPullDownRefresh() {
    // 获取购物车列表
    await this.getCartList();
    uni.showToast({
      title: "刷新成功",
      duration: 1000,
    });
    uni.stopPullDownRefresh();
  },
  onShow() {
    // 获取购物车列表
    this.getCartList();
  },
  onHide() {
    this.theIndex = null;
    this.oldIndex = null;
  },
  onLoad() {
    //兼容H5下结算条位置
    // #ifdef H5
    this.footerbottom =
      document.getElementsByTagName("uni-tabbar")[0].offsetHeight + "px";
    // #endif
    // #ifdef APP-PLUS
    this.showHeader = false;
    this.statusHeight = plus.navigator.getStatusbarHeight();
    // #endif
  },
  methods: {
    // 获取商品列表
    async getCartList() {
      const res = await this.$API("/cart/getCart");
      if (res.code === 200) {
        this.isExpire = false;
        this.goodsList = res.data.cartList;
      } else if (res.code === 201) {
        this.isExpire = true;
        this.goodsList = [];
        uni.showToast({
          icon: "error",
          title: "请登录后再试",
          duration: 2000,
        });
      }
    },

    //控制左滑删除效果-begin
    touchStart(index, event) {
      //多点触控不触发
      if (event.touches.length > 1) {
        this.isStop = true;
        return;
      }
      this.oldIndex = this.theIndex;
      this.theIndex = null;
      //初始坐标
      this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
    },
    touchMove(index, event) {
      //多点触控不触发
      if (event.touches.length > 1) {
        this.isStop = true;
        return;
      }
      let moveX = event.touches[0].pageX - this.initXY[0];
      let moveY = event.touches[0].pageY - this.initXY[1];

      if (this.isStop || Math.abs(moveX) < 5) {
        return;
      }
      if (Math.abs(moveY) > Math.abs(moveX)) {
        // 竖向滑动-不触发左滑效果
        this.isStop = true;
        return;
      }

      if (moveX < 0) {
        this.theIndex = index;
        this.isStop = true;
      } else if (moveX > 0) {
        if (this.theIndex != null && this.oldIndex == this.theIndex) {
          this.oldIndex = index;
          this.theIndex = null;
          this.isStop = true;
          setTimeout(() => {
            this.oldIndex = null;
          }, 150);
        }
      }
    },
    touchEnd(index, $event) {
      //结束禁止触发效果
      this.isStop = false;
    },
    //商品跳转
    toGoods(goods) {
      console.log(goods);
      uni.navigateTo({
        url: "/pages/goods/goods?skuId=" + goods.skuId,
      });
    },
    //跳转确认订单页面
    toConfirmation() {
      let tmpList = [];
      // let len = this.goodsList.length;
      tmpList = this.goodsList.filter((item) => item.isChecked === 1);
      if (tmpList.length < 1) {
        uni.showToast({
          title: "请选择商品结算",
          icon: "none",
        });
        return;
      }
      uni.setStorage({
        key: "orderInfo",
        data: {
          goodsList: tmpList,
          totalPrice: this.totalPrice,
        },
        success: function () {
          uni.navigateTo({
            url: `../../order/confirmation`,
          });
        },
      });
    },
    //删除商品
    async deleteGoods(row) {
      const res = await this.$API(
        "/cart/deleteOneCart?skuId=" + row.skuId,
        {},
        "delete"
      );
      if (res.code === 200) {
        this.theIndex = null;
        this.oldIndex = null;
        this.goodsList = this.goodsList.filter(
          (item) => item.skuId !== row.skuId
        );
        uni.showToast({
          title: "删除成功",
          duration: 2000,
        });
      } else {
        uni.showToast({
          icon: "error",
          title: "请再试一次",
          duration: 2000,
        });
      }
    },
    // 选中单个商品
    async selected(row) {
      const res = await this.$API(
        "/cart/checkOneCart",
        { skuId: row.skuId, isChecked: row.isChecked === 1 ? 0 : 1 },
        "POST"
      );
      if (res.code === 200) {
        row.isChecked = row.isChecked === 1 ? 0 : 1;
      } else {
        uni.showToast({
          icon: "error",
          title: "请勿重复点击",
          duration: 2000,
        });
      }
    },
    //全选
    async allSelect() {
      let status = this.isAllselected;
      const res = await this.$API(
        "/cart/checkAllCart",
        { isChecked: status ? 0 : 1 },
        "POST"
      );
      if (res.code === 200) {
        this.goodsList.forEach((item) => {
          item.isChecked = status ? 0 : 1;
        });
      } else {
        uni.showToast({
          icon: "error",
          title: "请勿重复点击",
          duration: 2000,
        });
      }
    },
    // 变更数量
    async changeCount(row, num) {
      if (num === -1 && row.skuNum === 1) {
        uni.showToast({
          icon: "error",
          title: "滑动可删除商品",
          duration: 2000,
        });
        return;
      }
      let skuNum;
      if (arguments.length === 1) {
        skuNum = row.skuNum;
      } else {
        skuNum = row.skuNum + num;
      }
      const res = await this.$API(
        "/cart/changeSkuNum",
        {
          skuNum,
          skuId: row.skuId,
        },
        "POST"
      );
      if (res.code === 200) {
        row.skuNum = skuNum;
      } else {
        uni.showToast({
          icon: "error",
          title: "请再试一次",
          duration: 2000,
        });
      }
    },
    // token过期去登录并清除storage
    toLogin() {
      uni.removeStorage({
        key: "Token",
        success: function () {
          uni.navigateTo({
            url: "/pages/login/login",
          });
        },
      });
    },
  },
  computed: {
    //  是否全选
    isAllselected() {
      return this.goodsList.every((item) => item.isChecked === 1);
    },
    // totalPrice
    totalPrice() {
      return this.goodsList.reduce((acc, cur) => {
        if (cur.isChecked === 1) {
          acc += cur.skuNum * cur.skuPrice;
          return acc;
        }
      }, 0);
    },
    // 选中数量
    selectedCount() {
      return this.goodsList.reduce((acc, cur) => {
        if (cur.isChecked === 1) {
          acc += cur.skuNum;
          return acc;
        }
      }, 0);
    },
  },
};
</script>
<style lang="scss">
page {
  position: relative;
  background-color: #fff;
}
.checkbox-box {
  display: flex;
  align-items: center;
  .checkbox {
    width: 35upx;
    height: 35upx;
    border-radius: 100%;
    border: solid 2upx #f06c7a;
    display: flex;
    justify-content: center;
    align-items: center;
    .on {
      width: 25upx;
      height: 25upx;
      border-radius: 100%;
      background-color: #f06c7a;
    }
  }
  .text {
    font-size: 28upx;
    margin-left: 10upx;
  }
}
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
  .title {
    font-size: 36upx;
  }
}
.place {
  background-color: #ffffff;
  height: 100upx;
  /*  #ifdef  APP-PLUS  */
  margin-top: var(--status-bar-height);
  /*  #endif  */
}
.goods-list {
  width: 100%;
  padding: 20upx 0 120upx 0;
  .tis {
    width: 100%;
    height: 60upx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32upx;
  }
  .row {
    width: calc(92%);
    height: calc(22vw + 40upx);
    margin: 20upx auto;

    border-radius: 15upx;
    box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    z-index: 4;
    border: 0;
    .menu {
      .icon {
        color: #fff;
        // font-size: 25upx;
      }
      position: absolute;
      width: 30%;
      height: 100%;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      color: #fff;
      z-index: 2;
    }
    .carrier {
      @keyframes showMenu {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-30%);
        }
      }
      @keyframes closeMenu {
        0% {
          transform: translateX(-30%);
        }
        100% {
          transform: translateX(0);
        }
      }
      &.open {
        animation: showMenu 0.25s linear both;
      }
      &.close {
        animation: closeMenu 0.15s linear both;
      }
      background-color: #fff;
      .checkbox-box {
        padding-left: 20upx;
        flex-shrink: 0;
        height: 22vw;
        margin-right: 20upx;
      }
      position: absolute;
      width: 100%;
      padding: 0 0;
      height: 100%;
      z-index: 3;
      display: flex;
      align-items: center;

      .goods-info {
        width: 100%;
        display: flex;
        padding-right: 20upx;
        .img {
          width: 22vw;
          height: 22vw;
          border-radius: 10upx;
          overflow: hidden;
          flex-shrink: 0;
          margin-right: 10upx;
          image {
            width: 22vw;
            height: 22vw;
          }
        }
        .info {
          width: 100%;
          height: 22vw;
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          .title {
            width: 100%;
            font-size: 28upx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            // text-align: justify;
            overflow: hidden;
          }
          .spec {
            font-size: 20upx;
            background-color: #f3f3f3;
            color: #a7a7a7;
            height: 30upx;
            display: flex;
            align-items: center;
            padding: 0 10upx;
            border-radius: 15upx;
            margin-bottom: 20vw;
          }
          .price-number {
            position: absolute;
            width: 100%;
            bottom: 0upx;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 28upx;
            height: 60upx;

            .number {
              display: flex;
              justify-content: center;
              align-items: flex-end;
              .input {
                width: 60upx;
                height: 60upx;
                margin: 0 10upx;
                background-color: #f3f3f3;
                input {
                  width: 60upx;
                  height: 60upx;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  font-size: 26upx;
                }
              }
              .sub,
              .add {
                width: 45upx;
                height: 45upx;
                background-color: #f3f3f3;
                border-radius: 5upx;
                .icon {
                  font-size: 22upx;
                  width: 45upx;
                  height: 45upx;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              }
            }
          }
        }
      }
    }
  }
}
.footer {
  width: 92%;
  padding: 0 4%;
  background-color: #fbfbfb;
  height: 100upx;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  font-size: 28upx;
  position: fixed;
  bottom: 0upx;
  z-index: 5;
  .delBtn {
    border: solid 1upx #f06c7a;
    color: #f06c7a;
    padding: 0 30upx;
    height: 50upx;
    border-radius: 30upx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .settlement {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .sum {
      // width: 70%;
      font-size: 28upx;
      margin-right: 10upx;
      display: flex;
      justify-content: flex-end;
      .money {
        font-weight: 600;
      }
    }
    .btn {
      padding: 0 30upx;
      height: 50upx;
      background-color: #f06c7a;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      border-radius: 30upx;
    }
  }
}
.back {
  button {
    font-size: 36upx;
    color: #fff;
    font-weight: bold;
    width: 100%;
  }
}
</style>
