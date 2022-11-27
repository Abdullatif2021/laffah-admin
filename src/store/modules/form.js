import axios from "axios";

import {apiUrl} from "../../constants/config";
import Axios from "axios";

const state = {
  formType: null,
  form_Data: null,
  status: null,
  isLoad: null,
  groups: null,
}

const getters = {
  getFormType: (state) => state.formType,
  getFormData: (state) => state.form_Data,
  getStatus: (state) => state.status,
  getGroups: (state) => state.groups
}

const mutations = {
  SET_Status(state, payload) {
    let {status} = payload;
    state.status = status
  },
  SET_FormData(state, payload) {
    let {item} = payload
    state.form_Data = item
  },
  SET_FromType(state, payload) {
  },
  getCustomizationGroups(state, payload) {
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
  createItem: async ({commit, dispatch}, payload) => {
      const formData = new FormData();
      console.log(payload);
      Object.entries(payload.langs).forEach(([key, value]) => {
        if (value){
          const lang = key.toString().split("_")[0];
          const type = key.toString().split("_")[1];
          formData.append(`${lang}[${type}]`, value);
        }
      });
      formData.append(`type`, 0);
      formData.append(`notes`, payload.additional.notes);
      formData.append(`itemCategory[category_id]`, payload.additional.category);
      formData.append(`record_order`, payload.additional.record_order);
       formData.append(`customization_groups`, payload.additional.customization_groups);
      console.log(formData);
      // payload.langs.forEach(el => {
      //   console.log(el);
      //   // formData.append(`${el._name}[title]`, el.title);
        // if (el.description) {
        //   formData.append(`${el._name}[description]`, el.description);
        //   if (el.brochure) {
        //     formData.append(`${el._name}[brochure]`, el.brochure);
        //   }
        //   if (el.terms_conditions) {
        //     formData.append(`${el._name}[terms_conditions]`, el.terms_conditions);
        //   }
        // }
      // });
      // Object.entries(payload.info).forEach(entry => {
      //   const [key, value] = entry;
      //   if (value != null) {
      //     formData.append(key, value);
      //   }
      // });
      // Object.entries(payload.location).forEach(entry => {
      //   const [key, value] = entry;
      //   if (value != null) {
      //     formData.append(key, value);
      //   }
      // });
      // Object.entries(payload.biding).forEach(entry => {
      //   const [key, value] = entry;
      //   if (value != null) {
      //     formData.append(key, value);
      //   }
      // });
      // if (payload.image != null) {
      //   formData.append("image", payload.image);
      // }
      // if(payload.parent_id){
      //   formData.append("parent_id", payload.parent_id);
      // }
  
      // commit("setProcessing", false);
      // const createAuction = create_auction(formData);
      // // axios
      // //   .post(`${apiUrl}/auctions`, formData, {})
      // createAuction.then(res => {
      //     if (res.status === 201) {
      //       commit("createAuctionSuccessfuly", res);
      //       dispatch("getCustomFieldList", { id: res.data.data.category_id });
      //     } else {
      //     }
      //   })
      //   .catch(error => {
      //     commit("dateError");
      //   });
    },
  getCustomizationGroups: async () => {
      axios
      .get(`https://foodapi.lilacdev.com/public/api/customizations/groups`)
    .then(res => {
      if (res.status === 200) {
        commit("getCustomizationGroups", res.data.data);
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
