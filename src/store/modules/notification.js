import Vue from "vue";

import axios from "axios";

import { apiUrl } from "@/constants/config";
import so_und from "@/assets/sounds/notif.mp3";

const namespaced = true;
const modelUrl = "notifications";
const state = {
  title: modelUrl,
  notificationsList: [],
  notificationsTotal: null,
  isSendNotif: null,
  notSendNotif: null,
  notificationStatus: null,
  currentNotification: null,
  currentPage: 0,
  search: "",
  sort: {
    column: "id",
    label: "id",
  },
  page: 1,
  perPage: 4,
  from: 0,
  to: 1,
  lastPage: 0,
};

const getters = {
  // getNotifications: (state) => state.notificationsList,
  getNotifications: (state) => {
    return Object.values(state.notificationsList).map((o) => o);
  },
  _notSendNotif: (state) => state.notSendNotif,
  _isSendNotif: (state) => state.isSendNotif,

  getSortColumn: (state) => {
    return state.sort.column;
  },
  urlQuery: (state) => {
    return `?sort=${state.sort.column}&offset=${state.currentPage}&limit=${state.perPage}&search=${state.search}`;
  },
  getNotificationsTotal: (state) => state.notificationsTotal,
  getCurrentNotification: (state) => state.currentNotification,
  getNotificationsStatus: (state) => state.notificationStatus,
};

const mutations = {
  SET_NotificationStatus(state, payload) {
    let { status } = payload;
    state.notificationStatus = status;
  },
  SET_CurrentNotification(state, payload) {
    state.currentNotification = payload;
  },
  SET_CurrentPage(state, payload) {
    state.currentPage = payload;
  },
  SET_NotificationsList(state, payload) {
    localStorage.setItem(
      "notesData",
      payload.map((i) => i.id)
    );
    state.notificationsList = payload;
  },
  SET_NotificationsTotal(state, payload) {
    state.notificationsTotal = payload;
  },
  SET_DisplayMode(state, payload) {
    state.displayMode = payload;
  },
  SET_Page(state, payload) {
    state.page = payload;
  },
  SET_PerPage(state, payload) {
    state.perPage = payload;
  },
  SET_From(state, payload) {
    state.from = payload;
  },
  SET_To(state, payload) {
    state.to = payload;
  },
  SET_LastPage(state, payload) {
    state.lastPage = payload;
  },
  SET_Sort(state, payload) {
    state.sort = payload;
  },
  send_notif_success(state, payload) {
    state.isSendNotif = payload;
  },
  send_notif_error(state, payload) {
    state.notSendNotif = payload;
  },
};

const actions = {
  loadNotificationsList({ commit, dispatch, state }) {
    return axios
      .get(
        apiUrl +
          modelUrl +
          "?order_by=created_at&order_dir=DESC&limit=20&offset=0"
      )
      .then((response) => response.data)
      .then(({ data, total_unread }) => {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted");
          }
        });

        if (Array.isArray(data) && data.length > 0) {
          let currList = [];
          if (localStorage.getItem("notesData") != undefined) {
            // console.log(localStorage.getItem('notesData'),'local')
            currList = localStorage.getItem("notesData");
          }
          let newList = data.map((n) => n.id);
          let diffArray = newList.filter((x) => !currList.includes(x));
          // console.log(currList,'currList')
          // console.log(diffArray.length,'diffArray')
          if (diffArray.length > 0) {
            console.log(diffArray.length, "diffArray");

            Vue.prototype.$notify("primary", "New notification Added", null, {
              duration: 5000,
              permanent: false,
            });
            const sound = new Audio(so_und);
            sound.play();
            if (Notification.permission === "granted") {
              new Notification("Laffah Admin", {
                body: "New Notification is added",
                icon: "/assets/logos/logo.png",
                badge: "/assets/logos/logo.png",
                silent: true,
              });
            }
          }
        }
        commit("SET_NotificationsList", data);
        commit("SET_NotificationsTotal", total_unread);
        setTimeout(() => {
          dispatch("loadNotificationsList");
        }, 60000);
        //console.log(data,'notes')
      })
      .catch((err) => {
        //console.log("not auth :" +JSON.stringify(err.response.status))
        if (err.response.status === 401) {
          window.location.href = "/user/login";
          localStorage.setItem("accessToken", "");
          localStorage.setItem("userRole", null);
          localStorage.setItem("user", null);
          setTimeout(() => {
            dispatch("loadNotificationsList");
          }, 60000);
        }
      });
  },
  getNotifications({ commit, dispatch }) {},
  loadNotificationsListPagination({ commit, getters }) {
    return axios
      .get(apiUrl + modelUrl + getters.urlQuery)
      .then((response) => response.data)
      .then(
        ({
          data,
          total,
          current_page,
          from,
          last_page,
          page,
          per_page,
          to,
        }) => {
          commit("SET_NotificationsList", data);
          commit("SET_NotificationsTotal", total);
          commit("SET_Page", parseInt(page) + 1);
          commit("SET_PerPage", per_page);
          commit("SET_From", from);
          commit("SET_To", to);
          commit("SET_LastPage", last_page);
          commit("SET_CurrentPage", current_page);
        }
      );
  },
  deleteNotification({ commit }, payload) {
    //todo:notification for deletion
    return axios
      .delete(apiUrl + modelUrl + "/" + payload)
      .then((response) => {
        //console.log(response),
        this.loadNotificationsList;
      })
      .catch((error) => console.log(error));
  },
  goToNotification({ commit }, payload) {
    return axios
      .get(apiUrl + modelUrl + "/" + payload)
      .then((response) => {
        this.loadNotificationsList;
        return response.data;
      })
      .catch((error) => console.log(error));
  },
  sendNotification({ commit }, payload) {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("body", payload.details);
    formData.append("image", payload.image[0]);

    return axios
      .post(
        "https://api-v2.laffahrestaurants.com/api/sendnotification",
        formData,
        {}
      )
      .then((res) => {
        if (res.data.status === 201) {
          commit("send_notif_success", res.data);
        } else {
          commit("send_notif_error", res.data);
        }
      })
      .catch((error) => {});
  },
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions,
};
