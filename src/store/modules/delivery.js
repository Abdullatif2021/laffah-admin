import Axios from 'axios'
import { apiUrl } from '../../constants/config'

const state = {
    deliveries: [],
    assigned: null,
    change: null,
    all_delivery: null,
    delivery_paginations: null
}

const getters = {
    _deliveries: state => state.deliveries,
    _assigned: state => state.assigned,
    _change: state => state.change,
    _all_deliveries: state => state.all_delivery,
    _delivery_paginations: state => state. delivery_paginations,

}

const mutations = {
    all_deliveries(state, payload){
      state.all_delivery = payload.data;
      state.delivery_paginations = payload;
    },
    deliveries(state, payload){
      state.deliveries = payload;
    },
    assigned(state, payload){
      state.assigned = payload;
    },
    change(state, payload){
      state.change = payload;
    }
}

const actions = {
    get_deliveries({commit, dispatch}, payload){
        return Axios
          .get(`https://api2.laffahrestaurants.com/api/users?role=delivery`)
          .then(res =>{
            if (res.status === 200) {
                commit('all_deliveries', res.data)
              }
            }
          )
          .catch(error => {
          console.log(error);
          });
    },
    getDeliveries({commit, dispatch}, payload){
        const branch_id = payload.branch_id;
            return Axios
              .get(`https://api2.laffahrestaurants.com/api/users?role=delivery&branch_id=${branch_id}&orderBy[]=created_at&orderBy[]=desc`)
              .then(res =>{
                if (res.status === 200) {
                    console.log('this is the delivery guys', res.data.data)
                    commit('deliveries', res.data.data)
                  }
                }
              )
              .catch(error => {
              console.log(error);
              });
          
    },
    getDeliveryData({commit, dispatch}, payload){
      return Axios
      .get(`https://api2.laffahrestaurants.com/api/users?role=delivery`)
      .then(res =>{
        if (res.status === 200) {
            commit('delivery', res.data.data)
          }
        }
      )
      .catch(error => {
      console.log(error);
      });
    },
    assignToDelivery({commit, dispatch}, payload){
        console.log('heree from store', payload)
        return Axios
              .post(`https://api2.laffahrestaurants.com/api/orders/assign-to-deliver`, {
                user_id: payload.user_id,
                order_id: payload.order_id,
              })
              .then(res =>{ y
                if (res.status === 201) {
                    console.log('this is the delivery guys', res.data.data)
                    commit('assigned', res.data.data)
                  }
                }
              )
              .catch(error => {
              console.log(error);
              });
          
    },
    changeDelivery({commit, dispatch}, payload){
      const order_id = payload.order_id;
      return Axios
            .post(`https://api2.laffahrestaurants.com/api/orders/change-deliver/${order_id}`, {
              user_id: payload.user_id,
            })
            .then(res =>{ y
              if (res.status === 201) {
                  commit('change', res.data.data)
                }
              }
            )
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