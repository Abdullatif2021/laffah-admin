<template>
  <div>
    <grid-body
      :title="$t('pages.items')"
      :fieldsNames="fields"
      :perPage="perPage"
      :search="search"
      :apiBase="apiBase"
      :add-meta="true"
      :addRow="addRow"></grid-body>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../containers/Grid/GridBody";
import {mapGetters} from "vuex";

export default {
  props: ["title"],
  components: {
    GridBody,
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "gird-body": GridBody
  },
  data() {
    return {
      isLoad: false,
      apiBase: `items`,
      addRow: `item-form`,
      sort: "",
      page: 1,
      perPage: 4,
      search: "",
      selectedItems: [],

      fields: [{
        name: "__slot:image",
        title: "",
        titleClass: "center aligned text-right",
        dataClass: "center aligned text-right",
        width: "2%"
      },
        {
          name: `locales.en.name`,
          title: `${this.$t('forms.name-en')}`,
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: `locales.ar.name`,
          title: `${this.$t('forms.name-ar')}`,
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "category",
          title: `${this.$t('tables.category')}`,
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
          callback: this.viewCategory
        },
        {
          name: "is_published",
          title: `${this.$t('tables.online-state')}`,
          titleClass: "",
          dataClass: "",
          width: "10%",
          callback: this.viewStatus
        },
        {
          name: "__slot:price",
          title: `${this.$t('tables.price')}`,
          titleClass: "center aligned",
          dataClass: "center aligned",
          width: "10%"
        },
        {
          name: "__slot:active",
          title: `${this.$t('tables.active')}`,
          titleClass: "center aligned",
          dataClass: "center aligned",
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
  computed: {
    ...mapGetters('category', ['selectData',]),
  },
  mounted() {
    this.$store.dispatch('category/loadCategoriesList')
    this.$store.dispatch('item/loadItemsList')
  },
  methods: {
    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },

    viewCategory(value) {
      console.log(value);
      return (this.selectData.find(category => category.category_id === value[0]) || {}).title || 'Deleted  '
    },
    viewStatus(value) {
      return value === 1 ? this.$t('tables.published') : this.$t('tables.published')
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
