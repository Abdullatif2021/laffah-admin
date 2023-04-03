<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Delivery" />
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
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <vuetable
          table-body-class="vuetable-body"
          ref="vuetable"
          class="table-divided order-with-arrow"
          :per-page="perPage"
          :data-manager="dataManager"
          :reactive-api-url="true"
          :api-mode="false"
          :fields="fields"
        >
          <!-- <template slot="rating" slot-scope="props">
                      <div class="rating">
                        <span v-for="n in 5" :key="n" :class="['star', n <= props.rowData.rate ? 'filled' : '']" ></span>
                      </div>
                    </template> -->
          <template slot="pending" slot-scope="props">
            <div
              :class="`${
                props.rowData.pending_delivery_orders_count == 0
                  ? 'number-container-active'
                  : 'number-container-unactive'
              }`"
            >
              <div class="number">
                {{ props.rowData.pending_delivery_orders_count }}
              </div>
              <div class="pending">pending</div>
            </div>
          </template>
          <template slot="rating" slot-scope="props">
            <rating
              :value="props.rowData.rate ? props.rowData.rate : 0"
              :ewwe="props.rowData.id"
            ></rating>
          </template>
          <template slot="status" slot-scope="props">
            <div
              style="margin-top: 15px"
              @click="handleSwitchClick(props.rowData)"
            >
              <switches
                v-model="props.rowData.delivery_status"
                theme="custom"
                color="primary"
                class="vue-switcher-small"
              ></switches>
            </div>
          </template>
          <template slot="actions" slot-scope="props">
            <b-row align-h="around" class="pr-1 align-items-center">
              <b-link v-if="props.rowData">
                <b-icon-gear-fill
                  @click.prevent="open_details(props.rowData.id)"
                  font-scale="2"
                  aria-hidden="true"
                />
              </b-link>
              <!-- <b-icon-exclamation-circle-fill
                  <b-link>
                      @click.prevent="detailsForm(props.rowData)"
                      font-scale="2"
                      aria-hidden="true"
                    />
                  </b-link>
                  <b-icon
                    :id="`refund-icon-${props.rowData.id}`"
                    v-if="props.rowData.refund_request === 1"
                    icon="circle-fill"
                    variant="danger"
                    font-scale="1"
                  />
                  <b-tooltip
                    :target="`refund-icon-${props.rowData.id}`"
                    triggers="hover"
                  >
                    Go to item <b>page</b> content!
                  </b-tooltip> -->
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
import Vuetable from "vuetable-2/src/components/Vuetable";
import { mapActions, mapGetters } from "vuex";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import { adminRoot } from "../../../constants/config";
import rating from "../../../components/Listing/rating.vue";
import Switches from "vue-switches";
import {
  BIconExclamationCircleFill,
  BIconGearFill,
  BIconCircleFill,
  BootstrapVueIcons,
} from "bootstrap-vue";

export default {
  components: {
    vuetable: Vuetable,
    "b-icon-gear-fill": BIconGearFill,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    rating: rating,
    switches: Switches,
  },
  data() {
    return {
      isLoad: false,
      order_by: null,
      dir: null,
      currentPage: 1, // current page number
      perPage: 12, // number of items per page
      totalItems: 0, // total number of items
      pageSizes: [12, 18, 25],
      from: 0,
      to: 0,
      fields: [
        {
          name: "first_name",
          sortField: "first_name",
          title: "First Name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%",
        },
        {
          name: "last_name",
          sortField: "last_name",
          title: "Last Name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%",
        },
        {
          name: "phone_number",
          title: "Telephone",
          titleClass: "",
          dataClass: "text-muted",
          width: "10%",
        },
        {
          name: "email",
          title: "Email",
          titleClass: "",
          dataClass: "text-muted",
          width: "10%",
        },
        {
          name: "__slot:pending",
          title: "Pending Orders",
          sortField: "pending_delivery_orders_count",
          titleClass: "center aligned text-left",
          dataClass: "center aligned text-left",
          width: "15%",
        },
        {
          name: "__slot:status",
          title: "Status",
          sortField: "delivery_status",
          titleClass: "center aligned text-left",
          dataClass: "center aligned text-left",
          width: "10%",
        },
        {
          name: "__slot:rating",
          title: "Rating",
          sortField: "rate",
          titleClass: "center aligned text-left",
          dataClass: "center aligned text-left",
          width: "15%",
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "10%",
        },
      ],
    };
  },
  created() {
    this.get_deliveries({
      order_dir: null,
      keyword: null,
      offset: 0,
      limit: 12,
      order_by: null,
    });
  },
  methods: {
    ...mapActions(["get_deliveries", "updateDliveryState"]),

    handleSwitchClick(item) {
      console.log(item);
      this.updateDliveryState({
        item_id: item.id,
        status: item.delivery_status ? 0 : 1,
      });
    },
    fetchData() {
      // fetch the table data using your API or database driver
      const limit = this.perPage;
      const offset = (this.currentPage - 1) * this.perPage;
      this.get_deliveries({
        order_dir: null,
        keyword: null,
        offset: offset,
        limit: limit,
        order_by: null,
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

    open_details(id) {
      this.$router.push(`details/${id}`);
      // this.$router.push({
      // path: `${adminRoot}/delivery/details/${id}`,
      // // query: { id: id }
      // });
    },
    dataManager(sortOrder, pagination) {
      const limit = this.perPage;
      const offset = (this.currentPage - 1) * this.perPage;
      if (sortOrder.length > 0) {
        if (sortOrder[0].direction == "asc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          if (sortOrder[0].sortField == "pending_delivery_orders_count") {
            this.get_deliveries({
              order_dir: this.dir,
              keyword: null,
              pending_delivery_orders_count: 1,
              offset: offset,
              limit: limit,
              order_by: this.order_by,
            });
          }
          if (sortOrder[0].sortField == "rate") {
            this.get_deliveries({
              order_dir: this.dir,
              keyword: null,
              rate: 1,
              offset: offset,
              limit: limit,
              order_by: this.order_by,
            });
          }
          this.get_deliveries({
            order_dir: this.dir,
            keyword: null,

            offset: offset,
            limit: limit,
            order_by: this.order_by,
          });
        }
        if (sortOrder[0].direction == "desc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "DESC";
          if (sortOrder[0].sortField == "pending_delivery_orders_count") {
            this.get_deliveries({
              order_dir: this.dir,
              keyword: null,
              pending_delivery_orders_count: 1,
              offset: offset,
              limit: limit,
              order_by: this.order_by,
            });
          }
          if (sortOrder[0].sortField == "rate") {
            this.get_deliveries({
              order_dir: this.dir,
              keyword: null,
              rate: 1,
              offset: offset,
              limit: limit,
              order_by: this.order_by,
            });
          }
          this.get_deliveries({
            order_dir: this.dir,
            keyword: null,
            offset: offset,
            limit: limit,
            order_by: this.order_by,
          });
        }
      }
    },
    searchChange(val) {
      this.search = val;
      this.get_deliveries({
        order_dir: null,
        keyword: val,
        offset: 0,
        limit: 12,
        order_by: null,
      });
    },
  },
  computed: {
    ...mapGetters([
      "_all_deliveries",
      "_delivery_paginations",
      "_changeDeliveryStatus",
    ]),
  },
  watch: {
    _all_deliveries: function (val) {
      console.log("all deliveries watcher", val);
      this.$refs.vuetable.setData(val.data);
      this.totalItems = val.total;
      this.calculation();
    },
    currentPage: function (val) {
      this.fetchData();
    },
    perPage: function (val) {
      this.fetchData();
    },
    _changeDeliveryStatus: function (val) {
      console.log(val, val);
      this.$notify(
        "success",
        "Delivery Status has been Updated Successfully",
        null,
        { duration: 5000, permanent: false }
      );
    },
  },
};
</script>
<style scoped>
.vuetable-body {
  background-color: red;
}
.rating {
  display: inline-block;
}

.star {
  display: inline-block;
  font-size: 1.5em;
  cursor: pointer;
}

.star:before {
  content: "★";
}

.filled {
  color: gold;
}
.number-container-active {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #4caf50; /* green color */
  padding: 5px;
  border-radius: 20px;
}
.number-container-unactive {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ce1a1a; /* green color */
  padding: 5px;
  border-radius: 20px;
}

.number {
  font-weight: bold;
  font-size: 14px;
  margin-right: 5px;
}

.pending {
  font-weight: bold;
}
</style>
