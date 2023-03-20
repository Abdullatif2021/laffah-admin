import Axios from "axios";
import { apiUrl } from "../../constants/config";

const state = {
  deliveries: [],
  assigned: null,
  change: null,
  all_delivery: null,
  delivery: null,
  delivery_paginations: null,
  deliveryOrders: null,
  updateDeliveryBranches: null,
  notAssigned: false,
  changeOrderStatus: null,
  changeOrderStatusErr: null,
  queueCount: null,
  updateDeliveryStatus: null,
  userPoints: null,
};

const getters = {
  _deliveries: (state) => state.deliveries,
  _assigned: (state) => state.assigned,
  not_assigned: (state) => state.notAssigned,
  _change: (state) => state.change,
  _all_deliveries: (state) => state.all_delivery,
  _delivery_paginations: (state) => state.delivery_paginations,
  _deliveryOrders: (state) => state.deliveryOrders,
  _delivery: (state) => state.delivery,
  _updateDeliveryBranches: (state) => state.updateDeliveryBranches,
  _changeOrderStatusErr: (state) => state.changeOrderStatusErr,
  _changeOrderStatus: (state) => state.changeOrderStatus,
  _queueCount: (state) => state.queueCount,
  _changeDeliveryStatus: (state) => state.updateDeliveryStatus,
  _userPoints: (state) => state.userPoints,
};

const mutations = {
  all_deliveries(state, payload) {
    state.all_delivery = payload.data;
    state.delivery_paginations = payload;
  },
  deliveries(state, payload) {
    state.deliveries = payload;
  },
  assigned(state, payload) {
    state.assigned = payload;
  },
  not_assign(state, payload) {
    state.notAssigned = payload;
  },
  change(state, payload) {
    state.change = payload;
  },
  delivery(state, payload) {
    state.delivery = payload;
  },
  deliveryOrders(state, payload) {
    state.deliveryOrders = payload;
  },
  updateDeliveryBranches(state, payload) {
    state.updateDeliveryBranches = payload;
  },
  updateDeliveryStatus(state, payload) {
    state.updateDeliveryStatus = payload;
  },
  changeOrderStatus(state, payload) {
    state.changeOrderStatus = payload;
  },
  changeOrderStatusErr(state, payload) {
    state.changeOrderStatusErr = payload;
  },
  changeQueueCount(state, payload) {
    state.queueCount = payload;
  },
  getUserPoints(state, payload) {
    state.userPoints = payload;
  },
};

const actions = {
  get_deliveries({ commit, dispatch }, payload) {
    return Axios.get(
      `https://api-v2.laffahrestaurants.com/public/api/users?role=delivery`,
      {
        params: {
          order_dir: payload.order_dir,
          keyword: payload.keyword,
          order_by: payload.order_by,
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          commit("all_deliveries", res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getDeliveries({ commit, dispatch }, payload) {
    const branch_id = payload.branch_id;
    return Axios.get(
      `https://api-v2.laffahrestaurants.com/public/api/users?role=delivery&branch_id=${branch_id}&orderBy[]=created_at&orderBy[]=desc`
    )
      .then((res) => {
        if (res.status === 200) {
          console.log("this is the delivery guys", res.data.data);
          commit("deliveries", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getDeliveryData({ commit, dispatch }, payload) {
    const user_id = payload.user_id;
    return Axios.get(
      `https://api-v2.laffahrestaurants.com/public/api/users/${user_id}`
    )
      .then((res) => {
        if (res.status === 200) {
          commit("delivery", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getDeliveryOrders({ commit, dispatch }, payload) {
    const user_id = payload.user_id;
    const status_id = payload.status_id;
    return Axios.get(
      `https://api-v2.laffahrestaurants.com/public/api/orders/delivery`,
      {
        params: {
          user_id,
          status_id,
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          commit("deliveryOrders", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  assignToDelivery({ commit, dispatch }, payload) {
    return Axios.post(
      `https://api-v2.laffahrestaurants.com/public/api/orders/assign-to-deliver`,
      {
        user_id: payload.user_id,
        order_id: payload.order_id,
      }
    )
      .then((res) => {
        if (res.status === 201) {
          console.log("this is the delivery guys", res.data.data);
          commit("assigned", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        commit("not_assign", error);
      });
  },
  changeDelivery({ commit, dispatch }, payload) {
    const order_id = payload.order_id;
    return Axios.post(
      `https://api-v2.laffahrestaurants.com/public/api/orders/change-deliver/${order_id}`,
      {
        user_id: payload.user_id,
      }
    )
      .then((res) => {
        if (res.status === 201) {
          commit("change", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  changeOrderStatus({ commit, dispatch }, payload) {
    const order_id = payload.order_id;
    return Axios.post(
      `https://api-v2.laffahrestaurants.com/public/api/orders/updatestatus/${order_id}?_method=put`,
      {
        status: payload.status,
      }
    )
      .then((res) => {
        if (res.status === 200) {
          commit("changeOrderStatus", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        commit("changeOrderStatusErr", error);
      });
  },
  updateDliveryState({ commit }, payload) {
    const formData = new FormData();
    formData.append("delivery_status", payload.status);
    formData.append("_method", "PUT");
    const user_id = payload.item_id;
    return Axios.post(
      `https://api-v2.laffahrestaurants.com/public/api/users/${user_id}`,
      formData
    )
      .then((res) => {
        if (res.status === 200) {
          commit("updateDeliveryStatus", res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getUserPoints({ commit }, payload) {
    const user_id = payload.user_id;
    return Axios.get(`https://api-v2.laffahrestaurants.com/public/api/points`, {
      params: {
        user_id,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          commit("getUserPoints", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        commit("changeOrderStatusErr", error);
      });
  },
  updateDeliveryBranches({ commit }, payload) {
    const formData = new FormData();
    payload.branches.forEach((el) => {
      formData.append("branches[]", el);
    });
    formData.append("_method", "PUT");
    const user_id = payload.user_id;
    return Axios.post(
      `https://api-v2.laffahrestaurants.com/public/api/users/${user_id}`,
      formData
    )
      .then((res) => {
        if (res.status === 200) {
          commit("updateDeliveryBranches", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  changeQueueCount({ commit }, payload) {
    console.log(payload);
    commit("changeQueueCount", payload.data);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
