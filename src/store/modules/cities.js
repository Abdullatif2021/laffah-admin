import axios from "axios";

import { apiUrl } from "../../constants/config";

const state = () => ({
    cities: {}
});

const actions = {
    async fetchCities({ commit }) {
        await axios.get(`${apiUrl}cities`).then(res => {
            let resultData = res.data.data;
            commit('SET_CITIES', resultData)
          return resultData
        }).catch(err => {
            console.log(err);
        })
    }
}

const getters = {
    getCities: state => {
        return state.cities
    }
}

const mutations = {
    SET_CITIES(state, payload) {
        state.cities = payload
    }
}


export default {
    state,
    getters,
    mutations,
    actions
}
