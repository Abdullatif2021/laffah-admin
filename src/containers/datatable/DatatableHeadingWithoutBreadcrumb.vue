<template>
  <b-row>
    <b-colxx xxs="12">
      <h1 class="font-weight-bold text-uppercase">{{ title }}</h1>
      <div class="top-right-button-container">
        <b-button
          v-if="hasAddButton && authorSuperadmin"
          :disabled="disabled"
          v-b-modal.modalright
          variant="primary"
          size="lg"
          class="top-right-button"
          @click="resetCurrentBatch">
          {{ $t('pages.add-new') }}
        </b-button>
        <b-button-group
          v-if="!hasAddButton"
        >
          <b-button
            :disabled="disabled"
            split
            right
            @click="selectAll(true)"
            class="check-button"
            variant="primary">
            <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
              <input
                class="custom-control-input"
                type="checkbox"
                :disabled="disabled"
                :checked="isSelectedAll"
                v-shortkey="{select: ['ctrl','a'], undo: ['ctrl','d']}" @shortkey="keymap"/>
              <span :class="{
                'custom-control-label' :true,
                'indeterminate' : isAnyItemSelected
                }">&nbsp;</span>
            </label>
            <!--            <b-dropdown-item>{{$t('pages.delete')}}</b-dropdown-item>-->
            <!--            <b-dropdown-item>{{$t('pages.another-action')}}</b-dropdown-item>-->
          </b-button>
        </b-button-group>
      </div>

      <add-new-modal v-if="hasAddButton && !$route.path.includes('orders')"/>
      <div class="mb-2 mt-2">
        <b-button
          variant="empty"
          class="pt-0 pl-0 d-inline-block d-md-none"
          v-b-toggle.displayOptions>
          {{ $t('pages.display-options') }}
          <i class="simple-icon-arrow-down align-middle"/>
        </b-button>
        <b-collapse
          id="displayOptions"
          class="d-md-block">
          <div class="d-block d-md-inline-block pt-1">
            <div class="search-sm d-inline-block float-md-left mr-1 align-top">
              <b-input
                :placeholder="$t('menu.search')"
                @input="(val) => searchChange(val)"/>
            </div>
          </div>
          <div class="float-md-right pt-1">
            <span class="text-muted text-small mr-1 mb-2">{{ from }}-{{ to }} of {{ total }}</span>
            <b-dropdown
              id="ddown2"
              right
              :text="`${perPage}`"
              variant="outline-dark"
              class="d-inline-block"
              size="xs">
              <b-dropdown-item
                v-for="(size,index) in pageSizes"
                :key="index"
                @click="changePageSize(size)">{{ size }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-collapse>
      </div>
      <div class="separator mb-5"/>
    </b-colxx>
  </b-row>
</template>

<script>
import axios from "axios";
import {apiUrl} from "../../constants/config";
import {decrypt} from '../../utils';

export default {

  props: [
    "title",
    "hasAddButton",
    "selectAll",
    "isSelectedAll",
    "isAnyItemSelected",
    "keymap",
    "disabled",
    "changePageSize",
    "searchChange",
    "from",
    "to",
    "total",
    "perPage"
  ],
  components: {
    "add-new-modal": () => import('../pages/items/AddNewBatch')
  },
  computed: {
    authorSuperadmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      if (userRole == 1) {
        return true
      } else
        return false
    },
  },
  data() {
    return {
      options: [{
        label: "Cakes",
        value: "Cakes"
      },
        {
          label: "Cupcakes",
          value: "Cupcakes"
        },
        {
          label: "Desserts",
          value: "Desserts"
        }
      ],
      statuses: [{
        text: "ON HOLD",
        value: "ON HOLD"
      },
        {
          text: "PROCESSED",
          value: "PROCESSED"
        }
      ],
      sortOptions: [{
        column: "title",
        label: "Product Name"
      },
        {
          column: "category",
          label: "Category"
        },
        {
          column: "status",
          label: "Status"
        }
      ],
      pageSizes: [12, 18, 25]
    };
  },
  methods: {
    resetCurrentBatch() {
      this.$store.commit('item/SET_CurrentBatch', null)
    }

  }
};
</script>
