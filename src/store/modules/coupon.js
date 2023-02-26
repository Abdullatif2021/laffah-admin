import Axios from "axios";
import { apiUrl } from "../../constants/config";

const state = {
  coupons: null,
  users: null,
  createCoupon: null,
};

const getters = {
  coupons: (state) => state.coupons,
  _users: (state) => state.users,
  _createCoupon: (state) => state.createCoupon,
};

const mutations = {
  all_coupons(state, payload) {
    console.log("and herre i am", payload);
    state.coupons = payload;
    console.log("and herre i am", state.coupons);
  },
  user_list(state, payload) {
    state.users = payload;
  },
  createCouponSuccessfuly(state, payload) {
    state.createCoupon = payload;
  },
};

const actions = {
  getCoupons({ commit, dispatch }, payload) {
    return Axios.get(
      `https://api-v2.laffahrestaurants.com/public/api/promocode`
    )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log("here i am");
          commit("all_coupons", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  createCoupon({ commit }, payload) {
    const formData = new FormData();
    Object.entries(payload).forEach((entry) => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });

    return Axios.post(
      `https://api-v2.laffahrestaurants.com/public/api/promocode`,
      formData,
      {}
    )
      .then((res) => {
        if (res.status === 201) {
          commit("createCouponSuccessfuly", res);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getUserList({ commit }, payload) {
    return Axios.get(
      `https://api-v2.laffahrestaurants.com/public/api/users?role=user&orderBy[]=created_at&orderBy[]=desc&offset=0&limit=25`
    )
      .then((res) => {
        if (res.status === 200) {
          commit("user_list", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
