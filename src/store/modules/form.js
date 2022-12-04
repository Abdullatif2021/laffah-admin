import axios from "axios";

import {apiUrl} from "../../constants/config";
import Axios from "axios";

const state = {
  formType: null,
  form_Data: null,
  status: null,
  isLoad: null,
  create_item: null,
  groups: null,
  create_Batch: null,
  batches: null,
  load_batches: false,
  deleteBatch: null,
  updateBatch: null,
}

const getters = {
  getFormType: (state) => state.formType,
  getFormData: (state) => state.form_Data,
  getStatus: (state) => state.status,
  getGroups: (state) => state.groups,
  create_item: state => state.create_item,
  create_Batch: state => state.create_Batch,
  _updateBatch: state => state.updateBatch, 
  _deleteBatch: state => state.deleteBatch,
  _batches: state => state.batches,
  load_batches: state => state.load_batches
}

const mutations = {
  SET_Status(state, payload) {
    let {status} = payload;
    state.status = status
  },
  crateItemSuccess(state, payload){
    state.create_item = payload;
  },
  updateBatchSuccess(state, payload){
    state.updateBatch = payload;
  },
  crateBatchSuccess(state, payload){
    state.create_Batch = payload;
  },
  is_load_batches(state, payload){
    state.load_batches = payload;
  },
  SET_FormData(state, payload) {
    let {item} = payload
    state.form_Data = item
  },
  getBatchSuccess(state, payload){
    state.batches = payload;
  },
  deleteBatchSuccess(state, payload){
    state.deleteBatch = payload;
  },
  SET_FromType(state, payload) {
  },
  get_customizationGroups(state, payload) {
    state.groups = payload
  }
}

const actions = {
  loadItems({commit}, payload) {
    commit('SET_Items', items)
  },
  async handleSubmit({commit, dispatch}, payload) {
    let {url, obj, options} = payload
    //console.log(url,obj,'obj');
    options = (obj instanceof FormData) ? {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    } : (options || {})
    return await /*new Promise((resolve, reject) => {*/
      axios
        .post(apiUrl + url, obj, options)
        .then((response) => {
          //    dispatch('item/changeIsLoad', true)
          switch (response.status) {
            case 201:
              if (url.includes('items/batches')) {
                dispatch('item/getItemBatches', url.split('/')[2])
              }
              this._vm.$notify("success", `${response.statusText} Successfully`, null, {
                duration: 5000,
                permanent: false
              });
              break
            case 200:
              // this._vm.$notify("success", `${this._vm.$t('response.edited-successfully')}`, null, {
              this._vm.$notify("success", `Edited Successfully`, null, {
                duration: 5000,
                permanent: false
              });
              break
            default:
              this._vm.$notify("success", `Edited Successfully`, null, {
                duration: 5000,
                permanent: false
              });
          }
          // request succeeded
          // resolve(response) // return response data to calling function
          return response
        })
        .catch(error => {
          let {response} = error
          if (response && response.status === 422) {
            if (response.data.data instanceof Object) {
              Object.keys(response.data.data).map(key => {
                response.data.data[key].map(val => {
                  this._vm.$notify("error", response.data.message, `${key} - ${val}`, {
                    duration: 5000,
                    permanent: false
                  });
                })
              })
            } else {
              this._vm.$notify("error", response.data.message, response.data.data, {
                duration: 5000,
                permanent: false
              });
            }

          }
          // request failed
          // reject(error) // return error to calling function
          return error
        })
    /*})*/
  },
  createItem({commit, dispatch}, payload) {
      const formData = new FormData();
      console.log(payload);
      Object.entries(payload.langs).forEach(([key, value]) => {
        if (value){
          const lang = key.toString().split("_")[0];
          const type = key.toString().split("_")[1];
          formData.append(`${lang}[${type}]`, value);
        }
      });
      formData.append(`type`, 1);
      formData.append(`image`, payload.image);
      formData.append(`is_published`, payload.additional.published ? 1 : 0);
      formData.append(`active`, payload.additional.active ? 1 : 0);
      formData.append(`notes`, payload.additional.notes);
      formData.append(`itemCategory[category_id]`, payload.additional.category);
      formData.append(`record_order`, payload.additional.record_order);
      const customization_groups = payload.customization_groups
      formData.append(`customization_groups`, JSON.stringify({customization_groups}));
      axios
      .post(`https://foodapi.lilacdev.com/public/api/items`, formData)
      .then(res => {
        if (res.status === 201) {
         commit('crateItemSuccess', res.data.data)     
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
  getBatches({commit, dispatch}, payload){
    const item_id = payload.item_id;
    commit('is_load_batches', false)
    axios
    .get(`https://foodapi.lilacdev.com/public/api/items/batches/${item_id}`)
    .then(res => {
      if (res.status === 200) {
        commit('is_load_batches', true)
        return res
      }
    })
    .then(res => {
      if (res.status === 200) {
        commit('getBatchSuccess', res.data.data)     
      }
    })
    .catch(error => {
      console.log(error);
    });
  },
  createBatch({commit, dispatch}, payload){
    const formData = new FormData();
    const item_id = payload.item_id;
    console.log(payload);
    const attributes = payload.attributes
    formData.append(`attributes`, JSON.stringify({attributes}));
    const prices = payload.prices
    formData.append(`prices`, JSON.stringify({prices}));
    formData.append(`batch`, payload.batch);
    axios
    .post(`https://foodapi.lilacdev.com/public/api/items/batches/${item_id}`, formData)
    .then(res => {
      if (res.status === 201) {
        commit('crateBatchSuccess', res.data.data)     
      }
    })
    .catch(error => {
      console.log(error);
    });
  },
  updateBatch({commit, dispatch}, payload){
  const formData = new FormData();
  const item_id = payload.item_id;
  const batch_id = payload.batch_id;
  console.log(payload)
  const prices = payload.prices
  formData.append(`prices`, JSON.stringify({prices}));
  formData.append("_method", "PUT");
  axios
  .put(`https://foodapi.lilacdev.com/public/api/items/batches/${item_id}/${batch_id}`, formData)
  .then(res => {
    if (res.status === 200) {
      commit('updateBatchSuccess', res.data.data)     
    }
  })
  .catch(error => {
    console.log(error);
  });
  },
  updateBatch({commit, dispatch}, payload){
    const item_id = payload.item_id;
    const batch_id = payload.batch_id;
    axios
    .delete(`https://foodapi.lilacdev.com/public/api/items/batches/${item_id}/${batch_id}`)
    .then(res => {
      if (res.status === 200) {
        commit('deleteBatchSuccess', res.data.data)     
      }
    })
    .catch(error => {
      console.log(error);
    });
    },
  getCustomizationGroups() {
      axios
      .get(`https://foodapi.lilacdev.com/public/api/customizations/groups`)
    .then(res => {
      if (res.status === 200) {
        commit("get_customizationGroups", res.data.data);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}