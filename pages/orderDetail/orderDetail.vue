<template>
  <view>
    <view class="header">
      <view class="barContainer" v-if="showClose === true">
        <uni-notice-bar
          speed="20"
          showIcon="true"
          scrollable="true"
          single="true"
          text="受道路资源影响。您的订单可能会有所延迟，我们将尽快为您送达，请耐心等待！"
        ></uni-notice-bar>
        <view class="close">
          <uni-icons
            type="closeempty"
            color="#de8c17"
            size="15"
            @click="closeNoticeBar"
          />
        </view>
      </view>
      <view class="f1">
        <uni-icons type="checkbox" color="#fff" size="20"></uni-icons>
        <text class="status">完成</text></view
      >
      <view class="f2">
        <view class="redPacket">
          <uni-icons type="shop" size="14"></uni-icons>京喜红包
        </view>
        <text>您有 6.00 元红包待领取</text>
        <text class="get">立即领取</text>
      </view>
    </view>
    <view class="main">
      <view class="card deliveryInfo">
        <view class="title">
          <uni-icons type="paperplane-filled" color="skyblue"></uni-icons>
          <view class="info">
            <text>已签收</text>
            <view>
              您的订单已由本人签收，点击快递员头像可进行评价，打赏或者寄件，快递员：mistletoe,电话：
              <text>18612345678</text>。
            </view>
          </view>
          <uni-icons type="arrowright" color="#999"></uni-icons>
        </view>
      </view>
      <view class="card deliveryInfo">
        <view class="title">
          <uni-icons type="location-filled" color="yellowgreen"></uni-icons>
          <view class="info">
            <text style="margin-right: 15upx">Mistletoe</text>
            <text>186****5065</text>
            <view>
              地址：天津市滨海新区塘沽区全境开发区第三大街与太湖路交口悦蓝轩，0-0-101
            </view>
          </view>
        </view>
      </view>
      <view class="buy-list">
        <view class="row">
          <view class="goods-info">
            <text class="shopName">
              <text style="margin-right: 10upx; color: #e1251b">JD</text>
              {{ orderInfo.brandName }}京东自营官方旗舰店
            </text>
            <uni-icons type="arrowright" color="#555"></uni-icons>
            <view class="container" @click="toGoods(orderInfo.skuId)">
              <view class="img">
                <image :src="orderInfo.imgUrl"></image>
              </view>
              <view class="info">
                <view class="title">{{ orderInfo.skuName }} </view>
                <view class="spec">选择 128G 数量:{{ orderInfo.skuNum }}</view>
                <view class="price-number">
                  <view class="price"
                    >￥{{ orderInfo.skuPrice * orderInfo.skuNum }}</view
                  >
                </view>
                <view class="btns">
                  <view>申请售后</view>
                  <view>加购物车</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="card orderInfo">
        <view class="box">
          <view>
            订单编号：<text class="detailinfo">{{ orderInfo.orderId }}</text>
            <text class="copy">复制</text></view
          >
          <view>
            下单时间：<text class="detailinfo">{{ orderInfo.createTime }}</text>
          </view>
        </view>
        <view class="box">
          <view> 支付方式：<text class="detailinfo">微信支付</text> </view>
          <view>
            支付时间：<text class="detailinfo">{{ orderInfo.createTime }}</text>
          </view>
        </view>
        <view class="box">
          <view> 配送方式：<text class="detailinfo">京东配送</text> </view>
          <view>
            期望配送日期：<text class="detailinfo">{{
              orderInfo.arriveTime
            }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showClose: true,
      orderInfo: {},
      // orderList: [{ name: 123 }, { name: 123 }, { name: 123 }],
    };
  },
  methods: {
    closeNoticeBar() {
      this.showClose = false;
    },
    toGoods(id) {
      uni.navigateTo({
        url: "/pages/goods/goods?skuId=" + id,
      });
    },
  },
  onLoad(option) {
    this.orderInfo = JSON.parse(option.orderInfo);
  },
};
</script>

