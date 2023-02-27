<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1 class="text-uppercase font-weight-bold">Coupons</h1>
        <div class="top-right-button-container">
          <b-button
            variant="primary"
            size="lg"
            class="top-right-button"
            @click="add_New()"
            >Add New Coupon</b-button
          >
        </div>
        <piaf-breadcrumb />
        <div class="mb-2 mt-2">
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block pt-1">
              <div
                class="search-sm d-inline-block float-md-left mr-1 align-top"
              >
                <b-input
                  :placeholder="$t('menu.search')"
                  @input="(val) => searchChange(val)"
                />
              </div>
            </div>
            <!-- <div class="float-md-right pt-1">
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
                  >{{ size }}</b-dropdown-item
                >
              </b-dropdown>
            </div> -->
          </b-collapse>
        </div>
        <div class="separator mb-5" />
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <vuetable
          ref="vuetable"
          class="table-divided order-with-arrow"
          :api-mode="false"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fields"
          pagination-path
          :row-class="onRowClass"
          @vuetable:pagination-data="onPaginationData"
        >
          <template slot="actions" slot-scope="props">
            <b-row align-h="around" class="pr-1 align-items-center">
              <b-link v-if="props.rowData">
                <b-icon-gear-fill
                  @click.prevent="open_details(props.rowData.id)"
                  font-scale="2"
                  aria-hidden="true"
                  animation="spin"
                />
              </b-link>
            </b-row>
          </template>
        </vuetable>
        <vuetable-pagination-bootstrap
          class="mt-4"
          ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
        />
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import { adminRoot } from "../../../constants/config";
import { BIconGearFill } from "bootstrap-vue";

export default {
  components: {
    vuetable: Vuetable,
    "b-icon-gear-fill": BIconGearFill,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
  },
  data() {
    return {
      isLoad: false,
      sort: "",
      page: 1,
      perPage: 12,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      selectedItems: [],
      pageSizes: [12, 18, 25],
      fields: [
        {
          name: "code",
          title: "Code",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%",
        },
        {
          name: "details",
          // sortField: "discount",
          title: "Discount",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%",
          callback: (value) => {
            return value.discount;
          },
        },
        {
          name: "user",
          title: "User",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%",
          callback: (value) => {
            return `${value.first_name} ${value.last_name}`;
          },
        },
        {
          name: "type",
          // sortField: "type",
          title: "Type",
          titleClass: "",
          dataClass: "text-muted",
          width: "15%",
        },
        {
          name: "usages_left",
          // sortField: "usages_left",
          title: "Usage left",
          titleClass: "",
          dataClass: "text-muted",
          width: "10%",
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "15%",
        },
      ],
    };
  },
  created() {
    this.getCoupons({
      keyword: null,
    });
  },
  methods: {
    ...mapActions(["getCoupons"]),
    add_New() {
      this.$router.push(`${adminRoot}/coupon/couponDetails`);
    },
    makeQueryParams(sortOrder, currentPage, perPage) {
      this.selectedItems = [];
      return sortOrder[0]
        ? {
            sort: sortOrder[0]
              ? sortOrder[0].field + "|" + sortOrder[0].direction
              : "",
            page: currentPage,
            per_page: this.perPage,
            search: this.search,
          }
        : {
            page: currentPage,
            per_page: this.perPage,
            search: this.search,
          };
    },
    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },

    rowClicked(dataItem, event) {
      const itemId = dataItem.id;
      if (event.shiftKey && this.selectedItems.length > 0) {
        let itemsForToggle = this.items;
        var start = this.getIndex(itemId, itemsForToggle, "id");
        var end = this.getIndex(
          this.selectedItems[this.selectedItems.length - 1],
          itemsForToggle,
          "id"
        );
        itemsForToggle = itemsForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        );
        this.selectedItems.push(
          ...itemsForToggle.map((item) => {
            return item.id;
          })
        );
        this.selectedItems = [...new Set(this.selectedItems)];
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter((x) => x !== itemId);
        } else this.selectedItems.push(itemId);
      }
    },
    rightClicked(dataItem, field, event) {
      event.preventDefault();
      if (!this.selectedItems.includes(dataItem.id)) {
        this.selectedItems = [dataItem.id];
      }
      this.$refs.contextmenu.show({ top: event.pageY, left: event.pageX });
    },
    onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    open_details(id) {
      this.$router.push({
        path: `${adminRoot}/coupon/couponDetails`,
        query: { id: id },
      });
    },
    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },

    searchChange(val) {
      this.search = val;
      this.getCoupons({
        keyword: val,
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
    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    },

    onContextMenuAction(action) {
      console.log(
        "context menu item clicked - " + action + ": ",
        this.selectedItems
      );
    },
  },
  computed: {
    ...mapGetters(["coupons"]),
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    isAnyItemSelected() {
      return (
        this.selectedItems.length > 0 &&
        this.selectedItems.length < this.items.length
      );
    },
  },
  watch: {
    coupons: function (coup) {
      console.log(coup);
      this.$refs.vuetable.setData(coup);
    },
  },
};
</script>
