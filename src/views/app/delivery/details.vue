<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>Delivery Details</h1>

        <piaf-breadcrumb />
        <!-- <div v-if="filter" class="mb-2 mt-2">
     
        <b-collapse id="displayOptions" class="d-md-block">
         
          <div class="d-block d-md-inline-block pt-1">
            <b-dropdown
              id="ddown1"
              :text="`${$t('pages.orderby')} ${sort.label}`"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="xs"
            >
              <b-dropdown-item
                v-for="(order,index) in sortOptions"
                :key="index"
                @click="changeOrderBy(order)"
              >{{ order.label }}</b-dropdown-item>
            </b-dropdown>

           
          </div>
         
        </b-collapse>
      </div> -->
        <b-tabs
          nav-class="separator-tabs ml-0 mb-5"
          content-class="tab-content"
          :no-fade="true"
        >
          <b-tab @click="open_ready" title="Ready">
            <b-row>
              <b-colxx>
                <b-card class="mb-4">
                  <b-form>
                    <template v-if="spinner">
                      <b-table
                        :items="records"
                        :fields="column"
                        striped
                        hover
                        :per-page="perPage"
                      >
                        <template #cell(key)="data">
                          <b class="text-info">{{ getKey(data.item) }}</b>
                        </template>
                        <template #cell(client)="data">
                          <b class="text-info">{{ getClient(data.item) }}</b>
                        </template>
                        <template #cell(arrival)="data">
                          <b class="text-info">{{ getArrival(data.item) }}</b>
                        </template>
                        <template #cell(total)="data">
                          <b class="text-info">{{ getTotal(data.item) }}</b>
                        </template>
                        <template #cell(actions)="data">
                          <b class="text-info">
                            <b-dropdown
                              id="ddown2"
                              size="xs"
                              html=" "
                              split
                              split-class="p-0"
                              class=""
                              variant="secondary"
                            >
                              <template #button-content>
                                <div class="py-0">
                                  <b-link
                                    id="edit"
                                    @click="open_order(data.item.order_id)"
                                    class="d-flex align-items-center text-white px-2"
                                  >
                                    <i
                                      style="font-size: 20px"
                                      class="iconsminds-gear-2 d-flex"
                                    ></i>
                                  </b-link>
                                </div>
                              </template>
                              <b-dropdown-item
                                title="Delete Item"
                                class=""
                                @click="
                                  getDeliveryList(
                                    data.item.order.branch_id,
                                    data.item.order_id,
                                    data.item.order.delivery
                                  )
                                "
                                v-b-modal="`modalbasic`"
                                scale="1.1"
                              >
                                <i class="iconsminds-scooter" />
                                <span class="mx-1">Change Delivery</span>
                              </b-dropdown-item>
                            </b-dropdown>
                          </b>
                        </template>
                      </b-table>
                    </template>
                    <template v-else>
                      <div class="loading"></div>
                    </template>
                  </b-form>
                </b-card>
              </b-colxx>
            </b-row>
          </b-tab>
          <b-tab @click="open_completed" title="completed">
            <b-row>
              <b-colxx>
                <b-card class="mb-4">
                  <b-form>
                    <template v-if="spinner">
                      <b-table
                        :items="records"
                        :fields="completed_column"
                        striped
                        hover
                        :per-page="perPage"
                      >
                        <template #cell(key)="data">
                          <b class="text-info">{{ getKey(data.item) }}</b>
                        </template>
                        <template #cell(client)="data">
                          <b class="text-info">{{ getClient(data.item) }}</b>
                        </template>
                        <template #cell(arrival)="data">
                          <b class="text-info">{{ getArrival(data.item) }}</b>
                        </template>
                        <template #cell(rating)="data">
                          <b class="text-info"
                            ><rating :value="4" :ewwe="data.item.rate"></rating
                          ></b>
                        </template>
                        <template #cell(total)="data">
                          <b class="text-info">{{ getTotal(data.item) }}</b>
                        </template>
                        <template #cell(actions)="data">
                          <b class="text-info">
                            <b-dropdown
                              id="ddown2"
                              size="xs"
                              html=" "
                              split
                              split-class="p-0"
                              class=""
                              variant="secondary"
                            >
                              <template #button-content>
                                <div class="py-0">
                                  <b-link
                                    id="edit"
                                    @click="open_order(data.item.order_id)"
                                    class="d-flex align-items-center text-white px-2"
                                  >
                                    <i
                                      style="font-size: 20px"
                                      class="iconsminds-gear-2 d-flex"
                                    ></i>
                                  </b-link>
                                </div>
                              </template>
                              <!-- <b-dropdown-item
                                  title="Delete Item"
                                  class=""
                                  @click="getDeliveryList(data.item.order.branch_id, data.item.order_id, data.item.order.delivery)"
                                  v-b-modal="`modalbasic`"
                                  scale="1.1">
                                  <i class="iconsminds-scooter" /> <span class="mx-1">Change Delivery</span>
                                </b-dropdown-item> -->
                            </b-dropdown>
                          </b>
                        </template>
                      </b-table>
                    </template>
                    <template v-else>
                      <div class="loading"></div>
                    </template>
                  </b-form>
                </b-card>
              </b-colxx>
            </b-row>
          </b-tab>
          <b-tab @click="open_canceled" title="canceled">
            <b-row>
              <b-colxx>
                <b-card class="mb-4">
                  <b-form>
                    <template v-if="spinner">
                      <b-table
                        :items="records"
                        :fields="completed_column"
                        striped
                        hover
                        :per-page="perPage"
                      >
                        <template #cell(key)="data">
                          <b class="text-info">{{ getKey(data.item) }}</b>
                        </template>
                        <template #cell(client)="data">
                          <b class="text-info">{{ getClient(data.item) }}</b>
                        </template>
                        <template #cell(arrival)="data">
                          <b class="text-info">{{ getArrival(data.item) }}</b>
                        </template>
                        <template #cell(rating)="data">
                          <b class="text-info"
                            ><rating :value="4" :ewwe="data.item.rate"></rating
                          ></b>
                        </template>
                        <template #cell(total)="data">
                          <b class="text-info">{{ getTotal(data.item) }}</b>
                        </template>
                        <template #cell(actions)="data">
                          <b class="text-info">
                            <b-dropdown
                              id="ddown2"
                              size="xs"
                              html=" "
                              split
                              split-class="p-0"
                              class=""
                              variant="secondary"
                            >
                              <template #button-content>
                                <div class="py-0">
                                  <b-link
                                    id="edit"
                                    @click="open_order(data.item.order_id)"
                                    class="d-flex align-items-center text-white px-2"
                                  >
                                    <i
                                      style="font-size: 20px"
                                      class="iconsminds-gear-2 d-flex"
                                    ></i>
                                  </b-link>
                                </div>
                              </template>
                              <!-- <b-dropdown-item
                                  title="Delete Item"
                                  class=""
                                  @click="getDeliveryList(data.item.order.branch_id, data.item.order_id, data.item.order.delivery)"
                                  v-b-modal="`modalbasic`"
                                  scale="1.1">
                                  <i class="iconsminds-scooter" /> <span class="mx-1">Change Delivery</span>
                                </b-dropdown-item> -->
                            </b-dropdown>
                          </b>
                        </template>
                      </b-table>
                    </template>
                    <template v-else>
                      <div class="loading"></div>
                    </template>
                  </b-form>
                </b-card>
              </b-colxx>
            </b-row>
          </b-tab>
        </b-tabs>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import { mapGetters, mapActions } from "vuex";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { adminRoot } from "../../../constants/config";
