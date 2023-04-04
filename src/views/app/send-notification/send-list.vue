<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1 class="text-uppercase font-weight-bold">Send Notification</h1>
        <div class="top-right-button-container">
          <b-button
            variant="primary"
            size="lg"
            class="top-right-button"
            @click="add_New()"
            >Send Notification</b-button
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
          :data-manager="dataManager"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fields"
        >
          <template slot="image" slot-scope="props">
            <ThumbnailImage
              rounded
              small
              :src="
                props.rowData.image_webp === ''
                  ? props.rowData.image
                  : `${props.rowData.image_baseurl}/small/${props.rowData.image_webp}`
              "
              class-name=""
            />
          </template>
          <template slot="active" slot-scope="props">
            <div @click="change_active(props.rowData)">
              <switches
                v-model="props.rowData.active"
                theme="custom"
                color="primary"
                class="vue-switcher-small"
              ></switches>
            </div>
          </template>
          <template slot="action" slot-scope="props">
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
                    class="d-flex align-items-center text-white px-2"
                    v-b-modal.modalright
                  >
                    <i
                      style="font-size: 20px"
                      class="iconsminds-gear-2 d-flex"
                    ></i>
                    <span for="edit" class="p-2 font-weight-bold">Show</span>
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

            <!-- modal for delete row -->
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
      </b-colxx>
    </b-row>
    <b-modal
      id="modalright"
      ref="modalright"
      title="Notification Details"
      modal-class="modal-right"
    >
      <!-- {{ props.rowData.locales.en.description }},
              {{ props.rowData.locales.ar.description }} -->
      <template slot="modal-footer">
        <!-- <b-button variant="primary" @click="somethingModal('modalright')" class="mr-1">Do Something</b-button> -->
        <b-button variant="secondary" @click="hideModal('modalright')"
          >Cancel</b-button
        >
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import { adminRoot } from "../../../constants/config";
import { BIconGearFill } from "bootstrap-vue";
import Switches from "vue-switches";
import ThumbnailImage from "../../../components/Cards/ThumbnailImage";

export default {
  components: {
    vuetable: Vuetable,
    "b-icon-gear-fill": BIconGearFill,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    switches: Switches,
    ThumbnailImage,
  },
  data() {
    return {
      isLoad: false,
      currentPage: 1, // current page number
      perPage: 12, // number of items per page
      totalItems: 0, // total number of items
      pageSizes: [12, 18, 25],
      from: 0,
      showTooltip: false,
      dir: null,
      order_by: null,
      to: 0,
      fields: [
        {
          name: "__slot:image",
          title: "Image",
          // titleClass: "center aligned text-right",
          // dataClass: "center aligned text-right",
          width: "20%",
        },
        {
          name: "locales",
          title: "Ar title",
          titleClass: "",
          width: "20%",
          callback: (value) => {
            return value.ar.title;
          },
        },
        {
          name: "locales",
          title: "En title",
          titleClass: "",
          width: "20%",
          callback: (value) => {
            return value.en.title;
          },
        },
        {
          name: "created_at",
          sortField: "created_at",
          title: "Created at",
          titleClass: "",
          width: "20%",
        },

        {
          name: "__slot:active",
          title: "Active",
          sortField: "created_at",
          // titleClass: "center aligned text-right",
          // dataClass: "center aligned text-right",
          width: "20%",
        },
        {
          name: "__slot:action",
          title: "",
          sortField: "created_at",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%",
        },
      ],
    };
  },
  created() {
    this.getSentNotification({
      keyword: null,
      dir: null,
      order_by: null,
      offset: 0,
      limit: 12,
    });
  },
  methods: {
    ...mapActions("notification", [
      "getSentNotification",
      "update_notif",
      "deleteNotif",
    ]),
    add_New() {
      this.$router.push(`${adminRoot}/send-notification/send`);
    },

    fetchData() {
      // fetch the table data using your API or database driver
      const limit = this.perPage;
      const offset = (this.currentPage - 1) * this.perPage;
      this.getSentNotification({
        keyword: null,
        dir: this.dir,
        order_by: this.order_by,
        offset: offset,
        limit: limit,
      });
    },
    calculation() {
      this.from = (this.currentPage - 1) * this.perPage;
      this.to = this.from + this.perPage;
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    dataManager(sortOrder, pagination) {
      const limit = this.perPage;
      const offset = (this.currentPage - 1) * this.perPage;
      if (sortOrder.length > 0) {
        if (sortOrder[0].direction == "asc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          this.getSentNotification({
            keyword: null,
            offset: offset,
            limit: limit,
            dir: this.dir,
            order_by: this.order_by,
          });
        }
        if (sortOrder[0].direction == "desc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "DESC";

          this.getSentNotification({
            keyword: null,
            dir: this.dir,
            order_by: this.order_by,
            offset: offset,
            limit: limit,
          });
        }
      }
    },
    changePageSize(perPage) {
      this.perPage = perPage;
    },
    change_active(val) {
      console.log(val);
      this.update_notif({
        active: val.active,
        id: val.id,
      });
    },
    deleteItem(id) {
      this.deleteNotif({ id: id });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
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
      this.getSentNotification({
        keyword: val,
        offset: null,
        dir: null,
        order_by: null,
        limit: null,
      });
    },
  },
  computed: {
    ...mapGetters("notification", [
      "_sent_notifi",
      "_deleted_success",
      "_deleted_wrong",
      "_update_notif_er",
      "_update_notif_su",
    ]),
  },
  watch: {
    _sent_notifi: function (notif) {
      console.log(notif);
      this.$refs.vuetable.setData(notif.data);
      this.totalItems = notif.total;
      this.calculation();
    },
    _update_notif_su: function (val) {
      this.$notify("success", "Updateed Successfully", "", {
        duration: 4000,
        permanent: false,
      });
      this.getSentNotification({
        keyword: null,
        offset: 0,
        dir: null,
        order_by: null,
        limit: 12,
      });
    },
    _update_notif_er: function (val) {
      console.log('_update_notif_er', val)
      this.$notify(
        "warning",
        "Something went wrong",
        "please try again Later",
        null,
        { duration: 5000, permanent: false }
      );
      this.getSentNotification({
        keyword: null,
        offset: 0,
        dir: null,
        order_by: null,
        limit: 12,
      });
    },
    _deleted_success: function (val) {
      this.$notify("success", "Notification created Successfuly", "", {
        duration: 4000,
        permanent: false,
      });
      this.$refs["modallg"].hide();
      this.getSentNotification({
        keyword: null,
        offset: 0,
        dir: null,
        order_by: null,
        limit: 12,
      });
    },
    _deleted_wrong: function (val) {
      this.$notify(
        "warning",
        "Something went wrong",
        "please try again Later",
        null,
        { duration: 5000, permanent: false }
      );
      this.$refs["modallg"].hide();
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
<style scoped>
.tooltip {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}
.usage_limit {
  font-weight: bold;
  color: #c1160f;
}
.usage_left_class {
  font-weight: bold;
  color: #000;
}
.tooltip::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.tooltip.show {
  opacity: 1;
}
</style>
