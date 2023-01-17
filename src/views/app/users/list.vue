<template>
 <div>
  <b-row>
   <b-colxx xxs="12">
    <b-row>
     <b-colxx
      xxs="12"
      xs="12"
      lg="12"
      class="mb-3">
      <b-card
       class="mb-4"
       no-body>
       <b-tabs
        card
        fade>
        <b-tab
         v-for="(i,index) in tabs"
         :key="'tab-' +index "
         :title="i.title"
         :title-item-class="tabWidth+ ' text-center font-weight-bold'"
         @click="changeTab(i.title)">
         <grid-body
          v-if="selected_tab_name == `${i.title}`"
          :fieldsNames="fields"
          :perPage="perPage"
          :search="search"
          :apiBase="`${apiBase}`"
          :type="i.role"
          :addRow="addRow"
          :title="title"
          :addNew="addNew"
          :addEdit="addEdit"
          :addDelete="addDelete"
          :addMeta="false"></grid-body>
         <!-- <template v-else>
          <div class="loading"></div>
         </template> -->
        </b-tab>
       </b-tabs>
      </b-card>
     </b-colxx>
    </b-row>
   </b-colxx>
  </b-row>
 </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import { mapActions, mapGetters } from 'vuex';
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../containers/Grid/GridBody";
import { decrypt } from '../../../utils';

export default {
 name: 'Users',
 components: {
  GridBody,
  vuetable: Vuetable,
  "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
  "grid-body": GridBody
 },
 data() {
  return {
   isLoad: false,
   apiBase: 'users',
   sort: "",
   page: 1,
   perPage: 3,
   search: "",
   from: 0,
   to: 0,
   total: 0,
   lastPage: 0,
   data: [],
   selectedItems: [],
   addRow: "users-form",
   title: this.$t('menu.users'),
   addNew: true,
   addEdit: true,
   addDelete: true,
   superAdmin: "?role=superadmin",
   admin: "?role=admin",
   casher: "?role=casher",
   delivery: "?role=delivery",
   branchAdmin: "?role=branchAdmin",
   user: "?role=user",
   tabWidth: null,
   //guest: "?role=guest",
   fields: [{
     name: "first_name",
     title: "First Name",
     titleClass: "",
     dataClass: "list-item-heading",
     width: "10%",
     callback: this.nameFriendly
    },
    {
     name: "last_name",
     title: "Last Name",
     titleClass: "",
     dataClass: "list-item-heading",
     width: "10%",
     callback: this.nameFriendly
    },
    {
     name: "phone_number",
     title: "Telephone",
     titleClass: "",
     dataClass: "list-item-heading",
     width: "10%",
     callback: this.phone
    },
    {
     name: "email",
     title: "Email",
     titleClass: "",
     dataClass: "list-item-heading",
     width: "10%",
     callback: this.email
    },

    {
     name: "__slot:actions",
     title: "",
     titleClass: "center aligned text-right",
     dataClass: "center aligned text-right",
     width: "10%"
    }
   ],
   selected_tab_name: this.$t('menu.superadmin')
  }

 },
 methods: {
  changeTab(val) {
   this.selected_tab_name = val
  },
  // ...mapActions(["fetchSuperAdmin"]),
  // ...mapActions(["fetchAdmin"]),
  // ...mapActions(["fetchBranchAdmin"]),
  // ...mapActions(["fetchCasher"]),
  // ...mapActions(["fetchUser"]),

 },
 computed: {
  ...mapGetters([
   "getSuperAdmin",
   "getBranchAdmin",
   "getAdmin",
   "getCasher",
   "getDelivery",
   "getUser",
   "getSuperAdminLoad",
   "getAdminLoad",
   "getBranchAdminLoad",
   "getCasherLoad",
   "getDeliveryLoad",
   "getUserLoad"
  ]),
  authorSuperadmin() {
   const userRole = decrypt(localStorage.getItem('userRole'))
   if (userRole == 1) {
    return true
   } else
    return false
  },
  authorAdmin() {
   const userRole = decrypt(localStorage.getItem('userRole'))
   if (userRole == 2) {
    return true
   } else
    return false
  },
  tabs() {
   let arr;
   if (this.authorSuperadmin) {
    this.selected_tab_name = this.$t('menu.superadmin'),
     this.tabWidth = 'w-16'
    arr = [{
      title: this.$t('menu.superadmin'),
      dataMethod: this.superAdmin,
      data: this.getSuperAdmin,
      getLoad: this.getSuperAdminLoad,
      role: this.superAdmin
     },
     {
      title: this.$t('menu.admin'),
      dataMethod: this.admin,
      data: this.getAdmin,
      getLoad: this.getAdminLoad,
      role: this.admin
     },
     {
      title: this.$t('menu.branchadmin'),
      dataMethod: this.branchadmin,
      data: this.getBranchAdmin,
      getLoad: this.getBranchAdminLoad,
      role: this.branchAdmin
     },
     {
      title: this.$t('menu.casher'),
      dataMethod: this.casher,
      data: this.getCasher,
      getLoad: this.getCasherLoad,
      role: this.casher
     },
     {
      title: 'Delivery',
      dataMethod: this.delivery,
      data: this.getDelivery,
      getLoad: this.getDeliveryLoad,
      role: this.delivery
     },
     {
      title: this.$t('menu.user'),
      dataMethod: this.user,
      data: this.getUser,
      getLoad: this.getUserLoad,
      role: this.user
     },
    ]
   }
   if (this.authorAdmin) {
    this.selected_tab_name = this.$t('menu.user'),
     this.tabWidth = 'w-100'
    arr = [{
     title: this.$t('menu.user'),
     dataMethod: this.user,
     data: this.getUser,
     getLoad: this.getUserLoad,
     role: this.user
    }, ]
   }

   return arr
  }
 },
 async mounted() {
  //  await this.fetchSuperAdmin(this.apiBase + this.superAdmin);
  //  await this.fetchAdmin(this.apiBase + this.admin);
  //  await this.fetchCasher(this.apiBase + this.casher);
  //  await this.fetchUser(this.apiBase + this.user);
  //  this.isLoad = true
 }
};
</script>

<style lang="scss" scoped>
.w-20 {
 width: 20% !important
}
</style>
