import request from "../../utils/request";
const state = {
  goodsList: [],
};
const actions = {
  // 首页搜索
  async getGoodsList({ commit }, info) {
    const res = await request("/goods/search_goods", info);
    if (res.code === 200) {
      commit("SET_GOODS_LIST", res.data.goodsList);
      return "ok";
    } else {
      return Promise.reject(new Error("搜索失败"));
    }
  },
  // 分类页点击
  async getCategoryGoodsList({ commit }, info) {
    const res = await request("/goods/category_goods", info);
    if (res.code === 200) {
      commit("SET_GOODS_LIST", res.data.goodsList);
      return "ok";
    } else {
      return Promise.reject(new Error("获取失败"));
    }
  },
};
const mutations = {
  SET_GOODS_LIST(state, list) {
    state.goodsList = state.goodsList.concat(list);
  },
  REMOVE_GOODS_LIST(state) {
    state.goodsList = [];
  },
};
const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