<style lang="scss">
.header {
  width: 100%;
  height: 350upx;
  background-image: linear-gradient(to right, #fa3415 40%, #ff5913);
  padding-left: 10upx;
  .uni-noticebar {
    position: fixed;
    width: 707upx !important;
    height: 68upx;
    border-radius: 10upx;
    border-radius: 10upx;
    z-index: 9;
  }
  .close {
    position: fixed;
    width: 40upx;
    height: 68upx;
    background-color: #fffbe8;
    right: 10upx;
    border-radius: 10upx;
    top: 0;
    line-height: 68upx;
    z-index: 99;
  }
  .f1 {
    padding-top: 120upx;
    text-align: center;
    color: #fff;
    font-size: 40upx;
  }
  .f2 {
    margin: 20upx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24upx;
    color: #fff;
    .redPacket {
      color: #fb3b12;
      width: 130upx;
      height: 30upx;
      line-height: 30upx;
      background-color: #fff;
      border-radius: 6upx;
      margin: 10upx;
    }
    .get {
      margin-left: 10upx;
      line-height: 30upx;
      height: 30upx;
      width: 110upx;
      text-align: center;
      border-radius: 15upx;
      background-color: rgba($color: #fff, $alpha: 0.5);
    }
  }
}
.main {
  position: relative;
  top: -50upx;
  background-color: #ddd;
  border-radius: 25upx;
  .card {
    border-radius: 25upx;
    background-color: #fff;
    margin-bottom: 30upx;
    box-shadow: 0 12upx 15upx 0 rgba(255, 255, 255, 0.57);
    backdrop-filter: blur(4upx);
    -webkit-backdrop-filter: blur(4upx);
    border: 1upx solid rgba(255, 255, 255, 0.08);
    &.deliveryInfo {
      .title {
        padding: 30upx 20upx;
        display: flex;
        justify-content: space-between;
        color: #444;
        .info {
          padding: 0 10upx;
          font-size: 24upx;
          color: #333;
          text {
            font-size: 32upx;
          }
          view {
            margin: 30upx 0;
            text {
              color: blue;
              font-size: 24upx;
            }
          }
        }
      }
    }
  }
}
.buy-list {
  .row {
    border-radius: 25upx;
    background-color: #fff;
    margin-bottom: 30upx;
    box-shadow: 0 12upx 15upx 0 rgba(255, 255, 255, 0.57);
    backdrop-filter: blur(4upx);
    -webkit-backdrop-filter: blur(4upx);
    border: 1upx solid rgba(255, 255, 255, 0.08);
    padding: 30upx 20upx;
    .goods-info {
      width: 100%;
      .shopName {
        font-size: 28upx;
      }
      .container {
        margin-top: 30upx;
        display: flex;
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
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          .spec {
            font-size: 22upx;
            background-color: #f3f3f3;
            color: #a7a7a7;
            height: 40upx;
            display: flex;
            align-items: center;
            padding: 0 10upx;
            border-radius: 20upx;
            margin-bottom: 20vw;
          }
          .price-number {
            position: absolute;
            width: 100%;
            top: 90upx;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 28upx;
            height: 40upx;
            .price {
              color: #f06c7a;
            }
            .number {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          .btns {
            position: absolute;
            width: 320upx;
            height: 40upx;
            font-size: 28upx;
            z-index: 999;
            right: 0;
            bottom: 5upx;
            display: flex;
            view {
              color: #666;
              line-height: 40upx;
              text-align: center;
              height: 40upx;
              width: 150upx;
              border-radius: 20upx;
              border: 1upx solid #999;
              margin: 0 10upx;
            }
          }
        }
      }
    }
  }
}
.orderInfo {
  padding: 30upx 30upx;
  font-size: 24upx;
  .box {
    border-bottom: 1upx solid #eee;
    view {
      margin: 20upx 0;
      .detailinfo {
        margin: 0 20upx;
        font-weight: bold;
      }
    }
    .copy {
      margin-left: -30upx;
      font-size: 24upx;
      display: inline-block;
      height: 30upx;
      line-height: 30upx;
      width: 70upx;
      border-radius: 15upx;
      background-color: #eee;
      text-align: center;
    }
  }
}
</style>