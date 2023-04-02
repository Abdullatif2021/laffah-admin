<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>USERS</h1>
      <div class="top-right-button-container">
        <b-button
          variant="primary"
          class="top-right-button"
          @click="add_new()"
          >{{ $t("pages.add-new") }}
        </b-button>
      </div>
      <piaf-breadcrumb />
      <div class="mb-2 mt-2">
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
                >{{ size }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-collapse>
      </div>
      <b-tabs
        nav-class="separator-tabs ml-0 mb-5"
        content-class="tab-content"
        :no-fade="true"
      >
        <b-tab
          v-for="(i, index) in tabs"
          :key="'tab-' + index"
          :title="i.title"
          @click="changeTab(i.role)"
        >
          <template v-if="isLoad">
            <vuetable
              ref="vuetable"
              class="table-divided order-with-arrow"
              :data="items"
              :api-mode="false"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fields"
            >
              <template slot="actions" slot-scope="props">
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
                 
                     
                 
                      
                      <b-link
                        id="edit"
                        class="d-flex align-items-center text-white px-2"
                        @click="open_details(props.rowData.id)"
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
                    v-b-modal="`delete${props.rowData.id}`"
                    scale="1.1"
                  >
                    <i class="simple-icon-trash" />
                    <span class="mx-1">{{ $t("delete") }}</span>
                  </b-dropdown-item>
                </b-dropdown>
                <b-modal
                  :id="`delete${props.rowData.id}`"
                  ref="modallg"
                  size="sm"
                  hide-header
                >
                  <h3>{{ $t("are-you-sure-delete") }}</h3>
                  <template slot="modal-footer">
                    <b-button
                      size="xs"
                      variant="danger"
                      @click="deleteItem(props.rowData.id)"
                      class="mr-1"
                      >{{ $t("delete") }}
                    </b-button>
                    <b-button
                      size="xs"
                      variant="light"
                      @click="hideModal('modallg')"
                      >{{ $t("cancel") }}
                    </b-button>
                  </template>
                </b-modal>
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
          </template>
          <template v-else>
            <div class="loading"></div>
          </template>
        </b-tab>
      </b-tabs>
    </b-colxx>
  </b-row>
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
      isLoad: false,
      current_role: "superadmin",
      items: [], // table data
      currentPage: 1, // current page number
      perPage: 12, // number of items per page
      totalItems: 0, // total number of items
      pageSizes: [12, 18, 25],
      from: 0,
      isDelivery: false,
      to: 0,
      fields: [
        {
          name: "first_name",
          title: "First Name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
          callback: this.nameFriendly,
        },
        {
          name: "last_name",
          title: "Last Name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
          callback: this.nameFriendly,
        },
        {
          name: "phone_number",
          title: "Telephone",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
          callback: this.phone,
        },
        {
          name: "email",
          title: "Email",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
          callback: this.email,
        },

        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "10%",
        },
      ],
      tabs: [
        {
          title: this.$t("menu.superadmin"),

          role: "superadmin",
        },
        {
          title: this.$t("menu.admin"),

          role: "admin",
        },
        {
          title: this.$t("menu.branchadmin"),

          role: "branchAdmin",
        },
        {
          title: this.$t("menu.casher"),

          role: "casher",
        },
        {
          title: "Delivery",

          role: "delivery",
        },
        {
          title: this.$t("menu.user"),

          role: "user",
        },
      ],
    };
  },
  async created() {
    await this.fetchData(); // fetch the initial table data
    this.calculatePagination(); // calculate the pagination properties
  },
  methods: {
    async fetchData(val) {
      // fetch the table data using your API or database driver
      const role = this.current_role;
      const limit = this.perPage;
      const offset = (this.currentPage - 1) * this.perPage;
      if(val){

        const response = await axios.get(
          `/users?role=${role}&offset=${offset}&keyword=${val}&limit=${limit}&title=&name=&order_key=&orderBy[]=updated_at&orderBy[]=DESC`
        );
        
        this.items = response.data.data;
              console.log(this.items);
              this.isLoad = true;
              //   this.$refs.vuetable.setData(this.items);
              this.totalItems = response.data.total;
              this.calculation();
      }else {

        const response = await axios.get(
          `/users?role=${role}&offset=${offset}&limit=${limit}&title=&name=&order_key=&orderBy[]=updated_at&orderBy[]=DESC`
        );
        
              this.items = response.data.data;
              console.log(this.items);
              this.isLoad = true;
              //   this.$refs.vuetable.setData(this.items);
              this.totalItems = response.data.total;
              this.calculation();
      }
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
    open_details(val){
        this.$router.push(`users-form/${val}`);
    },
    calculation() {
      this.from = (this.currentPage - 1) * this.perPage;
      this.to = this.from + this.perPage;
    },
    searchChange(val){
      this.fetchData(val)
    },
    add_new(){
      this.isDelivery = true;
      this.$router.push
      ({
          path: `users-form`,
          query: { type: this.current_role }
        });
    },
    changeTab(val) {
      console.log(val);
      if(val === 'delivery')
      {
        this.isDelivery = true;
      }
      this.isLoad = false;
      this.current_role = val;
      this.fetchData();
    },
    changePageSize(perPage) {
      this.perPage = perPage;
      this.fetchData();
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    deleteItem(id) {
        return axios
          .delete(`/users/${id}`)
          .then((resp) => {
            this.fetchData();
            this.$notify("success", "Deleted Successfully", null, {
              duration: 5000,
              permanent: false,
            });
          })
          .catch((error) => {
            this.fetchData();
            this.$notify("error", "Deleted Failed", null, {
              duration: 5000,
              permanent: false,
            });
            console.log(error);
          });
    },
  },
  watch: {
    currentPage: function (val) {
      this.fetchData();
    },
    perPage: function (val) {
      this.fetchData();
    },
  },
};
</script>
