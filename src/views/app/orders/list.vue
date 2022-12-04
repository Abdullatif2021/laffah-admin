<template>
  <div>
    <div
      v-if="tabs.length===0"
      class="loading"></div>
    <b-row align-h="between">
      <b-colxx xxs="6">
        <h1 class="text-uppercase font-weight-bold">{{ title }}</h1>
        <piaf-breadcrumb/>
      </b-colxx>
      <b-colxx xxs="6">
        <b-form-group
          v-if="false"
          label="View By Type"
          label-cols="6"
          content-cols="6"
          class="d-flex justify-content-end"
          v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            v-model="rfq"
            :options="options"
            :aria-describedby="ariaDescribedby"
            name="rfq-toggle"
            buttons></b-form-radio-group>
        </b-form-group>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-row>
          <b-colxx
            xxs="12"
            xs="12"
            lg="12"
            class="mb-3">
            <b-card
              class="mb-4"
              no-body>
              <b-tabs
                class="custom-tab"
                v-if="rfq===''"
                v-model="tabIndex"
                card
                fade
                fill
                lazy>
                <b-tab
                  v-for="(i,index) in tabs"
                  :key="'tab-' +index "
                  lazy
                  title-item-class="w-14">
                  <template #title>
                    <b-spinner
                      v-if="false"
                      type="grow"
                      small></b-spinner>
                    <strong>{{
                        i.title === 'IN_WAITING' ? 'WAITING PAYMENT GATEWAY' : i.title.replace('_', ' ')
                      }}</strong>
                    <small class="mx-1">
                      <b-badge pill>{{ i.total > 0 ? i.total : '0' }}</b-badge>
                    </small>
                  </template>
                  <divided-table
                    :ref="i.title"
                    :key="i.total"
                    :fields="fields"
                    :has-modal="activateModal"
                    :api-mode="true"
                    :append-params="{...queryParams,...i.urlParams}"
                    :has-add-button="tabIndex!==0?true:false"
                    :modal-data="modalData"
                    :model-url="apiBase">
                    <template slot="updateOrderStatus" slot-scope="props">
                      <update-order-status
                        :data="props.rowData"
                        :apiBase="apiBase"
                        :orderStatuses="statuses">
                      </update-order-status>
                    </template>
                    <template slot="features" slot-scope="props">
                      <b-badge
                        pill
                        variant="outline-primary"
                        v-if="props.rowData.promotion && props.rowData.promotion.id">
                        {{ $t('tables.promotion') }}: {{ props.rowData.promotion.code }}
                      </b-badge>
                      <b-badge
                        pill
                        variant="outline-primary"
                        v-else>{{ $t('tables.no-discounts') }}
                      </b-badge>
                    </template>
                    <template slot="date" slot-scope="props">
                      <h6>{{ getOnlyDate(props.rowData.entry_date) }}</h6>
                    </template>
                    <template slot="total" slot-scope="props">
                      <h6>{{ getFormatNum(props.rowData.total, 2) }} {{ $t("tables.aed") }}</h6>
                    </template>
                    <template slot="events" slot-scope="props">
                      <b-row
                        align-h="around"
                        class="pr-1 align-items-center">
                        <b-link
                          v-if="props.rowData.payment_method==='1'||tabIndex>0"
                          :disabled="selectedItems.includes(props.rowData.id)">
                          <update-order-status
                            :data="props.rowData"
                            :action="onValidateFormSubmit"/>
                          <b-icon-gear-fill
                            @click.prevent="updateFormModel(props)"
                            font-scale="2"
                            aria-hidden="true"
                            :animation="selectedItems.includes(props.rowData.id)?'spin':''"/>
                        </b-link>
                        <b-link>
                          <b-icon-exclamation-circle-fill
                            @click.prevent="detailsForm(props.rowData)"
                            font-scale="2"
                            aria-hidden="true"/>
                        </b-link>
                        <b-icon
                          :id="`refund-icon-${props.rowData.id}`"
                          v-if="props.rowData.refund_request===1"
                          icon="circle-fill"
                          variant="danger"
                          font-scale="1"/>
                        <b-tooltip
                          :target="`refund-icon-${props.rowData.id}`"
                          triggers="hover">
                          Go to item <b>page</b> content!
                        </b-tooltip>
                      </b-row>
                    </template>
                  </divided-table>
                </b-tab>
              </b-tabs>
              <b-container v-else>
                <divided-table
                  ref="rfq"
                  :key="dataByStatus[9].total"
                  :fields="fields"
                  :has-modal="activateModal"
                  :disabled="false"
                  :api-mode="false"
                  :has-add-button="false"
                  :modal-data="modalData"
                  :data-list="dataByStatus[9].data">
                  <template slot="updateOrderStatus" slot-scope="props">
                    <update-order-status
                      :data="props.rowData"
                      :apiBase="apiBase"
                      :orderStatuses="statuses">
                    </update-order-status>
                  </template>
                  <template slot="features" slot-scope="props">
                    <small>
                      <b-badge
                        pill
                        variant="outline-primary"
                        v-if="props.rowData.promotion && props.rowData.promotion.id">
                        {{ $t('tables.promotion') }}: {{ props.rowData.promotion.code }}
                      </b-badge>
                      <b-badge
                        pill
                        variant="outline-primary"
                        v-else>{{ $t('tables.no-discounts') }}
                      </b-badge>
                    </small>
                  </template>
                  <template slot="total" slot-scope="props">
                    <h6>{{ getFormatNum(props.rowData.total, 2) }} {{ $t("tables.aed") }}</h6>
                  </template>
                  <template slot="events" slot-scope="props" @click="">
                    <b-row
                      align-h="around"
                      class="pr-1">
                      <b-link>
                        <b-icon-exclamation-circle-fill
                          @click.prevent="detailsForm(props.rowData)"
                          class="h4"
                          aria-hidden="true"/>
                      </b-link>
                    </b-row>
                  </template>
                </divided-table>
              </b-container>
            </b-card>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapGetters, mapActions} from 'vuex';
