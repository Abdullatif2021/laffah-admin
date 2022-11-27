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
   :addMeta="false"></grid-body>
 </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../containers/Grid/GridBody";
import { getDirection, decrypt } from '../../../utils';
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
   apiBase: 'careers',
   sort: "",
   page: 1,
   perPage: 10,
   search: "",
   from: 0,
   to: 0,
   total: 0,
   lastPage: 0,
   data: [],
   selectedItems: [],
   addRow: "careers-form",
   title: this.$t('title.careers'),
   addNew: true,
   addEdit: true,
   fields: [{
     name: "__slot:image",
     title: "",
     titleClass: "center aligned text-right",
     dataClass: "center aligned text-right",
     width: "2%"
    },
    {
     name: "locales.en.name",
     title: this.$t('forms.name-en'),
     titleClass: "",
     dataClass: "list-item-heading",
     width: "15%",
     callback: this.nameFriendly
    },
    {
     name: "locales.ar.name",
     title: this.$t('forms.name-ar'),
     titleClass: "",
     dataClass: "list-item-heading",
     width: "15%"
    },
    {
     name: "salary",
     title: this.$t('forms.salary'),
     titleClass: "",
     dataClass: "list-item-heading",
     width: "5%"
    },
    {
     name: "__slot:from_date",
     title: this.$t('forms.from-date'),
     titleClass: "",
     dataClass: "list-item-heading",
     width: "15%",
    },
    {
     name: "__slot:to_date",
     title: this.$t('forms.to-date'),
     titleClass: "",
     titleClass: "",
     dataClass: "list-item-heading",
     width: "15%"
    },
    {
     name: "__slot:applicants",
     title: "",
     titleClass: "center aligned text-right",
     dataClass: "center aligned text-right",
     width: "15%"
    },
    {
     name: "__slot:actions",
     title: "",
     titleClass: "center aligned text-right",
     dataClass: "center aligned text-right",
     width: "25%"
    }
   ]
  };
 },
 methods: {
  changePageSize(perPage) {
   this.perPage = perPage;
   this.$refs.vuetable.refresh();
  },

  searchChange(val) {
   this.search = val;
  },

  selectAll(isToggle) {
   if (this.selectedItems.length >= this.items.length) {
    if (isToggle) this.selectedItems = [];
   } else {
    this.selectedItems = this.items.map(x => x.id);
   }
  },
  keymap(event) {
   switch (event.srcKey) {
    case "select":
     this.selectAll(false);
     break;
    case "undo":
     this.selectedItems = [];
     break;
   }
  }
 },
  mounted() {
  const userRole = decrypt(localStorage.getItem('userRole'))
  if (userRole == 2) {
   this.addNew = true
   this.addEdit = true
   this.addDelete = true
   this.disableForm = false
   this.addDisplay = false
  }
 }

};
</script>
