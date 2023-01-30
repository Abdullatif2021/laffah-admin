import Vue from "vue";

// BootstrapVue add
import BootstrapVue from "bootstrap-vue";
import contentmenu from "v-contextmenu";
import vueCrypt from "vue-crypt";
import VueI18n from "vue-i18n";
import VueLineClamp from "vue-line-clamp";
// Perfect Scrollbar Add
import vuePerfectScrollbar from "vue-perfect-scrollbar";
import VueScrollTo from "vue-scrollto";

import App from "./App";
// Breadcrumb Component Add
import Breadcrumb from "./components/Common/Breadcrumb";
// Colxx Component Add
import Colxx from "./components/Common/Colxx";
// Notification Component Add
import Notifications from "./components/Common/Notification";
// RefreshButton Component Add
import RefreshButton from "./components/Common/RefreshButton";
// Multi Language Add
import en from "./locales/en.json";
import es from "./locales/es.json";

// Router & Store add
import router from "./router";
import store from "./store";
import {getCurrentLanguage} from "./utils";
// vue multiSelect Add
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

Vue.mixin({
  methods: {
    nameFriendly(value) {
      let val = value.replaceAll("_", " ").replaceAll("-", " ")
      var s = `<span class="text-lowercase text-capitalize">${val}</span>`;
      return s
    }
  },
});

Vue.use(vueCrypt)
//var Vue = require('vue');
//var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
//Vue.use(VueCookie);
Vue.use(BootstrapVue);
Vue.use(VueI18n);
Vue.component('multiselect', Multiselect)

const messages = {en: en, es: es};
const locale = getCurrentLanguage();
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages
});
Vue.use(Notifications);
Vue.use(require('vue-shortkey'));
Vue.use(contentmenu);
Vue.use(VueScrollTo);
Vue.use(VueLineClamp, {
  importCss: true
});

Vue.component('piaf-breadcrumb', Breadcrumb);
Vue.component('b-refresh-button', RefreshButton);
Vue.component('b-colxx', Colxx);
Vue.component('vue-perfect-scrollbar', vuePerfectScrollbar);

Vue.config.productionTip = false

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
