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
    ></grid-body>
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
    "grid-body": GridBody,
  },
  data() {
    return {
      isLoad: false,
      apiBase: "notifications",
      sort: "",
      page: 1,
      perPage: 2,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      data: [],
      selectedItems: [],
      addRow: "send",
      title: this.$t("menu.notifications"),
      addNew: true,
      addEdit: true,
      fields: [
        {
          name: "data.en",
          title: "Message En",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: "data.ar",
          title: "Message Ar",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: "created_at",
          title: "Created at",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: "read_at",
          title: "Raed at",
          titleClass: "",
          dataClass: "list-item-heading",
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
