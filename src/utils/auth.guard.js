import axios from "axios";

import {apiUrl} from "@/constants/config";
import {
  decrypt,
  encrypt,
  getCurrentUser,
  setCurrentUser
} from "./";

export default (to, from, next) => {
  if (axios.defaults.headers.common['Authorization'] == null) {
    axios.defaults.headers.common['Authorization'] = access_token
  }
  let isAuth = localStorage.getItem('isAuthGuardActive')
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (isAuth == "true" || isAuth == null) {
      const user = getCurrentUser();
      if (localStorage.getItem('expireToken') !== null) {
        var expireToken = decrypt(localStorage.getItem('expireToken'))
      }
      if (new Date().getTime() >= expireToken) {
        let refresh_token = decrypt(localStorage.getItem("refreshToken"))
        // console.log("refresh_token : " + refresh_token)
        refreshToken(refresh_token);
      } else {
        // if (user && localStorage.getItem('changeApi') !== 'Unauthenticated') {
        if (user) {
          const roleArrayHierarchic = to.matched.filter(x => x.meta.roles).map(x => x.meta.roles);
          //console.log('role array : ' + roleArrayHierarchic.every(x => x.includes(user.role)))
          if (roleArrayHierarchic.every(x => x.includes(user.role))) {
            next();
          } else {
            next('/unauthorized')
          }
        } else {
          setCurrentUser(null);
          next('/user/login')
        }
      }
    } else {
      setCurrentUser(null);
          next('/user/login')
      //next();
    }
  } else {
    next()
  }
}
export const refreshToken = (refresh_token) => {
  var formData = new FormData();
  formData.append("refresh_token", refresh_token);

  axios
    .post(`${apiUrl}auth/refresh_token`, formData)
    .then(res => {
      // console.log("start refresh")
      // console.log("token in refresh : " + res.data.access_token)
      var accessToken = "Bearer " + res.data.access_token;
      encrypt(accessToken)
      //localStorage.removeItem("accessToken")
      // localStorage.setItem("accessToken", tokenCrypt)
      //console.log("token after refresh : " + accessToken + " length : " + accessToken.length)
      localStorage.setItem("refreshToken", encrypt(res.data.refresh_token))
      let expireToken = new Date().getTime() + res.data.expires_in * 1000;

      localStorage.setItem("expireToken", encrypt(expireToken.toString()))
      //console.log("res refresh token : " + res.data)
    })
}

export const access_token = localStorage.getItem("accessToken") !== null ?
  decrypt(localStorage.getItem("accessToken")) : null
