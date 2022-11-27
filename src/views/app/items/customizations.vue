<template>
  <div>
    <b-row>
      <b-colxx
        xxs="12"
        md="6">
        <grid-body
          ref="groups"
          :title="$t('pages.customizations-groups')"
          :fieldsNames="fields"
          :perPage="perPage"
          :search="search"
          :apiBase="apiBase"
          :item-actions="ItemActions"
          :addEdit="true"></grid-body>
      </b-colxx>
      <b-colxx
        xxs="12"
        md="6">
        <grid-body
          ref="customizations"
          v-if="selected_customization_group_id"
          :title="$t(`${customizationTitle}`)"
          :id="selected_customization_group_id"
          :fieldsNames="customizationFields"
          :with-breadcrumb="false"
          :perPage="perPage"
          :item-actions="ItemActions"
          :search="search"
          :apiBase="customizationsUrl"
          :type="'?customization_group_id=' +selected_customization_group_id"
          :addEdit="true"></grid-body>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../containers/Grid/GridBody";
import Colxx from "../../../components/Common/Colxx";

export default {
  name: 'Customizations',
  props: ["title"],
  components: {
    Colxx,
    GridBody,
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "gird-body": GridBody
  },
  data() {
    return {
      isLoad: false,
      apiBase: `customizations/groups`,
      sort: "",
      page: 1,
      perPage: 4,
      search: "",
      customizationGTitle: '',
      selectedItems: [],
      selected_customization_group_id: undefined,
      selectedCustomization: undefined,
      fields: [{
        name: "__slot:image",
        title: '',
        titleClass: "",
        dataClass: "center aligned text-right",
        width: "10%"
      },
        {
          name: `locales.en.title`,
          title: `${this.$t(`forms.name-en`)}`,
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%",
          callback: this.nameFriendly
        },
        {
          name: `locales.ar.title`,
          title: `${this.$t(`forms.name-ar`)}`,
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "15%"
        }
      ],
      customizationFields: [{
        name: `locales.en.title`,
        title: `${this.$t(`forms.name-en`)}`,
        titleClass: "",
        dataClass: "list-item-heading",
        width: "20%",
        callback: this.nameFriendly
      },
        {
          name: `locales.ar.title`,
          title: `${this.$t(`forms.name-ar`)}`,
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%",
          callback: this.nameFriendly
        },
        {
          name: `added_value`,
          title: `${this.$t(`tables.price`)}`,
          titleClass: "",
          dataClass: "",
          width: "10%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "15%"
        }
      ],
    };
  },
  computed: {
    customizationTitle({selectedCustomization, $i18n}) {
      if (selectedCustomization && !selectedCustomization.customization_group_id) {
        this.customizationGTitle = selectedCustomization.locales[$i18n.locale].title
      }
      return this.customizationGTitle
    },
    customizationsUrl: ({selected_customization_group_id}) => {
      return `customizations`
    }
  },
  methods: {
    changePageSize(perPage) {
      this.$refs.vuetable.refresh();
    },
    searchChange(val) {
      this.search = val;
    },
    ItemActions(action, val) {
      if (this.selectedCustomization && this.selectedCustomization.action) {
        delete this.selectedCustomization.action
      }
      switch (action) {
        case 'view':
          this.selected_customization_group_id = val.id
          this.selectedCustomization = val
          if (this.$refs.customizations) {
            this.$nextTick(() => {
              this.$refs.customizations.getData()
            })
          }
          break
        case 'reset':
          this.selectedCustomization = undefined
          break
        case 'edit':
          val.action = action
          if (!val.customization_group_id) {
            this.selected_customization_group_id = val.id
          }
          this.selectedCustomization = val
          // this.$nextTick(() => {
          //  this.$refs.customizations.getData()
          // })
          break
        case 'get':
          return this.selectedCustomization
        case 'refresh':
          if (this.$refs.customizations) {
            //console.log('refresh customizations')
            this.$nextTick(() => {
              this.$refs.customizations.getData()
              this.$refs.customizations.$refs.vuetable.reload()
            })
          }
          //console.log('refresh groups')
          this.$nextTick(() => {
            this.$refs.groups.getData()
            this.$refs.groups.$refs.vuetable.reload()
          })
          break
      }
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
