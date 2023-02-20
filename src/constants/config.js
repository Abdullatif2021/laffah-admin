import axios from "axios";

export const website = "https://laffahrestaurants.com/";
export const defaultMenuType = "menu-default"; // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const adminRoot = "/app";
export const searchPath = `${adminRoot}/pages/miscellaneous/search`;
export const keyCrypt = "laffah";
//
//export let accessToken = decrypt(localStorage.getItem("accessToken"))
//export const byuUrl = 'https://1.envato.market/nEyZa'
//export const apiUrl = 'https://api.coloredstrategies.com';
// export const apiUrl = 'https://lilacmarketingevents.com/laffah/public/api/';
export const apiUrl = "https://api-v2.laffahrestaurants.com/public/api/";
//export const apiUrl = 'http://localhost:8000/api/';
axios.defaults.baseURL = apiUrl;
//axios.defaults.headers.common['Authorization'] = decrypt(localStorage.getItem("accessToken"))

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;

export const defaultLocale = "en";
export const defaultDirection = "ltr";
export const localeOptions = [
  { id: "en", name: "English LTR", direction: "ltr" },
  { id: "es", name: "Español", direction: "ltr" },
  { id: "enrtl", name: "English RTL", drection: "rtl" },
];

export const firebaseConfig = {
  apiKey: "AIzaSyDe94G7L-3soXVSpVbsYlB5DfYH2L91aTU",
  authDomain: "piaf-vue-login.firebaseapp.com",
  databaseURL: "https://piaf-vue-login.firebaseio.com",
  projectId: "piaf-vue-login",
  storageBucket: "piaf-vue-login.appspot.com",
  messagingSenderId: "557576321564",
  appId: "1:557576321564:web:bc2ce73477aff5c2197dd9",
};

// export const currentUser = {
//         id: null,
//         title: '',
//         // img: '/assets/img/profiles/l-1.jpg',
//         date: '',
//         role: null
//     }//
//this.$cookie.set('isAuthGuardActive', false, 1);

//export const isAuthGuardActive = null
// localStorage.setItem('isAuthGuardActive', false)
// localStorage.setItem('accessToken', null)

export const themeRadiusStorageKey = "theme_radius";
export const themeSelectedColorStorageKey = "theme_selected_color";
export const defaultColor = "light.blueolympic";
export const colors = [
  "bluenavy",
  "blueyale",
  "blueolympic",
  "greenmoss",
  "greenlime",
  "purplemonster",
  "orangecarrot",
  "redruby",
  "yellowgranola",
  "greysteel",
];
