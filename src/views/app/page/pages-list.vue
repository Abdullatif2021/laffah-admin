<template>
 <div>
  <grid-body
   :fieldsNames="fields"
   :perPage="perPage"
   :search="search"
   :apiBase="apiBase"
   :addRow="addRow"
   :title="title"
   :addNew="addNew"
   :addEdit="addEdit"
   :add-meta="true"
   :addDelete="addDelete"></grid-body>
 </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../containers/Grid/GridBody";

export default {
 components: {
  GridBody,
  vuetable: Vuetable,
  "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
  "grid-body": GridBody
 },
 data() {
  return {
   isLoad: false,
   apiBase: 'pages',
   sort: "",
   page: 1,
   perPage: 12,
   search: "",
   from: 0,
   to: 0,
   total: 0,
   lastPage: 0,
   data: [],
   selectedItems: [],
   addRow: "pages-form",
   addDelete: false,
   title: this.$t('menu.pages'),
   addNew: false,
   addEdit: true,

   fields: [{
     name: "__slot:image",
     title: "",
     titleClass: "center aligned text-right",
     dataClass: "center aligned text-right",
     width: "1%"
    },
    {
     name: "locales.en.name",
     title: this.$t('en-name'),
     titleClass: "",
     dataClass: "list-item-heading",
     width: "10%",
     callback: this.nameFriendly
    },
    {
     name: "locales.ar.name",
     title: this.$t('ar-name'),
     titleClass: "",
     dataClass: "list-item-heading",
     width: "10%"
    },
    {
     name: "__slot:actions",
     title: "",
     titleClass: "center aligned text-right",
     dataClass: "center aligned text-right",
     width: "5%"
    }
   ]
  };
 },
 methods: {
  test() {
   this.$aes.setKey('myPassword')

   let encrypted = this.$aes.encrypt('Secret message')
   let decrypted = this.$aes.decrypt(encrypted)

   // Console print message "Secret message"
   console.log("encrypt : " + encrypted)
  }

 }
};
</script>
