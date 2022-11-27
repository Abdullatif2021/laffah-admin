import axios from "axios";

import { apiUrl, website } from "@/constants/config";

import {
    decrypt,
    encrypt,
    getCurrentUser,
    setCurrentUser
} from "../../utils";

export default {
    state: {
        currentUser: localStorage.getItem('isAuthGuardActive') ? getCurrentUser() : null,
        loginError: null,
        processing: false,
        forgotMailSuccess: null,
        resetPasswordSuccess: null,
        expireToken: null
    },
    getters: {
        currentUser: state => state.currentUser,
        processing: state => state.processing,
        loginError: state => state.loginError,
        forgotMailSuccess: state => state.forgotMailSuccess,
        resetPasswordSuccess: state => state.resetPasswordSuccess,
        expireToken: state => state.expireToken,
    },
    mutations: {
        setExpireToken(state, payload) {
            state.expireToken = payload
        },
        setUser(state, payload) {
            state.currentUser = payload
            state.processing = false
            state.loginError = null
        },
        setLogout(state) {
            state.currentUser = null
            state.processing = false
            state.loginError = null
        },
        setProcessing(state, payload) {
            state.processing = payload
            state.loginError = null
        },
        setError(state, payload) {
            state.loginError = payload
            state.currentUser = null
            state.processing = false
        },
        setForgotMailSuccess(state) {
            state.loginError = null
            state.currentUser = null
            state.processing = false
            state.forgotMailSuccess = true
        },
        setResetPasswordSuccess(state) {
            state.loginError = null
            state.currentUser = null
            state.processing = false
            state.resetPasswordSuccess = true
        },
        clearError(state) {
            state.loginError = null
        }
    },
    actions: {
        login({ commit }, payload) {
            commit('clearError')
            commit('setProcessing', true)
            axios
                .post(`${apiUrl}auth`, payload)
                .then(res => {

                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access_token;
                    let refreshTokenCrypt = encrypt(res.data.refresh_token);
                    let expireToken = new Date().getTime() + res.data.expires_in * 1000;
                    axios
                        .get(`${apiUrl}auth/user`, {
                            headers: {
                                'Authorization': axios.defaults.headers.common['Authorization']
                            }
                        })
                        .then(res => {
                            let userData = res.data.data
                            if (userData.role[0] == "guest" || userData.role[0] == "user") {
                                // let full = window.location.host
                                // let parts = full.split('.')
                                // let n = parts.length
                                // let sub = parts[0]
                                // let domain = parts[n - 2]
                                // let type = parts[n - 1]
                                // if (n > 1) {
                                //   window.location.href = domain + type;
                                // } else {
                                window.location.href = website;
                                // }

                            } else {
                                //   console.log('user info : ' + userData)
                                let role = null
                                switch (userData.role[0]) {
                                    case "superadmin":
                                        role = 1
                                        break;
                                    case "admin":
                                        role = 2
                                        break;
                                    case "user":
                                        role = 3
                                        break;
                                    case "guest":
                                        role = 5
                                        break;
                                    case "branchadmin":
                                        role = 4
                                        break;
                                    case "casher":
                                        role = 6
                                        break;
                                    default:
                                        break;
                                }

                                const item = {
                                        uid: userData.id,
                                        title: userData.first_name,
                                        role: role
                                    }
                                    // console.log('accessToken : ' + axios.defaults.headers.common['Authorization'])
                                let tokenCrypt = encrypt(axios.defaults.headers.common['Authorization'])
                                    //   console.log('token : ' + axios.defaults.headers.common['Authorization'])
                                    //  console.log('token length : ' + axios.defaults.headers.common['Authorization'].length)
                                let userRoleCrypt = encrypt(item.role.toString())
                                let expireTokenCrypt = encrypt(expireToken.toString())
                                localStorage.setItem('accessToken', tokenCrypt)
                                localStorage.setItem('isAuthGuardActive', true)
                                localStorage.setItem('userRole', userRoleCrypt)
                                localStorage.setItem('expireToken', expireTokenCrypt)
                                localStorage.setItem('refreshToken', refreshTokenCrypt)
                                    // localStorage.setItem('changeApi', null)

                                commit('setUser', item)
                                commit('setExpireToken', expireToken)
                                setCurrentUser(item)
                                let decToken = decrypt(localStorage.getItem("accessToken"))
                                    //  console.log('token decrypt : ' + decToken)
                            }


                        })
                        .catch(err => {
                            console.log(err)
                            setCurrentUser(null);
                            commit('setError', err.message)
                            setTimeout(() => {
                                commit('clearError')
                            }, 3000)

                        })
                })
                .catch(err => {
                    console.log(err)
                    setCurrentUser(null);
                    commit('setError', err.message)
                    setTimeout(() => {
                        commit('clearError')
                    }, 3000)

                });

        },

        forgotPassword({ commit }, payload) {
            commit('clearError')
            commit('setProcessing', true)
            axios
                .post(`${apiUrl}auth/password/forgot`, payload)
                .then(res => {
                    let forgetData = res.data
                    console.log('forget  : ' + forgetData)
                    commit('clearError')
                    commit('setForgotMailSuccess')

                })
                .catch(err => {
                    commit('setError', err.message)
                    setTimeout(() => {
                        commit('clearError')
                    }, 3000)

                })
        },
        resetPassword({ commit }, payload) {
            commit('clearError')
            commit('setProcessing', true)
            axios
                .post(`${apiUrl}auth/password/reset`, payload)
                .then(res => {
                    let resetData = res.data
                        //  console.log('forget  : ' + resetData)
                    commit('clearError')
                    commit('setResetPasswordSuccess')

                })
                .catch(err => {
                    commit('setError', err.message)
                    setTimeout(() => {
                        commit('clearError')
                    }, 3000)

                })

        },
        //

        signOut({ commit }) {
            axios
                .post(`${apiUrl}auth/logout`)
                .then(res => {
                    localStorage.removeItem('isAuthGuardActive');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('expireToken');
                    localStorage.removeItem('refreshToken');
                    setCurrentUser(null);
                })
                .catch(err => {
                    commit('setError', err.message)
                    setTimeout(() => {
                        commit('clearError')
                    }, 3000)

                })
            localStorage.removeItem('isAuthGuardActive');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('expireToken');
            localStorage.removeItem('refreshToken');
            setCurrentUser(null);
            commit('setLogout');
        },

    }
}