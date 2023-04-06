<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1 class="text-uppercase font-weight-bold">Waiting Orders</h1>

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
        <div class="separator mb-5"></div>

        <vuetable
          ref="vuetable"
          class="table-divided order-with-arrow"
          :api-mode="false"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fields"
        >
          <template slot="price" slot-scope="props">
            <b-badge pill variant="outline-primary">
              <span>{{ `${props.rowData.total}  ${$t("pages.aed")}` }}</span>
            </b-badge>
          </template>
          <template slot="actions" slot-scope="props">
            <b-row align-h="around" class="pr-1 align-items-center">
              <b-link v-if="props.rowData">
                <b-icon-gear-fill
                  @click.prevent="updateFormModel(props.rowData)"
                  font-scale="2"
                  aria-hidden="true"
                  animation="pulse"
                />
              </b-link>
              <b-link>
                <b-icon-exclamation-circle-fill
                  @click.prevent="detailsForm(props.rowData)"
                  font-scale="2"
                  aria-hidden="true"
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
    <b-modal
      id="modalright"
      ref="modalright"
      modal-class="modal-right"
      hide-header
    >
      <div class="modal_body">
        <b-form-group label="Change the Status of Order" class="error-l-150">
          <b-form-radio-group stacked v-model.trim="newState">
            <b-form-radio value="1">PENDING</b-form-radio>
            <b-form-radio value="2">ACCEPTED</b-form-radio>
            <!-- <b-form-radio value="3">INPROGRESS</b-form-radio> -->
            <b-form-radio value="6">COMPLETED</b-form-radio>
            <b-form-radio value="7">REJECTED</b-form-radio>
          </b-form-radio-group>
          <!-- <b-form-invalid-feedback
          class="d-block"
          v-if="!$v.customRadio.required && $v.customRadio.$dirty"
          >Please select one!</b-form-invalid-feedback
        > -->
        </b-form-group>
      </div>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          :disabled="!newState"
          @click="change_order_state(newState)"
          class="mr-1"
          >ٍSubmit</b-button
        >
        <b-button variant="secondary" @click="hideModal('modalright')"
          >Cancel</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import Vuetable from "vuetable-2/src/components/Vuetable";
import { BIconGearFill, BIconExclamationCircleFill } from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";
import { adminRoot } from "../../../constants/config";

