import axios from "axios";

import { apiUrl } from "../../constants/config";

const state = () => ({
    roles: {}
});

const actions = {
    async fetchRoles({ commit }) {
        await axios.get(`${apiUrl}roles`).then(res => {
            let resultData = res.data.data;
            commit('SET_ROLES', resultData)
        }).catch(err => {
            console.log(err);
        })
    }
}

const getters = {
    getRoles: state => {
        return state.roles
    }
}

const mutations = {
    SET_ROLES(state, payload) {
        state.roles = payload
    }
}


export default {
    state,
    getters,
    mutations,
    actions
}