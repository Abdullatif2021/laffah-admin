import axios from "axios";

import { apiUrl } from "../../constants/config";

const state = () => ({
    status: {}
});

const actions = {
    async fetchStatuses({ commit }) {
        await axios.get(`${apiUrl}orders/getstatuses`).then(res => {
            let resultData = res.data.data;
            commit('SET_STATUS', resultData)
        }).catch(err => {
            console.log(err);
        })
    }
}

const getters = {
    getStatuses: state => {
        return state.status
    }
}

const mutations = {
    SET_STATUS(state, payload) {
        state.status = payload
    }
}


export default {
    state,
    getters,
    mutations,
    actions
}
