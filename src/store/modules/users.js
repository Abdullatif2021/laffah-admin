import axios from "axios";
import { apiUrl } from "../../constants/config";

const state = () => ({
    superAdmin: [],
    admin: [],
    branchAdmin: [],
    user: [],
    casher: [],
    // guest: [],
    loadSuperAdmin: false,
    loadAdmin: false,
    loadUser: false,
    loadBranchAdmin: false,
    loadCasher: false,
    loadGuest: false,
});

const actions = {
    async fetchSuperAdmin({ commit }, url) {
        commit('LOAD_SUPERADMIN', false)
        await axios.get(`${apiUrl}${url}`).then(res => {
            let resultData = res.data.data;
            commit('SET_SUPERADMIN', resultData),
                commit('LOAD_SUPERADMIN', true)
        }).catch(err => {
            console.log(err);
        })
    },
    async fetchAdmin({ commit }, url) {
        commit('LOAD_ADMIN', false)

        await axios.get(`${apiUrl}${url}`).then(res => {
            let resultData = res.data.data;
            commit('SET_ADMIN', resultData),
                commit('LOAD_ADMIN', true)

        }).catch(err => {
            console.log(err);
        })
    },
    async fetchBranchAdmin({ commit }, url) {
        commit('LOAD_BRANCHADMIN', false)

        await axios.get(`${apiUrl}${url}`).then(res => {
            let resultData = res.data.data;
            commit('SET_BRANCHADMIN', resultData),
                commit('LOAD_BRANCHADMIN', true)

        }).catch(err => {
            console.log(err);
        })
    },
    async fetchUser({ commit }, url) {
        commit('LOAD_USER', false)

        await axios.get(`${apiUrl}${url}`).then(res => {
            let resultData = res.data.data;
            commit('SET_USER', resultData),
                commit('LOAD_USER', true)

        }).catch(err => {
            console.log(err);
        })
    },
    async fetchCasher({ commit }, url) {
        commit('LOAD_CASHER', false)

        await axios.get(`${apiUrl}${url}`).then(res => {
            let resultData = res.data.data;
            commit('SET_CASHER', resultData),
                commit('LOAD_CASHER', true)

        }).catch(err => {
            console.log(err);
        })
    },
    // async fetchGuest({ commit }, url) {
    //     commit('LOAD_GUEST', false)

    //     await axios.get(`${apiUrl}${url}`).then(res => {
    //         let resultData = res.data.data;
    //         commit('SET_GUEST', resultData)
    //         commit('LOAD_GUEST', true)

    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }
}

const getters = {
    getSuperAdmin: state => {
        return state.superAdmin
    },
    getSuperAdminLoad: state => {
        return state.loadSuperAdmin
    },
    getAdmin: state => {
        return state.admin
    },
    getAdminLoad: state => {
        return state.loadAdmin
    },
    getBranchAdmin: state => {
        return state.branchAdmin
    },
    getBranchAdminLoad: state => {
        return state.loadBranchAdmin
    },
    getUser: state => {
        return state.user
    },
    getUserLoad: state => {
        return state.loadUser
    },
    getCasher: state => {
        return state.casher
    },
    getCasherLoad: state => {
        return state.loadCasher
    },
    // getGuest: state => {
    //     return state.guest
    // },
    // getGuestLoad: state => {
    //     return state.loadGuest
    // },

}

const mutations = {
    SET_SUPERADMIN(state, payload) {
        state.superAdmin = payload
    },
    LOAD_SUPERADMIN(state, payload) {
        state.loadSuperAdmin = payload
    },
    SET_ADMIN(state, payload) {
        state.admin = payload
    },
    LOAD_ADMIN(state, payload) {
        state.loadAdmin = payload
    },
    SET_BRANCHADMIN(state, payload) {
        state.branchAdmin = payload
    },
    LOAD_BRANCHADMIN(state, payload) {
        state.loadBranchAdmin = payload
    },
    SET_USER(state, payload) {
        state.user = payload
    },
    LOAD_USER(state, payload) {
        state.loadUser = payload
    },
    SET_CASHER(state, payload) {
        state.casher = payload
    },
    LOAD_CASHER(state, payload) {
        state.loadCasher = payload
    },
    // SET_GUEST(state, payload) {
    //     state.guest = payload
    // },
    // LOAD_GUEST(state, payload) {
    //     state.loadGuest = payload
    // },
}
export default {
    state,
    getters,
    mutations,
    actions
}
