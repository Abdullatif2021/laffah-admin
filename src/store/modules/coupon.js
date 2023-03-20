import Axios from "axios";
import { apiUrl } from "../../constants/config";

const state = {
  coupons: null,
  coupon: null,
  users: null,
  createCoupon: null,
  updateCoupon: null,
  cannotupdate: null,
  categoies: null,
};

const getters = {
  coupons: (state) => state.coupons,
  _coupon: (state) => state.coupon,
  _users: (state) => state.users,
  _createCoupon: (state) => state.createCoupon,
  _updateCoupon: (state) => state.updateCoupon,
  _cannotupdate: (state) => state.cannotupdate,
  _categories: (state) => state.categoies,
};

const mutations = {
  all_coupons(state, payload) {
    console.log("and herre i am", payload);
    state.coupons = payload;
    console.log("and herre i am", state.coupons);
  },
  coupon(state, payload) {
    state.coupon = payload;
  },
  user_list(state, payload) {
    state.users = payload;
  },
  createCouponSuccessfuly(state, payload) {
    state.createCoupon = payload;
  },
  updateCouponSuccessfuly(state, payload) {
    state.updateCoupon = payload;
  },
  cannotUpdateCoupon(state, payload) {
    state.cannotupdate = payload;
  },
  get_categories(state, payload) {
    state.categoies = payload;
  },
};

const actions = {
  getCoupons({ commit, dispatch }, payload) {
    const params = {
      keyword: payload?.keyword,
    };
    return Axios.get(
      `https://api-v2.laffahrestaurants.com/public/api/promocode`,
      { params }
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
  getCategories({ commit }, payload) {
    return Axios.get(
      `https://api-v2.laffahrestaurants.com/public/api/categories`
    )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          commit("get_categories", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getCoupon({ commit, dispatch }, payload) {
    const id = payload.coupon_id;
    return Axios.get(
      `https://api-v2.laffahrestaurants.com/public/api/promocode/${id}`
    )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log("here i am");
          commit("coupon", res.data.data);
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
  updateCoupon({ commit }, payload) {
    const id = payload.coupon_id;
    const formData = new FormData();
    Object.entries(payload).forEach((entry) => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });

    return Axios.put(
      `https://api-v2.laffahrestaurants.com/public/api/promocode/${id}`,
      formData,
      {}
    )
      .then((res) => {
        console.log("you cannot update", res);
        if (res.data.status === 200) {
          commit("createCouponSuccessfuly", res);
        }
        if (res.data.status === 422) {
          commit("cannotUpdateCoupon", res);
          console.log("you cannot update");
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
