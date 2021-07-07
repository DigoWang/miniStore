const state = {
  redirect: "",
};
const actions = {
  saveRedirectPath({ commit }, path) {
    commit("SET_PATH", path);
  },
};
const mutations = {
  SET_PATH(state, path) {
    state.redirect = path;
  },
};
const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
