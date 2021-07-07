<template>
  <view>
    <view class="content">
      <view class="list">
        <view class="row">
          <view class="title">头像</view>
          <view class="right"
            ><view class="tis">
              <image :src="userInfo.avatarUrl" mode="widthFix"></image> </view
            ><view class="icon xiangyou"></view
          ></view>
        </view>
        <view class="row">
          <view class="title">昵称</view>
          <view class="right"
            ><view class="tis">{{ userInfo.username }}</view
            ><view class="icon xiangyou"></view
          ></view>
        </view>
        <view class="row">
          <view class="title">个性签名</view>
          <view class="right"
            ><view class="tis">{{ userInfo.signature }}</view
            ><view class="icon xiangyou"></view
          ></view>
        </view>
        <view class="row">
          <view class="title">收货地址</view>
          <view class="right"
            ><view class="tis"></view><view class="icon xiangyou"></view
          ></view>
        </view>
        <view class="row">
          <view class="title">账户安全</view>
          <view class="right"
            ><view class="tis"></view><view class="icon xiangyou"></view
          ></view>
        </view>
      </view>
      <view class="list">
        <view class="row">
          <view class="title">通知提醒</view>
          <view class="right"
            ><view class="tis"></view><view class="icon xiangyou"></view
          ></view>
        </view>
        <view class="row">
          <view class="title">支付设置</view>
          <view class="right"
            ><view class="tis"></view><view class="icon xiangyou"></view
          ></view>
        </view>
        <view class="row">
          <view class="title">通用</view>
          <view class="right"
            ><view class="tis"></view><view class="icon xiangyou"></view
          ></view>
        </view>
      </view>
      <view class="list">
        <view class="row">
          <view class="title">版本升级</view>
          <view class="right"
            ><view class="tis">v1.0.0</view><view class="icon xiangyou"></view
          ></view>
        </view>
        <view class="row">
          <view class="title">清除缓存</view>
          <view class="right"
            ><view class="tis"></view><view class="icon xiangyou"></view
          ></view>
        </view>
        <view class="row">
          <view class="title">问题反馈</view>
          <view class="right"
            ><view class="tis"></view><view class="icon xiangyou"></view
          ></view>
        </view>
        <view class="row setting-logout"
          ><button type="warn" @click="logout">退出登录</button></view
        >
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatarUrl: "/static/img/face.jpg",
        username: "西西",
        signature: "这个人很懒，什么都没有写",
      },
    };
  },
  methods: {
    showType(tbIndex) {
      this.tabbarIndex = tbIndex;
      this.list = this.orderList[tbIndex];
    },
    getInfo() {
      const userInfo = uni.getStorageSync("UserInfo");
      this.userInfo = {
        avatarUrl: userInfo.face,
        signature: userInfo.signature,
        username: userInfo.username,
      };
    },
    // 退出登录
    logout() {
      uni.removeStorageSync("Token");
      uni.removeStorageSync("UserInfo");
      uni.removeStorage({
        key: "Token",
        success: function (res) {
          uni.showToast({
            title: "退出成功",
            duration: 2000,
          });
          uni.reLaunch({
            url: "/pages/tabBar/user/user",
          });
        },
      });
    },
  },
  mounted() {
    this.getInfo();
  },
};
</script>

<style lang="scss">
page {
  background-color: #f3f3f3;
}

.icon {
  font-size: 30upx;
}
.content {
  padding-bottom: 20upx;
  .list {
    width: 96%;
    padding-left: 4%;
    background-color: #fff;
    margin-bottom: 20upx;
    .row {
      widows: 100%;
      min-height: 90upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 1upx #eee;
      &:last-child {
        border-bottom: none;
      }
      .title {
        font-size: 32upx;
        color: #333;
      }
      .right {
        display: flex;
        align-items: center;
        color: #999;
        .tis {
          font-size: 26upx;
          margin-right: 5upx;
          max-height: 120upx;
          image {
            width: 100upx;
            height: 100upx;
            border-radius: 100%;
            margin: 10upx 0;
          }
        }
        .icon {
          width: 40upx;
          color: #cecece;
        }
      }
    }
  }
}
.setting-logout {
  padding-right: 4%;
  button {
    font-size: 36upx;
    color: #fff;
    font-weight: bold;
    width: 100%;
  }
}
</style>
