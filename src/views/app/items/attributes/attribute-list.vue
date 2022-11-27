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
      :meta="true"
      :addDelete="addDelete"></grid-body>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../../containers/Grid/GridBody";

export default {
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "grid-body": GridBody
  },
  data() {
    return {
      isLoad: false,
      apiBase: 'attributes',
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
      addRow: "attribute-form",
      title: this.$t('menu.attributes'),
      addNew: true,
      addEdit: true,
      addDelete: true,

      fields: [{
          name: "locales.en.title",
          title: this.$t('forms.name-en'),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "locales.ar.title",
          title: this.$t('forms.name-ar'),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "10%"
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
};
</script>
