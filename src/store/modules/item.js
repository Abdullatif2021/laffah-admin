import { apiUrl, defaultLocale } from "@/constants/config";
import axios from "axios";

const namespaced = true;
const modelUrl = "items";
const state = {
  isLoad: false,
  title: modelUrl,
  itemsList: [],
  itemsTotal: null,
  itemStatus: false,
  currentItem: null,
  currentBatch: null,
  customization_groups: [],
  currentItemBatches: [],
  currentItemBatchBranches: [],
  currentItemRelated: [],
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
//
const getters = {
  getIsLoad: (state) => state.isLoad,
  getItemsList: (state) => state.itemsList,
  selectData: (state) => {
    return Object.values(state.itemsList).map(
      (o) => o.locales[this.$i18n.locale]
    );
  },
  getItem: (state) => state.currentItem,
  getItemBatchBranches: (state) => state.currentItemBatchBranches,
  relatedItems: (state) => {
    return state.currentItemRelated.map((item) => item.item_id);
  },
  getCurrentItemBatches: (state) => state.currentItemBatches,
  getSortColumn: (state) => {
    return state.sort.column;
  },
  urlQuery: (state) => {
    return `?sort=${state.sort.column}&offset=${state.currentPage}&limit=${state.perPage}&search=${state.search}`;
  },
  getItemsTotal: (state) => state.itemsTotal,
  getCurrentItem: (state) => state.currentItem,
  getItemStatus: (state) => state.itemStatus,
};

const mutations = {
  SET_ISLOAD(state, payload) {
    state.isLoad = payload;
  },
  SET_ItemStatus(state, payload) {
    state.itemStatus = payload;
  },
  SET_CurrentItem(state, payload) {
    state.currentItem = payload;
  },
  SET_CurrentItemType(state, payload) {
    state.currentItem.type = payload;
  },
  SET_CurrentBatch(state, payload) {
    state.currentBatch = payload;
  },
  SET_CustomizationGroups(state, payload) {
    state.customization_groups = payload;
  },
  SET_CurrentItemBatches(state, payload) {
    state.currentItemBatches = payload;
  },
  SET_CurrentItemRelated(state, payload) {
    state.currentItemRelated = payload;
  },
  SET_CurrentItemBatchBranches(state, payload) {
    state.currentItemBatchBranches = payload;
  },
  SET_CurrentPage(state, payload) {
    state.currentPage = payload;
  },
  SET_ItemsList(state, payload) {
    state.itemsList = payload;
  },
  SET_ItemsTotal(state, payload) {
    state.itemsTotal = payload;
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
};

const actions = {
  changeIsLoad({ commit }, value) {
    commit("SET_ISLOAD", value);
  },
  loadItemsList({ commit }) {
    return axios
      .get(apiUrl + modelUrl + `?orderBy[]=created_at&orderBy[]=desc`)
      .then((response) => response.data)
      .then(({ data, total }) => {
        commit("SET_ItemsList", data);
        commit("SET_ItemsTotal", total);
      });
  },
  initItem({ commit, dispatch, rootGetters }) {
    const item = {
      action: "create",
      type: 0,
      active: 0,
      is_published: 0,
      category: undefined,
      locales: {
        ar: {
          name: "",
        },
        en: {
          name: "",
        },
      },
      notes: "",
    };
    dispatch("fetchCities", null, { root: true }).then((res) => {
      let cities = rootGetters.getCities;
      if (Array.isArray(cities)) {
        item.prices = cities.map(({ id, locales }) => ({
          locales,
          active: 0,
          city_id: id,
          price: "",
        }));
      }
      commit("SET_CurrentItem", item);
    });
    commit("SET_ItemStatus", true);
  },
  loadItemsListPagination({ commit, getters }) {
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
          commit("SET_ItemsList", data);
          commit("SET_ItemsTotal", total);
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
  deleteItem({ commit }, payload) {
    //todo:notification for deletion
    return axios
      .delete(apiUrl + modelUrl + "/" + payload)
      .then((response) => {
        console.log(response), this.loadItemsList;
      })
      .catch((error) => console.log(error));
  },
  deleteBatch({ commit, dispatch, state }, payload) {
    let { item_id, id } = payload;
    //todo:notification for deletion
    return axios
      .delete(`${apiUrl}${modelUrl}/batches/${item_id}/${id}`)
      .then((response) => {
        console.log(response);
        dispatch("getItemBatches");
        this._vm.$notify("success", "Deleted Successfully", null, {
          duration: 5000,
          permanent: false,
        });
        return response;
      })
      .catch((error) => {
        this.$notify("danger", "Deleted Failed", "Try again later", {
          duration: 5000,
          permanent: false,
        });
        console.log(error);
        return error;
      });
  },
  getItem({ commit, dispatch, rootGetters }, payload) {
    console.log(
      apiUrl + modelUrl + "/" + payload,
      "apiUrl + modelUrl + '/' + payload"
    );
    return axios
      .get(apiUrl + modelUrl + "/" + payload)
      .then((response) => {
        let item = response.data.data;
        if (parseInt(item.type) === 1) {
          dispatch("getItemBatches", payload);
          dispatch("fetchCities", null, { root: true }).then((res) => {
            let cities = rootGetters.getCities;
            item.prices = cities.map(({ id, locales }) => ({
              locales,
              active: 0,
              city_id: id,
              price: "",
            }));
          });
        }
        if (parseInt(item.type) === 0) {
          if (item.itemBatchBranches.length > 0) {
            dispatch("fetchCities", null, { root: true }).then((res) => {
              let cities = rootGetters.getCities;
              console.log(cities, "cities");
              // item.prices = item.itemBatchBranches
              item.prices = item.itemBatchBranches.map((o) => ({
                ...o,
                ...cities.filter((c) => c.id == o.city_id)[0],
              }));
              // console.log(item.prices,'rerwew');
            });
          } else {
            dispatch("fetchCities", null, { root: true }).then((res) => {
              let cities = rootGetters.getCities;
              item.prices = cities.map(({ id, locales }) => ({
                locales,
                active: 0,
                city_id: id,
                price: "",
              }));
            });
          }
        }
        commit("SET_ItemStatus", false);
        commit("SET_CurrentItem", item);
        return response.data;
      })
      .catch((error) => console.log(error));
  },
  getItemBatches({ commit }, payload) {
    return axios
      .get(apiUrl + modelUrl + "/batches/" + payload)
      .then((response) => {
        console.log(response.data);
        commit("SET_CurrentItemBatches", response.data.data);
        return response.data;
      })
      .catch((error) => console.log(error));
  },
  async getItemRelated({ commit, state }) {
    if (state.currentItem && state.currentItem.id) {
      await axios
        .get(apiUrl + modelUrl + "/related/" + state.currentItem.id)
        .then((response) => {
          console.log(response.data);
          commit("SET_CurrentItemRelated", response.data.data);
          return response.data;
        })
        .catch((error) => console.log(error));
    }
  },
  async loadItemBatchBranches({ commit, state }) {
    if (state.currentItem && state.currentItem.id) {
      await axios
        .get(apiUrl + "item_batch_branches/" + state.currentItem.id)
        .then((response) => {
          console.log(response.data);
          commit("SET_CurrentItemBatchBranches", response.data.data);
          return response.data;
        })
        .catch((error) => console.log(error));
    }
  },
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions,
};
