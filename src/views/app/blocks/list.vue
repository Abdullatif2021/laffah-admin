<template>
  <div>
    <grid-body
      :fieldsNames="fields"
      :perPage="perPage"
      :search="search"
      :apiBase="apiBase"
      :addRow="addRow"
      :title="blockType"
      :type="'?block_category_slug='+blockType"
      :addNew="addNew"
      :addEdit="addEdit"
      :addMeta="true"
      :addDelete="addDelete"
      :addAttach="true">
    </grid-body>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../containers/Grid/GridBody";
import { apiUrl } from '../../../constants/config';

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
      apiBase: 'blocks',
      //type: "?block_category_slug=", //or undefined
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
      addRow: "form",
      title: this.$route.params.slug,
      addNew: true,
      addEdit: true,
      addDelete: true,

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
          width: "10%",
          callback: this.nameFriendly
        },
        {
          name: "locales.ar.name",
          title: this.$t('forms.name-ar'),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "post_date",
          title: "Date",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },

        {
          name: "__slot:visible",
          title: "Visible On Website",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
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
  computed: {
    blockType() {
      localStorage.setItem("blockType", this.$route.params.slug)
      return this.$route.params.slug
    }
  }
}
</script>
