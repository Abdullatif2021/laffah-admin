import axios from "axios";
import {apiUrl} from "@/constants/config";

const namespaced = true;
const model = "orders";

const state = {
  orders: [],
  ordersByStatus: [],
  order: null,
  statuses: null,
  tabStatuses: null,
};

const getters = {
  getCurrentOrder: (state) => {
    return state.order;
  },
  getOrders: (state) => state.orders,
  getOrdersByStatus: (state) => state.ordersByStatus,
  getOrdersByStatusForTabs(state) {
    let {ordersByStatus} = state;
    if (ordersByStatus !== null) {
      ordersByStatus[state.statuses[4]].concat(
        ordersByStatus[state.statuses[5]]
      );
      delete ordersByStatus[state.statuses[5]];
      ordersByStatus[state.statuses[7]].concat(
        ordersByStatus[state.statuses[8]]
      );
      delete ordersByStatus[state.statuses[8]];
      delete ordersByStatus[state.statuses[-1]];
    }
    return ordersByStatus;
  },
  getStatusesForTabs(state) {
    let {tabStatuses} = state;
    // if (tabStatuses !== null && typeof tabStatuses[1] === "object") {
    //   tabStatuses[4].urlParams += `&${tabStatuses[5].urlParams}`
    //   tabStatuses[4].count += tabStatuses[5].count
    //   delete tabStatuses[5];
    //   tabStatuses[7].urlParams += `&${tabStatuses[8].urlParams}`
    //   tabStatuses[7].count += tabStatuses[8].count
    //   delete tabStatuses[8];
    // }
    return tabStatuses;
  },
  getStatuses: (state) => {
    return state.statuses;
  },
};

const mutations = {
  SET_ORDER(state, payload) {
    state.order = payload;
  },
  SET_ORDERS(state, payload) {
    state.orders = payload;
  },
  SET_ORDERS_BY_STATUS(state, payload) {
    let {status, data} = payload;
    state.ordersByStatus.push({
      title: status,
      data: data,
      total: data.length,
    });
  },
  SET_STATUSES(state, payload) {
    state.statuses = payload;
  },
  SET_STATUSES_COUNT(state, payload) {
    state.tabStatuses = payload
  },
  RESET_ORDERS_BY_STATUS(state) {
    state.ordersByStatus = [];
  },
};

const actions = {
  async loadOrders({commit, state}) {
    let {statuses} = state;
    await axios
      .get(`${apiUrl}${model}`)
      .then((res) => {
        let resultData = res.data.data;
        commit("SET_ORDERS", resultData);
        commit("RESET_ORDERS_BY_STATUS");
        Object.keys(statuses).forEach((x) => {
          // console.log(x, typeof x);
          let d = resultData.filter((i) => {
            // console.log(i, i.status, typeof i.status, x);
            // return i.status === statuses[x];
            return parseInt(i.status) === parseInt(x);
          });
          commit("SET_ORDERS_BY_STATUS", {
            status: state.statuses[x],
            data: d,
          });
        });

        return resultData;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  },
  async loadOrdersByStatus({commit, getters}, params) {
    await axios
      .get(`${apiUrl}${model}?${params}`)
      .then((res) => {
        let resultData = res.data.data;
        commit("SET_ORDERS_BY_STATUS", resultData);
        return resultData;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  },
  async loadStatuses({commit, dispatch}) {
    await axios
      .get(`${apiUrl}${model}/getstatuses`)
      .then((res) => {
        let resultData = res.data.data;
        commit("SET_STATUSES", resultData);
        return resultData;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  },
  async loadStatusCount({commit}) {
    await axios
      .get(`${apiUrl}${model}/order-per-status`)
      .then((res) => {
        let resultData = res.data.data
        resultData = resultData.map(x => ({
          ...x,
          // urlParams: `status_id[]=${x.id}`
          urlParams: {status_id: [x.id]}
        }))
        commit("SET_STATUSES_COUNT", resultData);
        return resultData;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  },
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions,
};
