import {apiUrl} from "../../constants/config";
import axios from 'axios'
const state = () => ({
    status: {}
});

const actions = {
    async fetchStatus({ commit }) {
        await axios.get(`${apiUrl}orders/getstatuses`).then(res => {
                let resultData = res.data.data;
                commit('SET_STATUS', resultData)
            }).catch(err => {
                console.log(err);
            })
            // let resultData = [{
            //         id: 1,
            //         value: "Accepted"
            //     },
            //     {
            //         id: 2,
            //         value: "Rejected"
            //     },
            //     {
            //         id: 3,
            //         value: "On Delivery"
            //     },
            //     {
            //         id: 4,
            //         value: "Done"
            //     },
            //     {
            //         id: 5,
            //         value: "Canceled"
            //     },
            // ]
            //console.log("status: " + resultData)
            //  commit('SET_STATUS', resultData)


    }
}

const getters = {
    getStatus: state => {
        return state.status
    }
}

const mutations = {
    SET_STATUS(state, payload) {
        state.status = payload
        console.log("status: in mutation " + JSON.stringify(state.status))

    }
}


export default {
    state,
    getters,
    mutations,
    actions
}
