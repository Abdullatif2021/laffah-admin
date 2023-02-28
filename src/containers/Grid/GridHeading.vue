<template>
  <b-row>
    <b-colxx xxs="12">
      <!-- <h1 class="font-weight-bold text-uppercase">{{ attachType !== undefined ? attachType.toString().replaceAll('-',' ') : title.toString().replaceAll('-',' ') }}</h1> -->
      <div class="top-right-button-container">
        <b-button
          v-if="addNew && apiBase.includes('customization')"
          v-b-modal="`modalright_customization_${id}`"
          variant="primary"
          class="top-right-button"
          @click="itemActions('reset')"
          >{{ $t("pages.add-new") }}
        </b-button>
        <router-link
          v-if="addNew && !apiBase.includes('customization')"
          ref="link"
          @click.native="routing('ergergrg')"
          :to="
            attachType !== undefined
              ? '../' + addRow + '/' + attachType + '/' + id
              : addRow
          "
          class="btn top-right-button btn-primary btn-lg"
        >
          {{ $t("pages.add-new") }} {{ addRow }}
        </router-link>
        <add-new-modal
          v-if="addNew && apiBase.includes('customization')"
          :id="id"
          :obj="itemActions"
        />
        <related-modal v-if="addNew && apiBase.includes('items')" />
        <active-modal v-if="apiBase.includes('items')" />
      </div>
      <piaf-breadcrumb v-if="withBreadcrumb" />
      <div class="mb-2 mt-2">
        <b-button
          variant="empty"
          class="pt-0 pl-0 d-inline-block d-md-none"
          v-b-toggle.displayOptions
        >
          {{ $t("pages.display-options") }}
          <i class="simple-icon-arrow-down align-middle" />
        </b-button>
        <b-collapse id="displayOptions" class="d-md-block">
          <div class="d-block d-md-inline-block pt-1">
            <div class="search-sm d-inline-block float-md-left mr-1 align-top">
              <b-input
                :placeholder="$t('menu.search')"
                @input="(val) => searchChange(val)"
              />
            </div>
          </div>
          <div class="float-md-right pt-1">
            <span class="text-muted text-small mr-1 mb-2"
              >{{ from }}-{{ to }} of {{ total }}</span
            >
            <b-dropdown
              id="ddown2"
              right
              :text="`${perPage}`"
              variant="outline-dark"
              class="d-inline-block"
              size="xs"
            >
              <b-dropdown-item
                v-for="(size, index) in pageSizes"
                :key="index"
                @click="changePageSize(size)"
                >{{ size }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-collapse>
      </div>
      <!-- <div class="float-md-right pt-1">
        <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
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
      </div> -->
      <div class="separator mb-5" />
    </b-colxx>
  </b-row>
</template>

<script>
import { decrypt } from "@/utils";

export default {
  props: [
    "title",
    "selectAll",
    "isSelectedAll",
    "isAnyItemSelected",
    "keymap",
    "changePageSize",
    "searchChange",
    "from",
    "to",
    "total",
    "perPage",
    "withBreadcrumb",
    "itemActions",
    "addRow",
    "id",
    "attachType",
    "apiBase",
    "addNew",
  ],
  components: {
    "add-new-modal": () => import("../pages/items/customizationModal"),
    "related-modal": () => import("../pages/items/relatedModal"),
    "active-modal": () => import("../pages/items/activeModal"),
  },
  data() {
    return {
      statuses: [
        {
          text: "ON HOLD",
          value: "ON HOLD",
        },
        {
          text: "PROCESSED",
          value: "PROCESSED",
        },
      ],
      sortOptions: [
        {
          column: "title",
          label: "Product Name",
        },
        {
          column: "category",
          label: "Category",
        },
        {
          column: "status",
          label: "Status",
        },
      ],
      pageSizes: [12, 18, 25],
    };
  },
  computed: {
    authorAddNew() {
      const userRole = decrypt(localStorage.getItem("userRole"));
      if (userRole == 1) {
        return true;
      } else return false;
    },
  },
  methods: {
    routing(val) {
      console.log("clicked", val);
    },
  },
};
</script>