export default {
  components: {
    vuetable: Vuetable,
    "b-icon-gear-fill": BIconGearFill,
    "b-icon-exclamation-circle-fill": BIconExclamationCircleFill,
  },
  data() {
    return {
      items: [], // table data
      currentPage: 1, // current page number
      perPage: 12, // number of items per page
      totalItems: 0, // total number of items
      pageSizes: [12, 18, 25],
      from: 0,
      toggleState: false,
      to: 0,
      newState: null,
      procced_order: null,
      fields: [
        {
          name: "order_key",
          title: "Key",
          titleClass: "px-2",
          dataClass: "px-2 font-weight-bold",
          width: "15%",
        },
        {
          name: "entry_date",
          title: `${this.$t("forms.date")}`,
          titleClass: "px-1",
          dataClass: "px-1 text-muted",
          width: "15%",
          callback: (value) => this.formatDateTime(value, false),
        },
        {
          name: "contact_name",
          title: `${this.$t("forms.client")}`,
          titleClass: "px-1",
          dataClass: "px-1",
          width: "12%",
          // callback: this.nameFriendly,
        },
        {
          name: "payment_method",
          title: `${this.$t("forms.payment")}`,
          titleClass: "px-1",
          dataClass: "px-1",
          width: "10%",
          callback: (value) =>
            parseInt(value) === 1
              ? "💰 " + this.$t("pages.cash-on-delivery")
              : "💳 " + this.$t("pages.payment-gateway"),
        },
        {
          name: "delivery_time",
          title: `${this.$t("forms.arrivals")}`,
          titleClass: "px-1",
          dataClass: "px-1",
          width: "15%",
          callback: (value) => this.formatDateTime(value, true),
        },
        {
          name: "__slot:price",
          title: `${this.$t("forms.total")}`,
          titleClass: "px-1",
          dataClass: "px-1",
          width: "13%",
        },
        {
          name: "is_pickup",
          title: `${this.$t("tables.order-type")}`,
          titleClass: "px-1",
          dataClass: "px-1 xx-small",
          width: "10%",
          callback: this.orderType,
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right px-2",
          dataClass: "center aligned text-right px-2",
          width: "30%",
        },
      ],
    };
  },
  async created() {
    await this.fetchData(); // fetch the initial table data
    this.calculatePagination(); // calculate the pagination properties
  },
  watch: {
    currentPage: function (val) {
      this.fetchData();
    },
    perPage: function (val) {
      this.fetchData();
    },
    _changeOrderStatus: function (val) {
      this.$notify(
        "success",
        "Order Status has been changed successfuly",
        null,
        { duration: 5000, permanent: false }
      );
      this.fetchData();
      this.$refs["modalright"].hide();
      this.procced_order = null;
      this.newState = null;
    },
    _changeOrderStatusErr: function (val) {
      this.$notify("warning", "Some thing went wrong", null, {
        duration: 5000,
        permanent: false,
      });
      this.$refs["modalright"].hide();
      this.procced_order = null;
      this.newState = null;
    },
  },
  computed: {
    ...mapGetters(["_changeOrderStatus", "_changeOrderStatusErr"]),
  },
  methods: {
    ...mapActions(["changeOrderStatus"]),
    async fetchData() {
      // fetch the table data using your API or database driver
      const limit = this.perPage;
      const offset = (this.currentPage - 1) * this.perPage;
      const response = await axios.get(
        `/orders?offset=${offset}&limit=${limit}&title=&name=&order_key=&orderBy[]=updated_at&orderBy[]=DESC&status_id[]=0`
      );

      this.items = response.data.data;
      console.log(this.items);
      this.calculation();
      this.$refs.vuetable.setData(this.items);
      this.totalItems = response.data.total;
    },
    changePageSize(perPage) {
      this.perPage = perPage;
      this.fetchData();
    },
    orderType(value) {
      return value == 0
        ? `<p class='font-weight-bold color-theme-1'>
   <i style='font-size:18px' class='iconsminds-motorcycle'>
   </i> ${this.$t("pages.on-delivery")}
   </p>`
        : `<p class='font-weight-bold color-theme-5'>
   <i style='font-size:18px'  class='iconsminds-men'>
   </i> ${this.$t("pages.is-pickup")}
   </p>`;
    },
    formatDateTime(date, withDay = false) {
      if (isNaN(Date.parse(date.replace(/-/g, "/")))) {
        return null;
      }
      let options = {
        weekday: "short",
        year: "2-digit",
        month: "short",
        day: "numeric",
      };
      let today = new Date(date.replace(/-/g, "/"));
      let o = new Intl.DateTimeFormat("en", {
        timeStyle: "short",
        dateStyle: "short",
        hour12: false,
      });
      return withDay
        ? today.toLocaleDateString(
            this.$i18n.locale === "en" ? "en-US" : "ar-EG",
            options
          )
        : o.format(today);
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
    open_details() {},
    detailsForm(data) {
      this.$router.push(`${adminRoot}/orders/details/${data.id}`);
    },
    change_order_state(val) {
      console.log(this.procced_order, val);
      this.changeOrderStatus({ order_id: this.procced_order.id, status: val });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    updateFormModel(rawData) {
      this.procced_order = rawData;
      this.$refs["modalright"].show();
    },
    calculation() {
      this.from = (this.currentPage - 1) * this.perPage;
      this.to = this.from + this.perPage;
    },
  },
};
</script>
<style scoped>
.modal_body {
}
</style>
