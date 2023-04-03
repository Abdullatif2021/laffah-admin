<template>
  <div>
    <button @click="get_branches">rfrfrfre</button>
    <grid-body
      :fieldsNames="fields"
      :perPage="perPage"
      :search="search"
      :apiBase="apiBase"
      :addRow="addRow"
      :title="title"
      :addNew="addNew"
      :addEdit="addEdit"
      :meta="true"
      :addDelete="addDelete"
    ></grid-body>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../containers/Grid/GridBody";
import Axios from "axios";

export default {
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "grid-body": GridBody,
  },
  data() {
    return {
      isLoad: false,
      apiBase: "branches",
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
      addRow: "branches-form",
      title: this.$t("menu.branches"),
      addNew: false,
      addEdit: true,
      addDelete: false,

      fields: [
        {
          name: "locales.en.name",
          title: this.$t("forms.name-en"),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: "locales.ar.name",
          title: this.$t("forms.name-ar"),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: "telephone",
          title: "Telephone",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: "mobile",
          title: "Mobile",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: "__slot:active",
          title: "Active State",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "10%",
        },
      ],
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
    get_branches() {
      return Axios.get(
        `https://api-v2.laffahrestaurants.com/public/api/branches`
      )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selectAll(isToggle) {
      if (this.selectedItems.length >= this.items.length) {
        if (isToggle) this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map((x) => x.id);
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
    },
  },
};
</script>