import rating from "../../../components/Listing/rating.vue";

export default {
  components: {
    vuetable: Vuetable,
    "v-select": vSelect,
    rating: rating,
  },
  data() {
    return {
      perPage: 8,
      records: [],
      sort: {
        column: "deliverd",
        label: "All",
      },
      sortOptions: [
        {
          column: "deliverd",
          label: "deliverd",
        },
        {
          column: "undeliverd",
          label: "undeliverd",
        },
      ],
      filter: false,
      test_array: [],
      selectedOption: null,
      spinner: false,
      column: ["key", "client", "arrival", "total", "actions"],
      completed_column: [
        "key",
        "client",
        "arrival",
        "rating",
        "total",
        "actions",
      ],
      delivery_id: null,
      assigned_delivery: null,
      usersForm: {
        branch: [],
      },
      orderID: null,
      delivery_options: [],
      newBranches: [],
    };
  },
  created() {
    this.getDeliveryData({ user_id: this.$route.params.id });
    this.getDeliveryOrders({
      user_id: this.$route.params.id,
      status_id: 4,
    });
    this.fetchBranches();
  },
  methods: {
    ...mapActions([
      "getDeliveryData",
      "getDeliveries",
      "getDeliveryOrders",
      "fetchBranches",
      "updateDeliveryBranches",
      "changeDelivery",
    ]),
    changeBranches() {
      this.updateDeliveryBranches({
        branches: this.usersForm.branch,
        user_id: this.delivery_id,
      });
    },
    open_ready() {
      this.spinner = false;
      this.filter = false;
      this.records = [];
      this.getDeliveryOrders({ user_id: this.$route.params.id, status_id: 4 });
    },
    changeOrderBy(sort) {
      this.sort = sort;
    },
    open_completed() {
      this.spinner = false;
      this.filter = true;
      this.records = [];
      this.getDeliveryOrders({ user_id: this.$route.params.id, status_id: 6 });
    },
    open_canceled() {
      this.spinner = false;
      this.filter = true;
      this.records = [];
      this.getDeliveryOrders({ user_id: this.$route.params.id, status_id: 8 });
    },
    open_order(order_id) {
      console.log(order_id);
      this.$router.push({
        path: `${adminRoot}/orders/details/${order_id}`,
      });
    },
    searchOption(search, loading) {
      if (search != null) {
        setTimeout(() => {
          this.delivery_options = this.delivery_options.filter((option) =>
            option.name.toLowerCase().includes(search.toLowerCase())
          );
        }, 1000);
      }
    },
    somethingModal(selected) {
      this.changeDelivery({ order_id: this.orderID, user_id: selected._id });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    async getDeliveryList(branch_id, order_id, delivery) {
      await this.getDeliveries({ branch_id: branch_id });
      this.assigned_delivery = delivery;
      this.orderID = order_id;
    },
    getKey(val) {
      return val.order.order_key;
    },
    getClient(val) {
      return val.order.contact_name;
    },
    getArrival(val) {
      return val.order.delivery_time;
    },
    getTotal(val) {
      return val.order.total;
    },
  },

  computed: {
    ...mapGetters([
      "_deliveryOrders",
      "getBranches",
      "_change",
      "_delivery",
      "_updateDeliveryBranches",
      "_deliveries",
    ]),
    branches() {
      try {
        this.newBranches = this.getBranches.map((x) => {
          return {
            label: x.locales[this.$i18n.locale].name,
            code: x.id,
          };
        });
        return this.newBranches;
      } catch (err) {
        return this.newBranches;
      }
    },
  },
  watch: {
    _deliveryOrders: function (val) {
      this.records = val;
      this.spinner = true;
    },
    _delivery: function (val) {
      this.delivery_id = val.id;
      this.usersForm.branch = val.branches.map((x) => {
        return x.branch_id;
      });
    },
    _updateDeliveryBranches: function (val) {
      this.$notify(
        "success",
        "Delivery Branches has been Updated Successfully",
        null,
        { duration: 5000, permanent: false }
      );
    },
    assigned_delivery: function (val) {
      this.selectedOption = this.delivery_options.filter((i) => {
        return i._id == val.user_id;
      });
    },
    _deliveries: function (val) {
      this.delivery_options = [];
      this.delivery_options = val.map((el) => ({
        name: el.first_name,
        fullName: `${el.first_name} ${el.last_name}`,
        _id: el.id,
      }));
    },
    _change: function (val) {
      this.$notify(
        "success",
        "Delivery Guy has been Updated Successfully",
        null,
        { duration: 5000, permanent: false }
      );
      this.getDeliveryOrders({ user_id: this.$route.params.id, status_id: 6 });
      this.orderID = null;
      this.$refs["modalbasic"].hide();
    },
  },
};
</script>
