<template>
 <nav class="navbar fixed-top">
  <div class="d-flex align-items-center navbar-left">
   <a href="#" class="menu-button d-none d-md-block" @click.prevent.stop="changeSideMenuStatus({step :menuClickCount+1,classNames:menuType,selectedMenuHasSubItems})">
    <menu-icon />
   </a>
   <a href="#" class="menu-button-mobile d-xs-block d-sm-block d-md-none" @click.prevent.stop="changeSideMenuForMobile(menuType)">
    <mobile-menu-icon />
   </a>

   <!-- <div class="position-relative d-none d-none d-lg-inline-block">
        <a
          class="btn btn-outline-primary btn-sm ml-2"
          target="_top"
          :href="buyUrl"
        >{{$t('user.buy')}}</a>
      </div> -->
  </div>
  <router-link
   class="navbar-logo"
   tag="a"
   :to="adminRoot">
   <span class="logo d-none d-xs-block"></span>
   <span class="logo-mobile d-block d-xs-none"></span>
  </router-link>

  <div class="navbar-right">

   <div class="header-icons d-inline-block align-middle">
    <!-- <div class="position-relative d-none d-sm-inline-block">
          <b-dropdown
            variant="empty"
            size="sm"
            right
            toggle-class="header-icon"
            menu-class="position-absolute mt-3 iconMenuDropdown"
            no-caret>
            <template v-if="isSuperAdmin" slot="button-content">
              <i class="simple-icon-grid" />
            </template>
            <div v-if="isSuperAdmin">
              <router-link
                tag="a"
                :to="`${adminRoot}/dashboards/default`"
                class="icon-menu-item">
                <i class="iconsminds-shop-4 d-block" />
                {{$t('menu.dashboards')}}
              </router-link>
              <router-link
                tag="a"
                :to="`${adminRoot}/ui`"
                class="icon-menu-item">
                <i class="iconsminds-pantone d-block" />
                {{$t('menu.ui')}}
              </router-link>
              <router-link
                tag="a"
                :to="`${adminRoot}/ui/components/charts`"
                class="icon-menu-item">
                <i class="iconsminds-bar-chart-4 d-block" />
                {{$t('menu.charts')}}
              </router-link>
              <router-link
                tag="a"
                :to="`${adminRoot}/applications/chat`"
                class="icon-menu-item">
                <i class="iconsminds-speach-bubble d-block" />
                {{$t('menu.chat')}}
              </router-link>
              <router-link
                tag="a"
                :to="`${adminRoot}/applications/survey`"
                class="icon-menu-item">
                <i class="iconsminds-formula d-block" />
                {{$t('menu.survey')}}
              </router-link>
              <router-link
                tag="a"
                :to="`${adminRoot}/applications/todo`"
                class="icon-menu-item">
                <i class="iconsminds-check d-block" />
                {{$t('menu.todo')}}
              </router-link>
            </div>
          </b-dropdown>
        </div> -->

    <div class="position-relative d-inline-block">
     <!-- <div class="d-inline-block">
      <b-dropdown
       id="langddm"
       class="ml-2"
       variant="light"
       size="sm"
       toggle-class="language-button">
       <template slot="button-content">
        <span class="name">{{$i18n.locale.toUpperCase()}}</span>
       </template>
       <b-dropdown-item
        v-for="(l,index) in localeOptions"
        :key="index"
        @click="changeLocale(l.id, l.direction)">{{l.name}}</b-dropdown-item>
      </b-dropdown>
     </div> -->
     <b-dropdown
      variant="empty"
      size="sm"
      right
      toggle-class="header-icon notificationButton"
      menu-class="position-absolute mt-0 p-1 notificationDropdown"
      no-caret>
      <template slot="button-content">
       <i class="simple-icon-bell" />
       <span class="count w-80">{{notificationsCount}}</span>
      </template>
      <div
       class="d-flex justify-content-between align-items-center mb-2"
       v-if="Array.isArray(notifications) && notifications.length >0">
       <h3 class="font-weight-bold color-theme-1 px-2 m-0">{{$t('menu.notifications')}} <i class="simple-icon-bell" />
       </h3>
       <router-link
        size="sm"
        tag="a"
        :to="`${adminRoot}/notifications/list`">
        <b-button
         class="px-2 py-0"
         size="xm"
         variant="primary"
         bill>
         <p class="font-weight-medium m-0 font-weight-bold">{{$t('forms.see-all')}}</p>
        </b-button>
       </router-link>
      </div>
      <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }">
       <div
        class="d-flex flex-row mb-2 p-1 border-bottom notes-container"
        v-for="(n,index) in notifications"
        :key="index"
        :class="{'background-color':n.read_at !=null}">
        <div
         class="px-1 w-100"
         @click="changeNotificationState(n)">
         <p
          class="mb-1 font-weight-bold"
          :class="{'color-theme-1':n.read_at !=null}">{{n.data.en}}</p>
         <p class="text-muted font-weight-bold mb-1">{{n.data.type}}</p>
         <p class="text-muted mb-0 text-small color-theme-2">{{n.created_at}}</p>
        </div>
       </div>
      </vue-perfect-scrollbar>
     </b-dropdown>
    </div>
    <div class="position-relative d-none d-sm-inline-block">
     <div class="btn-group">
      <b-button
       variant="empty"
       class="header-icon btn-sm"
       @click="toggleFullScreen">
       <i :class="{'d-inline-block':true,'simple-icon-size-actual':fullScreen,'simple-icon-size-fullscreen':!fullScreen }" />
      </b-button>
     </div>
    </div>
   </div>
   <div class="user d-inline-block">
    <b-dropdown
     class="dropdown-menu-right"
     right
     variant="empty"
     toggle-class="p-0"
     menu-class="mt-3"
     no-caret>
     <template slot="button-content">
      <span v-if="currentUser !== null" class="name mr-1 font-weight-bold color-theme-2">{{$t('hi')}} {{currentUser.title}}</span>
      <span>
       <!-- <img :alt="currentUser.title" :src="currentUser.img"/> -->
      </span>
     </template>
     <!-- <b-dropdown-item>Account</b-dropdown-item>
          <b-dropdown-item>Features</b-dropdown-item>
          <b-dropdown-item>History</b-dropdown-item>
          <b-dropdown-item>Support</b-dropdown-item> -->
     <!-- <b-dropdown-divider /> -->
     <b-dropdown-item @click="logout">{{$t('forms.sign-out')}}</b-dropdown-item>
    </b-dropdown>
   </div>
  </div>
 </nav>
