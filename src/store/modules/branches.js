import axios from "axios";

import { apiUrl } from "../../constants/config";

const state = () => ({
    branches: {}
});

const actions = {
    async fetchBranches({ commit }) {
        await axios.get(`${apiUrl}branches`).then(res => {
            let resultData = res.data.data;
            commit('SET_BRANCHES', resultData)
        }).catch(err => {
            console.log(err);
        })
    }
}

const getters = {
    getBranches: state => {
        return state.branches
    }
}

const mutations = {
    SET_BRANCHES(state, payload) {
        state.branches = payload
    }
}


export default {
    state,
    getters,
    mutations,
    actions
}