<template>
  <b-modal
    size="lg"
    :id="`modalright_related`"
    ref="modalright"
    :title="$t('pages.related-items')"
  >
    <b-form
      @submit.prevent="onValidateCategoryFormFormSubmit"
      class="av-tooltip tooltip-label-bottom"
    >
      <b-icon icon="circle-fill" animation="throb" font-scale="4"></b-icon>
      <item-divided-table
        v-if="items.length > 0"
        ref="related"
        :title="`${$t('menu.selected-related-items')} : ${relatedItems.length}`"
        :fields="fields"
        :pre-selected-items="selectedItems"
        :api-mode="false"
        :data-list="items"
        :key="items[0].id"
      />
    </b-form>
    <template slot="modal-footer">
      <b-button
        variant="outline-secondary"
        @click="hideModal('modalright')"
      >{{ $t('pages.cancel') }}
      </b-button>
      <b-button variant="primary" @click="onValidateCategoryFormFormSubmit()" class="mr-1">{{ $t('pages.submit') }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>

import Colxx from "../../../components/Common/Colxx";
import DividedTable from "@/views/app/items/DividedTable";
import {mapGetters} from "vuex";


export default {
  components: {
    "colxx": Colxx,
    "item-divided-table": DividedTable,
  },
  props: ["attributes"],
  data() {
    return {
      url: 'items/related',
      label: `locales.${this.$i18n.locale}.title`,
      fields: [
        {
          name: `locales.${this.$i18n.locale}.name`,
          title: `${this.$t('tables.name')}`,
          titleClass: "",
          dataClass: "list-item-heading",
          width: "60%"
        },
        {
          name: "category",
          title: `${this.$t('tables.category')}`,
          titleClass: "",
          dataClass: "list-item-heading",
          width: "30%",
          callback: this.viewCategory
        },
        {
          name: "__slot:actions",
          sortField: 'actions',
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "10%"
        }
      ],
      selectedItems: []
    }
  },
  computed: {
    items: ({getItemsList, relatedItems}) => {
      let new_index = 0
      let list = getItemsList
      if (relatedItems.length > 0) {
        relatedItems.forEach((id, index) => {
          let old_index = list.findIndex((item) => item.id === id)
          if (old_index !== -1) {
            list.splice(new_index, 0, list.splice(old_index, 1)[0])
          }
        })
      }
      return list
    },
    ...mapGetters('category', ['selectData',]),
    ...mapGetters('item', ['getItem', 'relatedItems', 'getItemsList']),
  },
  mounted() {
    this.$store.dispatch('category/loadCategoriesList')
  },
  methods: {
    viewCategory(value) {
      if (value && value.length > 0) {
        return this.selectData.find(category => category.category_id === value[0]).title
      }
    },
    onValidateCategoryFormFormSubmit: function () {
      let di = this.selectedItems.map(x => ({id: x}))
      console.log('submit', this.url)
      let data = new FormData();
      data.append('items', JSON.stringify({items: di}))
      for (var pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1], typeof pair[1]);
      }

      this.$store.dispatch('handleSubmit', {
        url: this.getItem ? `${this.url}/${this.getItem.id}` : `${this.url}`,
        obj: data
      })
      this.hideModal('modalright')
    },
    hideModal(refname) {
      this.selectedItems = []
      this.$refs[refname].hide();
    },
  },
  watch: {
    relatedItems(value) {
      this.selectedItems = []
      if (value) {
        this.selectedItems = value
        this.$refs.related.$refs.vuetable.orderBy('actions','asc')
      }
    }
  }
};
</script>

