export default function (url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    wx.request({
      url: "http://192.168.25.31:3000" + url,
      // url: "http://wendy.ngrok2.xiaomiqiu.cn" + url,
      data,
      method,
      header: {
        token: uni.getStorageSync("Token"),
      },
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err.message);
      },
    });
  });
}
