<template>
  <div>
    <grid-heading
      :title="title"
      v-if="show_heading"
      :selectAll="selectAll"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :from="from"
      :to="to"
      :total="total"
      :perPage="perPage"
      :addRow="addRow"
      :attachType="attachType"
      :item-actions="itemActions"
      :id="id"
      :with-breadcrumb="withBreadcrumb"
      :apiBase="apiBase"
      :addNew="addNew"
    />
    <b-row>
      <b-colxx v-if="isLoad" xxs="12">
        <vuetable
          ref="vuetable"
          class="table-divided order-with-arrow"
          :api-mode="false"
          :fields="fieldsNames"
          :per-page="perPage"
          :addMeta="addMeta"
          :ddata="ddata"
          :data-manager="dataManager2"
          pagination-path="pagination"
          @vuetable:pagination-data="onPaginationData"
        >
          <template slot="image" slot-scope="props">
            <ThumbnailImage
              v-if="id == undefined"
              rounded
              small
              :src="
                order_index !== undefined
                  ? props.rowData.item.image
                  : `${props.rowData.image_baseurl}/${props.rowData.image_webp}`
              "
              class-name=""
            />
            <ThumbnailImage
              v-else-if="id !== undefined && attachType == 'images'"
              rounded
              small
              :src="props.rowData.path"
              class-name=""
            />
            <ThumbnailImage
              v-else-if="apiBase === 'customizations/groups'"
              rounded
              small
              :alt="props.rowData.locales[$i18n.locale].title"
              :key="props.rowData.image"
              :src="props.rowData.image"
              class-name=""
            />
          </template>
          <template slot="price" slot-scope="props">
            <b-badge pill variant="outline-primary">
              <span>{{
                `${
                  props.rowData.price ||
                  (props.rowData.min_orders || {}).delivery_cost ||
                  0
                } ${$t("pages.aed")}`
              }}</span>
            </b-badge>
          </template>
          <template slot="price2" slot-scope="props">
            <b-badge pill variant="outline-primary">
              <span>{{
                `${props.rowData.min_orders.minimum_orders} ${$t("pages.aed")}`
              }}</span>
            </b-badge>
          </template>
          <template slot="visible" slot-scope="props">
            <b-badge
              pill
              :variant="
                props.rowData.visible == '1'
                  ? 'outline-success'
                  : 'outline-danger'
              "
            >
              <span v-if="props.rowData.visible == '1'">{{
                $t("active")
              }}</span>
              <span v-else-if="props.rowData.visible == '0'">{{
                $t("not-active")
              }}</span>
            </b-badge>
          </template>
          <template slot="from_date" slot-scope="props">
            <h6>{{ getOnlyDate(props.rowData.from_date) }}</h6>
          </template>
          <template slot="total" slot-scope="props">
            <h6>{{ getFormatNum(props.rowData.total, 2) }} {{ $t("aed") }}</h6>
          </template>
          <template slot="date" slot-scope="props">
            <h6>{{ getOnlyDate(props.rowData.entry_date) }}</h6>
          </template>
          <template slot="to_date" slot-scope="props">
            <h6>{{ getOnlyDate(props.rowData.to_date) }}</h6>
          </template>
          <template slot="active" slot-scope="props">
            <b-badge
              pill
              :variant="
                props.rowData.active == '1' ||
                props.rowData.open_delivery == '1'
                  ? 'outline-success'
                  : 'outline-danger'
              "
            >
              <span
                v-if="
                  props.rowData.active == '1' ||
                  props.rowData.open_delivery == '1'
                "
                >{{ $t("active") }}</span
              >
              <span
                v-else-if="
                  props.rowData.active == '0' ||
                  props.rowData.open_delivery == '0'
                "
                >{{ $t("not-active") }}</span
              >
            </b-badge>
          </template>
          <template slot="paymentWay" slot-scope="props">
            <h6 v-if="props.rowData.payment_method == '1'">
              {{ $t("cash-on-delivery") }}
            </h6>
            <h6 v-else-if="props.rowData.payment_method == '2'">
              {{ $t("payment-online") }}
            </h6>
          </template>
          <template slot="areaMinimumOrders" slot-scope="props">
            <h6 v-if="Array.isArray(props.rowData.areaMinimumOrders)">
              {{ props.rowData.areaMinimumOrders }}
            </h6>
          </template>
          <template slot="applicants" slot-scope="props">
            <a
              class="custom-control-icon"
              href="#"
              @click.prevent="showApplicants(props.rowData.id)"
            >
              <b-button size="xs" class="mb-1 btn-shadow" variant="primary"
                >{{ $t("menu.show-applicants") }}
              </b-button>
            </a>
          </template>
          <template slot="cv" slot-scope="props">
            <a
              class="custom-control-icon"
              target="_blank"
              :href="props.rowData.cv"
            >
              <b-button size="xs" class="mb-1 btn-shadow" variant="primary"
                >{{ $t("menu.download-cv") }}
              </b-button>
            </a>
          </template>
          <template slot="orderDetails" slot-scope="props">
            <a
              class="custom-control-icon"
              href="#"
              @click.prevent="orderDetails(props.rowData.id)"
            >
              <b-button size="xs" class="mb-1 btn-shadow" variant="primary"
                >{{ $t("menu.order-details") }}
              </b-button>
            </a>
          </template>
          <template slot="updateOrderStatus" slot-scope="props">
            <UpdateOrderStatus
              :data="props.rowData"
              :apiBase="apiBase"
              :orderStatuses="orderStatus"
            >
            </UpdateOrderStatus>
          </template>
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
                <div class="py-0">
                  <b-link
                    id="edit"
                    class="d-flex align-items-center text-white px-2"
                    @click.prevent="
                      onActionClicked('edit-item', { data: props.rowData })
                    "
                    v-if="
                      addEdit &&
                      !apiBase.includes('customizations') &&
                      !apiBase.includes('metadata') &&
                      !apiBase.includes('areas')
                    "
                  >
                    <i
                      style="font-size: 20px"
                      class="iconsminds-gear-2 d-flex"
                    ></i>
                    <span for="edit" class="p-2 font-weight-bold">{{
                      $t("forms.edit")
                    }}</span>
                  </b-link>
                  <b-link
                    id="edit"
                    class="d-flex align-items-center text-white px-2"
                    v-else-if="apiBase.includes('customizations')"
                    v-b-modal="`modalright_customization_${id}`"
                    @click="itemActions('edit', props.rowData)"
                    ><i
                      style="font-size: 20px"
                      class="iconsminds-gear-2 d-flex"
                    ></i>
                    <span for="edit" class="p-2 font-weight-bold">{{
                      $t("forms.edit")
                    }}</span>
                  </b-link>
                  <b-link
                    id="edit"
                    class="d-flex align-items-center text-white px-2"
                    v-else-if="
                      (apiBase.includes('metadata') ||
                        apiBase.includes('areas')) &&
                      addEdit
                    "
                    @click="onActionClicked('edit-meta', props.rowData)"
                  >
                    <i
                      style="font-size: 20px"
                      class="iconsminds-gear-2 d-flex"
                    ></i>
                    <span for="edit" class="p-2 font-weight-bold">{{
                      $t("forms.edit")
                    }}</span>
                  </b-link>
                  <b-link
                    id="display"
                    class="d-flex align-items-center text-white px-2"
                    v-else-if="addDisplay"
                    @click="onActionClicked('edit-meta', props.rowData)"
                  >
                    <i
                      style="font-size: 20px"
                      class="iconsminds-gear-2 d-flex"
                    ></i>
                    <span for="edit" class="p-2 font-weight-bold">{{
                      $t("forms.display")
                    }}</span>
                  </b-link>
                  <b-link
                    v-else
                    id="edit"
                    class="d-flex align-items-center text-white px-2"
                  >
                    <i
                      style="font-size: 20px"
                      class="iconsminds-gear-2 d-flex"
                    ></i>
                  </b-link>
                </div>
              </template>
              <!--              <b-dropdown-item
                       v-if="addEdit && !apiBase.includes('customizations') && !apiBase.includes('metadata')  && !apiBase.includes('areas')"
                       class=""
                       href="#"
                       @click.prevent="onActionClicked('edit-item', {data:props.rowData})">
                       <i class="iconsminds-quill-3
         color-theme-1"></i><span class="mx-1">{{ $t('forms.edit') }}</span>
                     </b-dropdown-item>-->
              <b-dropdown-item
                href="#"
                v-if="
                  !apiBase.includes('metadata') &&
                  addMeta &&
                  !apiBase.includes('customization')
                "
                @click.prevent="metaData({ data: props.rowData })"
              >
                <i class="simple-icon-puzzle color-theme-1"></i
                ><span class="mx-1">{{ $t("forms.meta") }}</span>
              </b-dropdown-item>
              <b-dropdown-item
                v-if="addAttach"
                class=""
                href="#"
                @click.prevent="addAttachments({ data: props.rowData })"
              >
                <i class="simple-icon-paper-clip color-theme-1"></i
                ><span class="mx-1">{{ $t("forms.attachments") }}</span>
              </b-dropdown-item>
              <b-dropdown-item
                v-if="apiBase === 'customizations/groups' && withBreadcrumb"
                @click="itemActions('view', props.rowData)"
              >
                <b-icon-eye
                  class="h5 m-0 color-theme-1"
                  variant="primary"
                  scale="1"
                />
                <span class="mx-1">{{ $t("forms.display") }}</span>
              </b-dropdown-item>
              <b-dropdown-item
                v-if="apiBase.includes('customizations')"
                v-b-modal="`modalright_customization_${id}`"
                @click="itemActions('edit', props.rowData)"
              >
                <b-icon-pencil
                  class="h5 m-0 color-theme-1"
                  variant="primary"
                  scale="1"
                />
                <span class="mx-1">{{ $t("forms.edit") }}</span>
              </b-dropdown-item>
              <b-dropdown-item
                v-if="
                  (apiBase.includes('metadata') || apiBase.includes('areas')) &&
                  addEdit
                "
                @click="onActionClicked('edit-meta', props.rowData)"
              >
                <i class="iconsminds-quill-3 color-theme-1"></i
                ><span class="mx-1">{{ $t("forms.edit") }}</span>
              </b-dropdown-item>
              <b-dropdown-item
                v-if="apiBase.includes('items')"
                v-b-modal="`modalright_related`"
                @click="setItem(props.rowData, 'related')"
              >
                <b-icon-link45deg class="h5 m-0" variant="primary" scale="1" />
                <span class="mx-1">{{ $t("forms.related-items") }}</span>
              </b-dropdown-item>
              <b-dropdown-item
                v-if="apiBase.includes('items')"
                v-b-modal="`modalright_branches`"
                @click="setItem(props.rowData)"
              >
                <i class="iconsminds-arrow-inside-gap-45 color-theme-1"></i
                ><span class="mx-1">{{
                  $t("forms.branches-availability")
                }}</span>
              </b-dropdown-item>
              <b-dropdown-divider v-if="addDelete"></b-dropdown-divider>
              <b-dropdown-item
                v-if="addDelete"
                title="Delete Item"
                class=""
                v-b-modal="`delete${props.rowData.id}`"
                scale="1.1"
              >
                <i class="simple-icon-trash" />
                <span class="mx-1">{{ $t("delete") }}</span>
              </b-dropdown-item>
            </b-dropdown>
            <b-row align-h="around">
              <!-- <b-icon-shop
                      class="h5 mb-2"
                      v-if="apiBase.includes('items')"
                      v-b-modal="`modalright_branches`"
                      @click="setItem(props.rowData)"
                      variant="primary"
                      scale="1" /> -->
              <!-- <a v-if="addEdit && !apiBase.includes('customizations') && !apiBase.includes('metadata')  && !apiBase.includes('areas')" class="custom-control-icon" href="#" @click.prevent="onActionClicked('edit-item', {data:props.rowData})">
                      <i class="simple-icon-pencil"></i>
                     </a> -->
              <!-- <a v-if="addDelete && authorDelete" title="Delete this Row" class="custom-control-icon" href="#" v-b-modal="`delete${props.rowData.id}`">
                      <i class="simple-icon-trash"></i>
                     </a> -->
            </b-row>
            <!-- modal for update Order status -->

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
        <vuetable-pagination-bootstrap
          class="mt-4"
          ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
        />
      </b-colxx>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-row>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../components/Common/VuetablePaginationBootstrap";
