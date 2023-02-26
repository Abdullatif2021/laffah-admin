import Vue from "vue";

import Vuex from "vuex";

import app from "../main";
import { setCurrentLanguage } from "@/utils";
import branches from "./modules/branches";
import category from "./modules/category";
import chat from "./modules/chat";
import cities from "./modules/cities";
import form from "./modules/form";
import item from "./modules/item";
import menu from "./modules/menu";
import notification from "./modules/notification";
import orders from "./modules/orders";
import coupon from "./modules/coupon";
import roles from "./modules/roles";
import status from "./modules/status";
import survey from "./modules/survey";
import todo from "./modules/todo";
import user from "./modules/user";
import users from "./modules/users";
import delivery from "./modules/delivery";
import settings from "./modules/settings";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},

  mutations: {
    changeLang(state, payload) {
      app.$i18n.locale = payload;
      setCurrentLanguage(payload);
    },
  },
  actions: {
    setLang({ commit }, payload) {
      commit("changeLang", payload);
    },
  },

  modules: {
    category,
    form,
    item,
    menu,
    notification,
    user,
    chat,
    todo,
    survey,
    cities,
    status,
    branches,
    orders,
    coupon,
    roles,
    users,
    delivery,
    settings,
  },
});
