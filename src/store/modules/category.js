import { apiUrl, defaultLocale } from "../../constants/config";
import axios from "axios";
import Vue from "@/main.js";

const self = this;
const namespaced = true;
const modelUrl = "categories";
const state = {
  title: modelUrl,
  categoriesList: [],
  categoriesTotal: null,
  categoryStatus: null,
  successCreateSubCategory: null,
  successUpdateSubCategory: null,
  successDeleteSubCategory: null,
  SubCategoryTotal: null,
  SubCategory: null,
  currentCategory: null,
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
  getCategoriesList: (state) => state.categoriesList,
  selectData: (state) =>
    Object.values(state.categoriesList).map((o) => o.locales[Vue.$i18n.locale]),
  getSortColumn: (state) => {
    return state.sort.column;
  },

  getItemLevelsCount: (state) =>
    state.categoriesList.reduce(
      ([p, c], e) => (e.parent_id === 0 ? [[...p, e], c] : [p, [...c, e]]),
      [[], []]
    ),
  urlQuery: (state) => {
    return `?parent_id=0&sort=${state.sort.column}&offset=${state.currentPage}&limit=${state.perPage}&search=${state.search}`;
  },
  getCategoriesTotal: (state) => state.categoriesTotal,
  getCurrentCategory: (state) => state.currentCategory,
  getCategoryStatus: (state) => state.categoryStatus,
  successDeleteSubCategory: (state) => state.successDeleteSubCategory,
  successCreateSubCategory: (state) => state.successCreateSubCategory,
  successUpdateSubCategory: (state) => state.successUpdateSubCategory,
  SubCategory: (state) => state.SubCategory,
};

const mutations = {
  SET_CategoryStatus(state, payload) {
    let { status } = payload;
    state.status = status;
  },
  SET_CurrentCategory(state, payload) {
    state.currentCategory = payload;
  },
  SET_CurrentPage(state, payload) {
    state.currentPage = payload;
  },
  SET_CategoriesList(state, payload) {
    state.categoriesList = payload;
  },
  SET_CategoriesTotal(state, payload) {
    state.categoriesTotal = payload;
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
  deleteSubCategory(state, payload) {
    state.successDeleteSubCategory = payload;
  },
  createSubCategory(state, payload) {
    state.successCreateSubCategory = payload;
  },
  updateSubCategory(state, payload) {
    state.successUpdateSubCategory = payload;
  },
  get_SubCategory(state, payload) {
    state.SubCategory = payload;
  },
  getSubCategoryTotal(state, payload) {
    state.SubCategoryTotal = payload;
  },
};

const actions = {
  loadCategoriesList({ commit }) {
    return axios
      .get(apiUrl + modelUrl + `?parent_id = 0`)
      .then((response) => response.data)
      .then(({ data, total }) => {
        commit("SET_CategoriesList", data);
        commit("SET_CategoriesTotal", total);
      });
  },
  loadCategoriesListPagination({ commit, getters }) {
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
          commit("SET_CategoriesList", data);
          commit("SET_CategoriesTotal", total);
          commit("SET_DisplayMode", "list");
          commit("SET_Page", parseInt(page) + 1);
          commit("SET_PerPage", per_page);
          commit("SET_From", from);
          commit("SET_To", to);
          commit("SET_LastPage", last_page);
          commit("SET_CurrentPage", current_page);
        }
      );
  },
  deleteCategory({ commit }, payload) {
    //todo:notification for deletion
    return axios
      .delete(apiUrl + modelUrl + "/" + payload)
      .then((response) => {
        console.log(response), this.loadCategoriesList;
      })
      .catch((error) => console.log(error));
  },
  getCategory({ commit }, payload) {
    return axios
      .get(apiUrl + modelUrl + "/" + payload)
      .then((response) => {
        this.loadCategoriesList;
        return response.data;
      })
      .catch((error) => console.log(error));
  },
  getSubCategory({ commit, dispatch }, payload) {
    return axios
      .get(
        `https://api-v2.laffahrestaurants.com/public/api/categories?parent_id=${payload.id}`
      )
      .then((response) => response.data)
      .then(({ data, total }) => {
        console.log(
          `https://api-v2.laffahrestaurants.com/public/api/categories?parent_id=41`,
          data,
          total
        );
        commit("get_SubCategory", data);
        commit("getSubCategoryTotal", total);
      })
      .catch((res) => {
        console.log(res);
      });
  },
  createSubCategory({ commit, dispatch }, payload) {
    const formData = new FormData();
    const id = payload.id;
    formData.append(`parent_id`, payload.id);
    if (payload.image) {
      formData.append(`image`, payload.image);
    }

    Object.entries(payload.info).forEach((entry) => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    return axios
      .post(
        `https://api-v2.laffahrestaurants.com/public/api/categories`,
        formData,
        {}
      )
      .then((res) => {
        return res;
      })
      .then((res) => {
        commit("createSubCategory", res.data.data);
        // dispatch("getSubCategories", { id });
      });
  },
  updateSubCategory({ commit, dispatch }, payload) {
    const formData = new FormData();
    const sub_id = payload.sub_id;
    const id = payload.id;

    formData.append("_method", "PUT");
    formData.append(`parent_id`, payload.id);
    if (payload.image) {
      formData.append(`image`, payload.image);
    }

    Object.entries(payload.info).forEach((entry) => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    return axios
      .post(
        `https://api-v2.laffahrestaurants.com/public/api/categories/${sub_id}`,
        formData,
        {}
      )
      .then((res) => {
        return res;
      })
      .then((res) => {
        commit("updateSubCategory", res.data.data);
        // dispatch("getSubCategories", { id });
      })
      .catch((res) => {
        commit("error");
      });
  },
  deleteSubCategory({ commit, dispatch }, payload) {
    const id = payload.categoryId;
    const sub_id = payload.sub_id;
    return axios
      .delete(
        `https://api-v2.laffahrestaurants.com/public/api/categories/${sub_id}`
      )
      .then((res) => {
        if (res.status === 200) {
          commit("deleteSubCategory", res.data);
        }
      })
      .catch((err) => {});
  },
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions,
};
