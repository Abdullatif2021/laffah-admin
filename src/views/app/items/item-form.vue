<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.items')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx
        v-if="item"
        sm="12"
        md="6"
        class="mb-4"
      >
        <item-form-group/>
      </b-colxx>
      <b-colxx
        sm="12"
        md="6"
        class="mb-4">
        <item-divided-table
          :title="$t('menu.select-customizations-groups')"
          :fields="customizationGroupsFields"
          :disabled="!editable"
          :api-mode="true"
          model-url="customizations/groups"
          :pre-selected-items="selectedCustomizationsGroups"
        />
        <item-divided-table
          v-if="(item!== null&& parseInt(item.type)===1)"
          :has-add-button="true"
          :disabled="!editable"
          :title="$t('menu.batch-management')"
          :fields="batchBranchFields"
          :api-mode="false"
          :data-list="batches"/>
      </b-colxx>
    </b-row>
    <template v-if="isLoad">
      <div class="loading"></div>
    </template>
  </div>
</template>
<script>
import ItemForm from "../../../containers/item/ItemForm";
import DividedTable from "./DividedTable";
import {mapGetters, mapState} from "vuex";

export default {
  name: "item-form",
  components: {
    "item-form-group": ItemForm,
    "item-divided-table": DividedTable,
  },
  data() {
    return {
      itemId: null,
      isLoad: true,
      apiBase: `items`,
      selectedCustomizationsGroups: [],
      customizationGroupsFields: [
        {
          name: `locales.${this.$i18n.locale}.title`,
          sortField: `locales.${this.$i18n.locale}.title`,
          title: `${this.$t('tables.title')}`,
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: `locales.${this.$i18n.locale}.description`,
          sortField: `locales.${this.$i18n.locale}.description`,
          title: `${this.$t('tables.description')}`,
          titleClass: "",
          dataClass: "text-muted",
          width: "25%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "5%"
        }
      ],
      batchBranchFields: [{
        name: `batch`,
        sortField: `batch`,
        title: `${this.$t('tables.title')}`,
        titleClass: "",
        dataClass: "list-item-heading",
        width: "10%",
      },
        {
          name: `batchDetails`,
          sortField: "batchDetails.0.value",
          title: `${this.$t('tables.attributes')}`,
          titleClass: "",
          dataClass: "text-muted",
          width: "25%",
          callback: this.viewAttribute
        },
        {
          name: "prices",
          sortField: "city_id",
          title: `${this.$t('tables.city-price')}`,
          titleClass: "",
          dataClass: "text-muted",
          width: "20%",
          callback: this.viewCity
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
        }
      ]
    }
  },
  computed: {

    ...mapGetters({
      cities: 'getCities',
      batches: 'item/getCurrentItemBatches',
    }),
    ...mapState('item', {
      item: 'currentItem',
      editable: 'itemStatus'
    })
  },
  methods: {
    getItem: function (id) {
      this.$store.dispatch('item/getItem', id)
    },
    viewAttribute(value) {
      let itm = value.map(x => JSON.parse(x.attribute.locales[this.$i18n.locale].list_values).find(y => y.id === parseInt(x.value)).value)
      return itm.toString()
    },
    viewCity(value) {
      let cityPriceArray = value.map(x => `${this.cities.find(city => city.id === parseInt(x.city_id)).locales[this.$i18n.locale].name}/ ${x.price}`)
      return cityPriceArray.toString().replace(',', '\n')
    }

  },
  mounted() {
    this.$store.dispatch('fetchCities');
  },
  watch: {
    '$route.params.id': {
      handler: function (id) {
        if (typeof id === 'undefined') {
          // this.$store.dispatch('item/SET_CurrentItem', null)
          this.$store.dispatch('item/initItem')
        } else {
          this.itemId = id
          this.getItem(id)
        }
      },
      deep: true,
      immediate: true
    },
    item(val) {
      if (val) {
        if (val.id || (val.action && val.action === 'create')) {
          this.isLoad = false
        }
      }
      if (val && val.customizationGroups) {
        let cg = val.customizationGroups.flatMap(x => x.id)
        this.selectedCustomizationsGroups = [...this.selectedCustomizationsGroups, ...cg]
      }
    }
  }
}
</script>

<style scoped>

</style>
