import Axios from 'axios'
import { apiUrl } from '../../constants/config'

const state = {
    deliveries: [],
    assigned: null,
}

const getters = {
    _deliveries: state => state.deliveries,
    _assigned: state => state.assigned

}

const mutations = {
    deliveries(state, payload){
        state.deliveries = payload;
    },
    assigned(state, payload){
        state.assigned = payload;
    }
}

const actions = {
    getDeliveries({commit, dispatch}, payload){
        const branch_id = payload.branch_id;
            return Axios
              .get(`https://api2.laffahrestaurants.com/public/api/users?role=delivery&branch_id=${branch_id}&orderBy[]=created_at&orderBy[]=desc`)
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
    assignToDelivery({commit, dispatch}, payload){
        console.log('heree from store', payload)
        return Axios
              .post(`https://api2.laffahrestaurants.com/public/api/orders/assign-to-deliver`, {
                user_id: payload.user_id,
                order_id: payload.order_id,
              })
              .then(res =>{
                if (res.status === 201) {
                    console.log('this is the delivery guys', res.data.data)
                    commit('assigned', res.data.data)
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
