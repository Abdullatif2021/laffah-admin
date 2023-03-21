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
            <div class="float-md-right pt-1">
              <span class="text-muted text-small mr-1 mb-2"
                >{{ from }}-{{ to }} of {{ totalItems }}</span
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
            </div>
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
        <div class="d-flex justify-content-center">
          <b-pagination
            v-if="totalItems > perPage"
            v-model="currentPage"
            :total-rows="totalItems"
            :per-page="perPage"
            :aria-controls="'my-table'"
            :ellipsis-text="'...'"
            :prev-text="'<'"
            :next-text="'>'"
            :max-size="5"
            :use-router="true"
            :router-to="{ name: 'my-table', query: { page: currentPage } }"
          ></b-pagination>
        </div>
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
      currentPage: 1, // current page number
      perPage: 12, // number of items per page
      totalItems: 0, // total number of items
      pageSizes: [12, 18, 25],
      from: 0,
      to: 0,
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
      offset: 0,
      limit: 12,
    });
  },
  methods: {
    ...mapActions(["getCoupons"]),
    add_New() {
      this.$router.push(`${adminRoot}/coupon/couponDetails`);
    },

    open_details(id) {
      this.$router.push({
        path: `${adminRoot}/coupon/couponDetails`,
        query: { id: id },
      });
    },
    fetchData() {
      // fetch the table data using your API or database driver
      const limit = this.perPage;
      const offset = (this.currentPage - 1) * this.perPage;
      this.getCoupons({
        keyword: null,
        offset: offset,
        limit: limit,
      });
    },
    calculation() {
      this.from = (this.currentPage - 1) * this.perPage;
      this.to = this.from + this.perPage;
    },

    changePageSize(perPage) {
      this.perPage = perPage;
    },
    calculatePagination() {
      // calculate the number of pages needed
      const totalPages = Math.ceil(this.totalItems / this.perPage);

      // set the current page number based on the query parameter or default to 1
      this.currentPage = parseInt(this.$route.query.page) || 1;

      // calculate the start and end page numbers for the pagination control
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(totalPages, this.currentPage + 2);

      // calculate the page numbers to display in the pagination control
      const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );

      // return the pagination properties
      return {
        currentPage: this.currentPage,
        perPage: this.perPage,
        totalPages: totalPages,
        totalItems: this.totalItems,
        pages: pages,
      };
    },

    searchChange(val) {
      this.search = val;
      this.getCoupons({
        keyword: val,
        offset: null,
        limit: null,
      });
    },
  },
  computed: {
    ...mapGetters(["coupons"]),
  },
  watch: {
    coupons: function (coup) {
      console.log(coup);
      this.$refs.vuetable.setData(coup.data);
      this.totalItems = coup.total;
      this.calculation();
    },
    currentPage: function (val) {
      this.fetchData();
    },
    perPage: function (val) {
      this.fetchData();
    },
  },
};
</script>