import GridHeading from "../../containers/Grid/GridHeading";
import axios from "axios";
import _ from "lodash";
import ThumbnailImage from "../../components/Cards/ThumbnailImage";
import {
  BIconEye,
  BIconFileEarmarkSpreadsheetFill,
  BIconLink45deg,
  BIconPencil,
  BIconShop,
} from "bootstrap-vue";
import UpdateOrderStatus from "../../views/app/orders/UpdateOrderStatus";
import index_cjs, { mapGetters, mapActions } from "vuex";
import { apiUrl } from "@/constants/config";
import { decrypt } from "@/utils";

export default {
  props: {
    title: {
      type: String,
    },
    fieldsNames: {
      type: Array,
      required: true,
    },
    apiBase: {
      Type: String,
      required: true,
    },
    addRow: {
      type: String,
      default: "",
    },
    type: {
      type: String,
    },
    id: { type: Number },
    attachType: { type: String },
    addNew: {
      type: Boolean,
      default: true,
    },
    addEdit: {
      type: Boolean,
      default: true,
    },
    addDelete: {
      type: Boolean,
      default: true,
    },
    addDisplay: {
      type: Boolean,
      default: false,
    },
    withBreadcrumb: {
      type: Boolean,
      default: true,
    },
    itemActions: {
      type: Function,
    },
    ddata: {},
    orderStatus: { type: Object },
    order_index: { type: Number },
    addMeta: {
      type: Boolean,
      default: false,
    },
    addAttach: {
      type: Boolean,
      default: false,
    },
    show_heading: { type: Boolean, default: true },
    search_val: {
      type: String,
    },
    page_size: {},
  },
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "grid-heading": GridHeading,
    "b-icon-eye": BIconEye,
    "b-icon-pencil": BIconPencil,
    "b-icon-link45deg": BIconLink45deg,
    "b-icon-shop": BIconShop,
    ThumbnailImage,
    UpdateOrderStatus,
  },
  data() {
    //
    return {
      isLoad: false,
      sort: "",
      page: 1,
      perPage: 12,
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      data: [],
      selectedItems: [],
      superAdmin: "?role=superadmin",
      admin: "?role=admin",
      branchAdmin: "?role=branchadmin",
      casher: "?role=casher",
      user: "?role=user",
      search: "",
      itemID: "",
      options: {
        skin: "table",
        sortable: ["read_at"],
        rowClassCallback: function (row) {
          return row.read_at != null || row.read_at != undefined ? "info" : "";
        },
      },
    };
  },
  methods: {
    ...mapActions(["fetchSuperAdmin"]),
    ...mapActions(["fetchAdmin"]),
    ...mapActions(["fetchBranchAdminBranchAdmin"]),
    ...mapActions(["fetchCasher"]),
    ...mapActions(["fetchUser"]),
    getFormatNum(num, digits) {
      let splitNum = num.split(".");
      return splitNum[0] + "." + splitNum[1].substring(0, digits);
    },

    setItem(data, btn) {
      this.$store.commit("item/SET_CurrentItem", data);
      this.$store.commit("item/SET_CurrentItemRelated", []);
      this.$store.commit("item/SET_CurrentItemBatchBranches", []);
      if (btn === "related") {
        this.$store.dispatch("item/getItemRelated");
      } else {
        this.$store.dispatch("item/loadItemBatchBranches");
      }
    },
    getOnlyDate(date) {
      let newDate = new Date(date);
      return (
        newDate.getDate() +
        "-" +
        newDate.getMonth() +
        "-" +
        newDate.getFullYear()
      );
    },
    ///${data.data.attachments[0].id}
    addAttachments(data) {
      //for attachments in blocks
      // console.log("data::: "+JSON.stringify(data.data.attachments[0].id))
      this.$router.push(`../attachments/attachment-list/${data.data.id}`);
    },
    orderDetails(id) {
      // index is index in vuetable row
      // console.log("order id : " + JSON.stringify(id))
      this.$router.push(`order-details/details/${id}`);
    },
    showApplicants(id) {
      this.$router.push(`applicants/applicants-list/${id}`);
    },
    calculatePagination() {
      this.from = (this.page - 1) * this.perPage + 1;
      let tempTo = this.from + this.perPage - 1;
      this.to = tempTo <= this.total ? tempTo : this.total;
      this.lastPage = Number((this.total / this.perPage).toFixed(0));
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    dataManager2(sortOrder, pagination) {
      // console.log("RRR", this.data)

      if (this.data.length < 1) return;

      let local = this.data;
      // console.log(local, 'ddddd')
      if (this.search) {
        //console.log(this.search, 'ssssss')
        // the text should be case insensitive
        let txt = new RegExp(this.search, "i");
        let dataFields = this.fieldsNames
          .map(function (el) {
            return el.name;
          })
          .filter(function (e) {
            return e.search("slot") < 0;
          });
        local = _.filter(this.data, function (item) {
          for (let i = 0; i < dataFields.length; i++) {
            if (dataFields[i] != undefined) {
              let x;
              eval("x=item." + dataFields[i]);
              if (x != null && x != 1) {
                try {
                  if (x.search(txt) >= 0) {
                    // console.log(x)
                    return true;
                  }
                } catch (err) {}
              }
            }
          }
        });
        // local = _.filter(this.data, function (item) {
        //  console.log(item.locales.en.name.search(txt));
        //   return item.locales.en.name.search(txt) >= 0
        // })
      }
      // sortOrder can be empty, so we have to check for that as well
      if (sortOrder.length > 0) {
        // console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        local = _.orderBy(
          local,
          sortOrder[0].sortField,
          sortOrder[0].direction
        );
      }

      pagination = this.$refs.vuetable.makePagination(
        local.length,
        this.perPage
      );
      console.log("pagination:", pagination);
      let from = pagination.from - 1;
      let to = from + this.perPage;
      return {
        pagination: pagination,
        data: _.slice(local, from, to),
      };
    },
    onActionClicked(action, data) {
      //console.log("slot actions: on-click", data.data.locales.en.name);
      // console.log("data type" + data.data.type);
      if (action === "edit-item") {
        if (this.attachType !== undefined) {
          this.$router.push(
            `../${this.addRow}/${this.attachType}/${this.id}/${data.data.id}`
          );
        } else {
          this.$router.push(`${this.addRow}/${data.data.id}`);
        }
      }
      if (action === "edit-meta") {
        this.$emit("editMeta" + "" + "data", data);
      }
    },
    deleteItem(id) {
      //console.log("id item : " + id)
      this.hideModal("modallg");
      this.isLoad = false;

      if (this.id !== undefined && !this.apiBase.includes("customizations")) {
        axios
          .delete(`/${this.apiBase}/${this.id}/${id}`)
          .then((resp) => {
            this.getData();
            this.$notify("success", "Deleted Successfully", null, {
              duration: 5000,
              permanent: false,
            });
          })
          .catch((error) => {
            this.getData();
            this.$notify("error", "Deleted Failed", null, {
              duration: 5000,
              permanent: false,
            });
            console.log(error);
          });
      } else {
        let tempApiBase = this.apiBase;
        if (this.apiBase.includes("?")) {
          tempApiBase = this.apiBase.split("?")[0];
        }
        axios
          .delete(`/${tempApiBase}/${id}`)
          .then((resp) => {
            this.getData();
            this.$notify("success", "Deleted Successfully", null, {
              duration: 5000,
              permanent: false,
            });
          })

          .catch((error) => {
            if (this.apiBase === "users") {
              this.fetchSuperAdmin(this.apiBase + this.superAdmin);
              this.fetchAdmin(this.apiBase + this.admin);
              this.fetchBranchAdmin(this.apiBase + this.branchAdmin);
              this.fetchCasher(this.apiBase + this.casher);
              this.fetchUser(this.apiBase + this.user);
              this.isLoad = true;
            } else {
              this.getData();
            }
            this.$notify("error", "Deleted Failed", "Try again later", {
              duration: 5000,
              permanent: false,
            });
            console.log(error);
          });
      }
    },
    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },

    onChangePage(page) {
      this.page = page;
      this.$refs.vuetable.changePage(page);
    },

    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },

    searchChange(val) {
      this.search = val;
      this.dataManager2(0, 1);
      this.$refs.vuetable.refresh();
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

    onContextMenuAction(action) {
      console.log(
        "context menu item clicked - " + action + ": ",
        this.selectedItems
      );
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    getData() {
      this.isLoad = false;
      if (this.apiBase == "orders") {
        this.isLoad = true;
        this.data = this.ddata;
      } else {
        if (this.type !== undefined) {
          axios
            .get(
              `/${this.apiBase}${this.type}&orderBy[]=created_at&orderBy[]=desc&offset=0&limit=12`
            )
            .then((response) => {
              this.data = response.data.data;
              this.total = response.data.total;
              this.calculatePagination();
              this.isLoad = true;
            })
            .catch((error) => {
              console.log(error);
              this.calculatePagination();
              this.isLoad = true;
            });
        } else {
          //console.log("EEEddd")
          if (this.id !== undefined) {
            axios
              .get(
                this.apiBase.includes("customizations?customization_group_id=")
                  ? `${this.apiBase}&orderBy[]=created_at&orderBy[]=desc`
                  : `${this.apiBase}/${this.id}?&orderBy[]=created_at&orderBy[]=desc`
              )
              .then((response) => {
                //console.log("image attach: "+JSON.stringify(response.data.data));
                this.data = response.data.data;
                this.total = response.data.total;
                this.calculatePagination();
                this.isLoad = true;
              })
              .catch((error) => {
                console.log(error);
                this.calculatePagination();
                this.isLoad = true;
              });
          } else {
            // console.log(this.apiBase, 'this.apiBase')
            axios
              .get(`${this.apiBase}?orderBy[]=created_at&orderBy[]=desc`)
              .then((response) => {
                console.log(response.data);
                // console.log("response.data type : ", response.data.data.type);
                if (this.apiBase.includes("areas")) {
                  let result = response.data.data;
                  // console.log(result[1], 'fff')
                  for (let i = 0; i < result.length; i++) {
                    const minVal = result[i].areaMinimumOrders[0];
                    result[i].min_orders = minVal;
                  }
                  // console.log('areas', result)
                }
                this.data = response.data.data;
                //  console.log("data orders: " + JSON.stringify(this.data))
                this.total = response.data.total;
                this.calculatePagination();
                this.isLoad = true;
              })
              .catch((error) => {
                console.log(error);
                this.calculatePagination();
                this.isLoad = true;
              });
          }
        }
      }
    },
    metaData(data) {
      this.$router.push(`/app/seo/list/${this.apiBase}/${data.data.id}`);
    },
    //   ...mapActions(["fetchStatus"]),
  },
  computed: {
    authorDelete() {
      const userRole = decrypt(localStorage.getItem("userRole"));
      if (userRole == 1) {
        return true;
      } else return false;
    },
    authorAddEdit() {
      const userRole = decrypt(localStorage.getItem("userRole"));
      if (userRole == 1) {
        return true;
      } else return false;
    },
    //  ...mapGetters(["getStatus"]),
  },
  watch: {
    data(newVal, oldVal) {
      // this.$refs.vuetable.refresh();
      if (newVal !== oldVal) {
        //   this.$refs.vuetable.refresh();
      }
    },
    total() {
      this.calculatePagination();
    },
    perPage() {
      this.calculatePagination();
    },
    page() {
      this.calculatePagination();
    },
    "$route.params.slug"() {
      this.getData();
    },
    $props: {
      handler: function (val, oldVal) {
        //console.log('watch', val)
        // this.title = val
      },
      deep: true,
    },
    perPage: function (perPage) {
      this.$emit("perPage", perPage);
    },
    to: function (to) {
      this.$emit("to", to);
    },
    from: function (from) {
      this.$emit("from", from);
    },
    total: function (total) {
      this.$emit("total", total);
    },
    search_val: function (val) {
      this.searchChange(val);
    },
    page_size: function (val) {
      this.changePageSize(val);
    },
    apiBase(val, oldVal) {
      if (val !== oldVal) {
        this.getData();
      }
    },
  },
  created() {
    // this.fetchStatus();
  },

  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
/deep/ .table-divided tbody tr {
  cursor: pointer;
}

i:before {
  margin: 0px !important;
}

/deep/ .dropdown-menu a {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