</template>

<script>
import Switches from "vue-switches";
// import notifications from "../../data/notifications";

import { mapGetters, mapMutations, mapActions } from "vuex";
import { MenuIcon, MobileMenuIcon } from "../../components/Svg";
import {
 searchPath,
 menuHiddenBreakpoint,
 localeOptions,
 defaultLocale,
 adminRoot
} from "../../constants/config";
import { getDirection, setDirection, getThemeColor, setThemeColor } from "../../utils";
import axios from "axios";

export default {
 components: {
  "menu-icon": MenuIcon,
  "mobile-menu-icon": MobileMenuIcon,
  switches: Switches
 },
 data() {
  return {
   searchKeyword: "",
   isMobileSearch: false,
   isSearchOver: false,
   fullScreen: false,
   menuHiddenBreakpoint,
   searchPath,
   localeOptions,
   adminRoot,
   //buyUrl,
   // notifications,
   locale: defaultLocale,
   isDarkActive: false
  };
 },
 methods: {
  ...mapMutations(["changeSideMenuStatus", "changeSideMenuForMobile"]),
  ...mapActions(["setLang", "signOut"]),
  ...mapActions("notification", ["loadNotificationsList"]),
  search() {
   this.$router.push(`${this.searchPath}?search=${this.searchKeyword}`);
   this.searchKeyword = "";
  },

  changeLocale(locale, direction) {
   const currentDirection = getDirection().direction;
   if (direction !== currentDirection) {
    setDirection(direction);
   }

   this.setLang(locale);
  },
  logout() {
   this.signOut().then(() => {
    this.$router.push("/user/login");
   });
  },

  toggleFullScreen() {
   const isInFullScreen = this.isInFullScreen();

   var docElm = document.documentElement;
   if (!isInFullScreen) {
    if (docElm.requestFullscreen) {
     docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
     docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
     docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
     docElm.msRequestFullscreen();
    }
   } else {
    if (document.exitFullscreen) {
     document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
     document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
     document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
     document.msExitFullscreen();
    }
   }
   this.fullScreen = !isInFullScreen;
  },
  isInFullScreen() {
   return (
    (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement &&
     document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement &&
     document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null)
   );
  },
  async changeNotificationState(note) {
   const self = this
   if (note.data.type == 'order') {
    self.$router.push(`${adminRoot}/orders/details/${note.data.id}`)
   }
   // if (note.data.type == 'application') {
   // self.$router.push(`${adminRoot}/applicants/applicants-list/${note.data.id}`)
   // }
   if (note.data.type == 'user') {
    self.$router.push(`${adminRoot}/users/users-form/${note.data.id}`)
   }

   await axios
    .get(`notifications/${note.id}`)
    .then(response => {
     this.loadNotificationsList()
    }).catch(error => {
     console.log(error);
    })
  }
 },
 computed: {
  ...mapGetters({
   currentUser: "currentUser",
   menuType: "getMenuType",
   menuClickCount: "getMenuClickCount",
   selectedMenuHasSubItems: "getSelectedMenuHasSubItems",
  }),
  ...mapGetters('notification', {
   notifications: 'getNotifications',
   notificationsCount: 'getNotificationsTotal',
  }),
  isSuperAdmin() {
   if (localStorage.getItem('userRole') == 1) {
    return true
   } else return false
  }
 },
 beforeDestroy() {
  document.removeEventListener("click", this.handleDocumentforMobileSearch);
 },
 created() {
  const color = getThemeColor();
  this.isDarkActive = color.indexOf("dark") > -1;
  const self = this
  self.$store.dispatch('notification/loadNotificationsList')

  // console.log(this.$store.dispatch('notification/loadNotificationsList'),'ddddd')
 },
 watch: {
  "$i18n.locale"(to, from) {
   if (from !== to) {
    this.$router.go(this.$route.path);
   }
  },
  isDarkActive(val) {
   let color = getThemeColor();
   let isChange = false;
   if (val && color.indexOf("light") > -1) {
    isChange = true;
    color = color.replace("light", "dark");
   } else if (!val && color.indexOf("dark") > -1) {
    isChange = true;
    color = color.replace("dark", "light");
   }
   if (isChange) {
    setThemeColor(color);
    setTimeout(() => {
     window.location.reload();
    }, 60000);
   }
  },
  isMobileSearch(val) {
   if (val) {
    document.addEventListener("click", this.handleDocumentforMobileSearch);
   } else {
    document.removeEventListener(
     "click",
     this.handleDocumentforMobileSearch
    );
   }
  },

 },

};
</script>

<style scoped>
.notes-container {
 cursor: pointer;
}
</style>