import DividedTable from "@/views/app/items/DividedTable";
import UpdateOrderStatus from "@/views/app/orders/UpdateOrderStatus";
import {BIconExclamationCircleFill, BIconGearFill, BIconCircleFill, BootstrapVueIcons} from "bootstrap-vue";
// import VueFormGenerator from "vue-form-generator";
// import 'vue-form-generator/dist/vfg.css'

Vue.use(BootstrapVueIcons)
export default {
  name: 'Orders',
  components: {
    'divided-table': DividedTable,
    "update-order-status": UpdateOrderStatus,
    'b-icon-gear-fill': BIconGearFill,
    'b-icon-exclamation-circle-fill': BIconExclamationCircleFill,
  },
  data() {
    return {
      isLoad: false,
      tabIndex: 1,
      rfq: '',
      options: [
        {text: 'All', value: '', checked: true},
        {text: 'RFQ', value: 'rfq'}
      ],
      selected: [], // Must be an array reference!
      apiBase: 'orders',
      queryParams: {
        orderBy: ['updated_at', 'DESC']
      },
      modalTitle: undefined,
      activateModal: false,
      sort: "",
      page: 1,
      perPage: 4,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      selectedItems: [],
      title: this.$t('menu.orders'),
      fields: [{
        name: "order_key",
        title: "Key",
        titleClass: "px-2",
        dataClass: "px-2 font-weight-bold",
        width: "15%"
      },
        {
          name: "entry_date",
          title: `${this.$t('forms.date')}`,
          titleClass: "px-1",
          dataClass: "px-1 text-muted",
          width: "15%",
          callback: (value) => this.formatDateTime(value, false)
        },
        {
          name: "contact_name",
          title: `${this.$t('forms.client')}`,
          titleClass: "px-1",
          dataClass: "px-1",
          width: "12%",
          callback: this.nameFriendly
        },
        {
          name: "payment_method",
          title: `${this.$t('forms.payment')}`,
          titleClass: "px-1",
          dataClass: "px-1",
          width: "10%",
          callback: (value) => parseInt(value) === 1 ? '💰 ' + this.$t("pages.cash-on-delivery") : '💳 ' + this.$t("pages.payment-gateway")
        },
        {
          name: "delivery_time",
          title: `${this.$t('forms.arrivals')}`,
          titleClass: "px-1",
          dataClass: "px-1",
          width: "15%",
          callback: (value) => this.formatDateTime(value, true)
        },
        {
          name: "__slot:price",
          title: `${this.$t('forms.total')}`,
          titleClass: "px-1",
          dataClass: "px-1",
          width: "13%"
        },
        {
          name: "is_pickup",
          title: `${this.$t('tables.order-type')}`,
          titleClass: "px-1",
          dataClass: "px-1 xx-small",
          width: "10%",
          callback: this.orderType
        },
        {
          name: "__slot:events",
          title: "",
          titleClass: "center aligned text-right px-2",
          dataClass: "center aligned text-right px-2",
          width: "30%"
        },
      ],
      selected_tab_name: this.$t('menu.pending')
    };
  },
  computed: {
    ...mapGetters('orders', {
      statuses: 'getStatusesForTabs',
    }),
    modalData: ({
                  schema,
                  initData,
                  modalTitle,
                  onValidateBatchFormSubmit
                }) => {
      return {
        'schema': schema,
        'title': modalTitle,
        'action': onValidateBatchFormSubmit,
        'initData': initData,
        'isNewModel': false
      }
    },
    /*schema: function ({statuses, tabIndex}) {
      let values = []
      if (statuses !== null) {
        values = statuses
          .map((s, i) => ({name: s.title, value: String(s.id)})).filter((x, i) => i < 8)
      }
      let fields = []
      if (tabIndex === 0) {
        fields = [
          {
            type: "input",
            inputType: "number",
            label: "Bank Transfer",
            model: "payment_reference",
            required: true,
            placeholder: "Transaction Reference Number",
            validator: VueFormGenerator.validators.number
          }
        ]
      } else {
        fields = [
          {
            type: "radios",
            label: "Update Status",
            model: "status",
            values: values
          }
        ]
      }
      return {
        fields: fields
      };
    },*/
    tabs({statuses}) {
      let sts = []
      if (statuses !== null && statuses.length > 8) {
        sts = statuses
        // sts[4].urlParams += `&${sts[5].urlParams}`
        sts[4].urlParams = {status_id: [...sts[4].urlParams.status_id, ...sts[5].urlParams.status_id]}
        sts[4].count += sts[5].count
        sts.splice(5, 1)
        // sts[6].urlParams += `&${sts[7].urlParams}`
        sts[6].urlParams = {status_id: [...sts[6].urlParams.status_id, ...sts[7].urlParams.status_id]}
        sts[6].count += sts[7].count
        sts.splice(7, 1)
        sts.splice(3, 2)
      }
      return sts
    },
  },
  methods: {
    orderType(value) {
      return value == 0 ?
        `<p class='font-weight-bold color-theme-1'>
   <i style='font-size:18px' class='iconsminds-motorcycle'>
   </i> ${this.$t("pages.on-delivery")}
   </p>` :
        `<p class='font-weight-bold color-theme-5'>
   <i style='font-size:18px'  class='iconsminds-men'>
   </i> ${this.$t("pages.is-pickup")}
   </p>`
    },
    ...mapActions('orders', ['loadStatusCount']),
    ...mapActions({loadOrderStatuses: 'orders/loadStatuses',}),
    ...mapActions(['handleSubmit',]),
    formatDateTime(date, withDay = false) {
      if (isNaN(Date.parse(date.replace(/-/g, '/')))) {
        return null
      }
      let options = {weekday: 'short', year: '2-digit', month: 'short', day: 'numeric'};
      let today = new Date(date.replace(/-/g, '/'));
      let o = new Intl.DateTimeFormat("en", {timeStyle: "short", dateStyle: "short", hour12: false});
      return withDay ? today.toLocaleDateString(this.$i18n.locale === 'en' ? "en-US" : 'ar-EG', options) :
        o.format(today)
    },
    getFormatNum(num, digits) {
      let Num = Number(num)
      return Num.toFixed(digits)
    },
    updateFormModel(rawData) {
      this.$bvModal.show(`status-${rawData.rowData.id}`)
    },
    detailsForm(data) {
      this.$router.push(`details/${data.id}`)
    },
    initData(data) {
      let order = {
        id: '',
        status: ''
      }
      if (data) {
        order = data
      }
      this.modalData.isNewModel = true
      this.order = order
    },
    onValidateFormSubmit: function (data) {
      let {selectedItems, tabs, tabIndex} = this
      let url = 'orders/updatestatus'
      if (data.id) {
        this.selectedItems.push(data.id)
        let formData = new FormData();
        let ids = data.id
        formData.append('_method', 'PUT');
        if (this.tabIndex === 0) {
          url = 'payments/edit-reference-number'
          formData.append('payment_reference', data.payment_reference);
        } else {
          formData.append('status', data.status);
          formData.append('rejection_reason', data.rejection_reason);
        }
        this.handleSubmit({
          url: `${url}/${ids}`,
          obj: formData
        }).then(response => {
          selectedItems.splice(selectedItems.indexOf(data.id), 1);
          let ref = this.statuses[this.tabIndex].title
          this.$refs[ref][0].$refs.vuetable.refresh()
          this.loadStatusCount()
        }).catch(err => {
          selectedItems.splice(selectedItems.indexOf(data.id), 1);
          let ref = this.statuses[this.tabIndex].title
          this.$refs[ref][0].$refs.vuetable.refresh()
          this.loadStatusCount()
        })
      }
      this.modalData.title = undefined
      this.$bvModal.hide('modalright')
    },
  },
  watch: {
    tabIndex(val, oldVal) {
      if (val !== oldVal) {
        this.loadStatusCount()
      }
    }
  },
  async mounted() {
    await this.loadStatusCount().then(r => {
      this.tabIndex++
    });
    this.loadOrderStatuses()
  }
};
</script>

<style lang="scss" scoped>
/* /deep/ .nav-tabs
.nav-link.active::before,
.nav-tabs .nav-item.show .nav-link::before {
  left: unset;
  width: 5px;
  height: 100%;
  right: 0;
} */
@media(max-width: 1200px) {
  /deep/ .custom-tab strong {
    font-size: 12px;
  }
}

/deep/ .w-14 {
  width: 14.28%;

  a {
    padding-left: 2px;
    padding-right: 2px;
    display: flex;
    justify-content: center;
  }
}

/deep/ .xx-small {
  font-size: xx-small !important;
}

/deep/ .top-right-button-container {
  display: none;
}
</style>