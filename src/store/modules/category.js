import {apiUrl, defaultLocale} from "../../constants/config";
import axios from "axios";
import Vue from '@/main.js'

const self = this
const namespaced = true
const modelUrl = 'categories'
const state = {
  title: modelUrl,
  categoriesList: [],
  categoriesTotal: null,
  categoryStatus: null,
  currentCategory: null,
  currentPage: 0,
  search: '',
  sort: {
    column: "id",
    label: "id"
  },
  page: 1,
  perPage: 4,
  from: 0,
  to: 1,
  lastPage: 0,
}

const getters = {
  getCategoriesList: (state) => state.categoriesList,
  selectData: (state) => Object.values(state.categoriesList)
    .map((o) => o.locales[Vue.$i18n.locale]),
  getSortColumn: (state) => {
    return state.sort.column
  },
  getItemLevelsCount: (state) => state.categoriesList.reduce(([p, c], e) => (e.parent_id === 0 ? [[...p, e], c] : [p, [...c, e]]), [[], []]),
  urlQuery: (state) => {
    return `?sort=${state.sort.column}&offset=${state.currentPage}&limit=${state.perPage}&search=${state.search}`
  },
  getCategoriesTotal: (state) => state.categoriesTotal,
  getCurrentCategory: (state) => state.currentCategory,
  getCategoryStatus: (state) => state.categoryStatus
}

const mutations = {
  SET_CategoryStatus(state, payload) {
    let {status} = payload;
    state.status = status
  },
  SET_CurrentCategory(state, payload) {
    state.currentCategory = payload
  },
  SET_CurrentPage(state, payload) {
    state.currentPage = payload
  },
  SET_CategoriesList(state, payload) {
    state.categoriesList = payload
  },
  SET_CategoriesTotal(state, payload) {
    state.categoriesTotal = payload
  },
  SET_DisplayMode(state, payload) {
    state.displayMode = payload
  },
  SET_Page(state, payload) {
    state.page = payload
  },
  SET_PerPage(state, payload) {
    state.perPage = payload
  },
  SET_From(state, payload) {
    state.from = payload
  },
  SET_To(state, payload) {
    state.to = payload
  },
  SET_LastPage(state, payload) {
    state.lastPage = payload
  },
  SET_Sort(state, payload) {
    state.sort = payload
  }
}

const actions = {
  loadCategoriesList({commit}) {
    return axios
      .get(apiUrl + modelUrl)
      .then(response => response.data)
      .then(({data, total}) => {
        commit('SET_CategoriesList', data)
        commit('SET_CategoriesTotal', total)
      })
  },
  loadCategoriesListPagination({commit, getters}) {
    return axios
      .get(apiUrl + modelUrl + getters.urlQuery)
      .then(response => response.data)
      .then(({data, total, current_page, from, last_page, page, per_page, to}) => {
        commit('SET_CategoriesList', data)
        commit('SET_CategoriesTotal', total)
        commit('SET_DisplayMode', 'list')
        commit('SET_Page', parseInt(page) + 1)
        commit('SET_PerPage', per_page)
        commit('SET_From', from)
        commit('SET_To', to)
        commit('SET_LastPage', last_page)
        commit('SET_CurrentPage', current_page)
      })
  },
  deleteCategory({commit}, payload) {
    //todo:notification for deletion
    return axios
      .delete(apiUrl + modelUrl + '/' + payload)
      .then(response => {
        console.log(response),
          this.loadCategoriesList
      })
      .catch(error => console.log(error))
  },
  getCategory({commit}, payload) {
    return axios
      .get(apiUrl + modelUrl + '/' + payload)
      .then(response => {
        this.loadCategoriesList
        return response.data
      })
      .catch(error => console.log(error))
  }
}

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
