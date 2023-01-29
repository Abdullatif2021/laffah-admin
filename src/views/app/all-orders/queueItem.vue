<template>
  <b-card v-if="visible" bg-variant="light"
          :class="className">
    <b-row no-gutters class="justify-content-between">
      <!--      <vue-perfect-scrollbar class="h-auto" :settings="{ suppressScrollX: true, wheelPropagation: true }">-->
      <b-card-group v-b-hover="" class="overflow-hidden">
        <!--                <b-row class="flex-row flex-nowrap" style="overflow-x: scroll;white-space: nowrap;">-->
        <div class="items d-inline-flex p-1 flex-nowrap justify-content-between"
             style=" overflow-x: scroll;/*transform: rotate(-90deg);*/">
          <b-card
            style="min-width: 12rem;/*transform: rotate(90deg);*/"
            class="listing-card-container pointer-event text-center mx-1"
            footer-class="px-1"
            no-body>
            <b-card-title class="mb-1 px-2 pt-4 listing-heading" v-line-clamp="2">
              <b-badge variant="outline-secondary">{{ order.order_key }}</b-badge>
            </b-card-title>
            <b-badge
              variant="primary" pill class="position-absolute badge-top-left ">
              {{ order.entry_date }} - {{ order.created_at }}
            </b-badge>
            <b-card-sub-title class="font-weight-bold px-2 mb-0 text-muted">{{
                order.contact_name
              }}
            </b-card-sub-title>
            <b-card-sub-title class="font-weight-medium px-2 mb-1 text-muted">📞{{
                order.contact_phone_number
              }}
            </b-card-sub-title>
            <b-card-text class="px-2">Branch : <span class="text-danger">{{ order.branch_name }}</span>
            </b-card-text>
            <br>
            <b-card-text
              v-if="order.payment_method !== null"
              class="list-item-heading mb-1 px-2 text-nowrap d-flex justify-content-between align-items-center">
              {{
                parseInt(order.payment_method) === 1 ? '💰 ' + $t("pages.cash-on-delivery") : '💳 ' + $t("pages.payment-gateway")
              }}
              <div v-if="order.is_pickup!==null">
                <b-badge variant="muted">{{
                    order.is_pickup === 1 ? $t(`pages.pickup`) : $t('pages.delivery')
                  }}
                </b-badge>
              </div>
            </b-card-text>
            <b-card-text
              v-if="order.qty !== null"
              class="list-item-heading mb-1 px-2 truncate d-flex justify-content-between">{{ $t("pages.qty") }}:
              <kbd>#{{ order.qty }}</kbd>
            </b-card-text>
            <b-card-text
              v-if="order.subtotal !== null"
              class="list-item-heading mb-1 px-2 truncate d-flex justify-content-between">{{
                $t("pages.subTotal")
              }}:
              <b>
                {{ order.total_before_vat }}</b>
            </b-card-text>
            <b-card-text
              v-if="order.vat_value !== null"
              class="list-item-heading mb-1 truncate px-2 d-flex justify-content-between">{{ $t("pages.vat") }}: <b>
              {{ order.vat_value }}</b>
            </b-card-text>
            <br>
            <b-card-text>
              <div class="d-flex justify-content-between px-2">
                {{ $t('pages.delivery_cost') }}: <b> {{ order.delivery_cost }}</b>
              </div>
              <small class="text-muted text-left flex-grow-1 font-weight-lighter">{{
                  order.salik_fee !== null ? '*' + $t('pages.salik') : ''
                }}</small>
            </b-card-text>
            <!--            <div class="w-100 d-flex align-items-center">-->

            <!--              <b-card-body>-->
            <!--                <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }">-->

            <!--                </vue-perfect-scrollbar>-->

            <!--              </b-card-body>-->
            <!--            </div>-->
            <template #footer>
              <h6 class="d-flex mt-auto h-100 justify-content-between"><small>Total:</small> <b>{{ $t('pages.aed') }}
                {{
                  order.total
                }}</b></h6>
            </template>
          </b-card>

          <!--          <div class="d-flex flex-row flex-nowrap overflow-auto">-->
          <b-card
            v-for="(detail,detailIndex) in order.order_details"
            :key="detailIndex"
            :img-src="webpImage((detail||{}).item||{})"
            :img-alt="((detail||{}).item||{}).slug||''"
            img-top
            style="min-width: 12rem;max-width: 15rem;"
            class="text-center h-100 listing-card-container p-3 mx-1"
            footer-class="bg-transparent border-0 mt-auto text-right px-0"
            no-body>
            <b-badge
              variant="dark" pill class="position-absolute badge-top-left font-weight-bolder">
              #{{ detail.qty }}
            </b-badge>
            <b-card-title class="mb-0 red-text">
              {{ detail.item.locales[$i18n.locale].name }}
            </b-card-title>
            <b-card-sub-title class="text-small text-muted">
              <span>{{ $t('pages.price') }}: {{ detail.batch_price }}</span>
              <!--                <span>{{ $t('pages.subTotal') }}: {{ detail.subtotal_with_customization }}</span>-->
            </b-card-sub-title>
            <template
              v-if="Array.isArray(detail.order_details_customization) && detail.order_details_customization.length > 0">
              <b-link @click="toggleCollapse(detail)" size="sm" v-b-toggle="`collapse-${detail.id}`"
                      variant="outline-primary" class="d-flex justify-content-between align-items-center">
                <b-icon :icon="`caret-${collapseToggleList.includes(detail.id)?'down':'right'}-fill`"/>
                <small>{{
                    $t('pages.more')
                  }}
                </small>
                💰{{
                  ((detail || {}).order_details_customization || []).map(x => ((x || {}).added_value || 0)).reduce((a, b) => Number(a) + Number(b), 0).toFixed(2)
                }}
                <small>
                  <b-badge variant="outline-primary">{{ detail.order_details_customization.length }}</b-badge>
                </small>
              </b-link>
              <b-collapse :id="`collapse-${detail.id}`">
                <b-card-text class="py-1 text-muted text-extra-small"
                             v-for="customization in detail.order_details_customization">
                  <div v-if="customization.customization!==null" class="d-flex justify-content-between">
                  <span>{{
                      ((((customization || {}).customization || {}).locales || {})[$i18n.locale] || {}).title || ''
                    }}</span>
                    <span class="text-right">{{ $t('pages.aed') }} {{
                        (customization || {}).added_value || ''
                      }}</span>
                  </div>
                </b-card-text>
              </b-collapse>
            </template>
            <template #footer>
              <em>{{ $t('pages.aed') }} {{ detail.subtotal_with_customization }}</em>
            </template>
          </b-card>
          <!--          </div>-->
        </div>
      </b-card-group>
      <!--      </vue-perfect-scrollbar>-->

      <b-badge variant="default" pill
               class="w-100 position-absolute badge-top-right badge-type d-flex justify-content-between">
        <div>
          Type: {{ order.is_pickup == 0 ? 'Delivery' : 'Pickup' }} |
          {{
            order.is_pickup == 0 ? `Address: ${((order || {}).address || {}).street || ''}-${((order || {}).address || {}).building || ''}-${((order || {}).address || {}).floor || ''}` : ` Created Time: ${order.created_at}`
          }}
        </div>
        <div>
          <b-button size="sm" variant="outline-primary" pill @click="showRejectionMsgOk(order)">
            <span v-if="rejectOrder !== order.id">Reject</span>
            <div
              v-if="rejectOrder === order.id"
              class="spinner d-inline-block"
            >
              <span class="bounce1"></span>
              <span class="bounce2"></span>
              <span class="bounce3"></span>
            </div>
          </b-button>
          <invoice v-show="false" :order="order"/>
          <b-button size="sm" variant="info" class="mt-auto" pill @click="print(order)">
            <span class="simple-icon-printer"/>&nbsp;<span v-if="!printOrder !== order.id">Accept&Print</span>
            <div
              v-if="printOrder === order.id"
              class="spinner d-inline-block"
            >
              <span class="bounce1"></span>
              <span class="bounce2"></span>
              <span class="bounce3"></span>
            </div>
          </b-button>
        </div>
      </b-badge>
      <b-badge variant="default" pill
               class="position-absolute badge-bottom-right d-flex justify-content-end">

      </b-badge>
    </b-row>
    <b-modal
        id="delivery_popup"
        ref="delivery_popup"
        title="Did you print the Order?"
        :no-close-on-backdrop="true"
      >
      <b-form-group label="Choose Delivery">
        <v-select label="fullName" @input="searchOption" v-model="selectedOption" :options="delivery_options" />
      </b-form-group>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          @click="acceptOrder()"
          class="mr-1"
          :disabled="!selectedOption"
          >Yes</b-button
        >
        <b-button variant="secondary" @click="hideModal('delivery_popup')">No</b-button>
      </template>
    </b-modal>
  </b-card>
</template>

<script>
import _ from "lodash"
import {printInvoice} from '@/utils';
import invoice from '@/containers/orders/invoice'
import Invoice from "@/containers/orders/invoice";
import { mapGetters, mapActions } from "vuex";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";



export default {
  name: "queueItem",
  components: {Invoice, 'v-select' : vSelect,},
  props: ['data', 'changeStatus', 'showRejectionMsgOk', 'allStatus', 'className'],
  data() {
    return {
      rejectOrder: null,
      printOrder: null,
      visible: true,
      delivery_options: [],
      selectedOption: null,
      completed: false,
      delivery_selected: false,
      collapseToggleList: []
    }
  },
  computed: {
    ...mapGetters(['_deliveries', '_assigned', 'not_assigned', '_changeOrderStatus', '_changeOrderStatusErr']),

    order: {
      get: function () {
        return this.data
      },
      set: function (newValue) {
        Object.assign(this.data, newValue)
      }
    },
    webpImage: function () {
      return (item) => _.isEmpty(item) ? `${(item || {}).image_baseurl || image}${(item || {}).image_webp || ''}`
        : (item || {}).image || ''
    }
  },
  methods: {
    ...mapActions(['getDeliveries', 'assignToDelivery', 'changeOrderStatus', 'changeQueueCount']),
  myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
},

filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
},
    showMsgOk(order) {

      this.completed = false
      let {completed} = this
      const h = this.$createElement
      // Using HTML string
      const titleVNode = h('div', {domProps: {innerHTML: this.$t('modal.does-order-complete')}})
      // More complex structure
      let messageVNode = ''
      if (completed) {
        messageVNode = h('div', {class: ['foobar']}, [
          h('p', {class: ['text-center']}, [
            ' Order has been',
            h('strong', ' Submitted'),
          ]),
        ])
      } else {
        messageVNode = h('div', {class: ['foobar']}, [
          h('p', {class: ['text-center']}, [h('b-spinner')]),
        ])
      }

      // We must pass the generated VNodes as arrays
      this.$bvModal.msgBoxConfirm([messageVNode], {
        title: [titleVNode],
        buttonSize: 'sm',
        okTitle: 'YES',
        cancelTitle: 'NO',
        cancelVariant: 'outline-secondary',
        centered: true, size: 'sm',
      }).then(value => {
        console.log('i am here', value);
        if (value) {
          let result = this.orderNextStep(order, this.allStatus.find(x => parseInt(x.status_id) === 5), event)
          this.completed = value
        }
      })
        .catch(err => {
          // An error occurred
        })
    },
     acceptOrder(){
      if (this.processed_order.status === 2) {
        this.assignToDelivery({user_id: this.selectedOption.id, order_id: this.processed_order.id});
      }else {
        this.changeOrderStatus({order_id: this.processed_order.id, status: 2})
      }
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },    
    print(order) {
      console.log('this is order from print func', order);
      
      if (parseInt(order.is_pickup) > 0){
        if (parseInt(order.status) < 2) {
        this.changeStatus(order, 2)
        }
        this.showMsgOk(order)
      }else {
        this.getDeliveries({branch_id: order.branch_id})
        this.processed_order = null;
        this.open_delivery_popup(order);
      }
      printInvoice(order)
    },
    open_delivery_popup(order){
      this.processed_order = order;
      this.$refs['delivery_popup'].show();
    },
    toggleCollapse: function (detail) {
      if (this.collapseToggleList.includes(detail.id)) {
        let ind = this.collapseToggleList.findIndex(x => x === detail.id)
        this.collapseToggleList.splice(ind, 1)
      } else {
        this.collapseToggleList.push(detail.id)
      }
    },
    removeOrderFromQueue(order) {
      const localData = JSON.parse(localStorage.getItem('currentOrders'));
      const orderIndex = localData.findIndex(i => i.id == order.id)
      this.visible = false
      localData.splice(orderIndex, 1)
      console.log('local storage has been updated');
      localStorage.setItem('currentOrders', JSON.stringify(localData))
    },
    searchOption(search, loading) {
      if(search != null){
        setTimeout(() => {
          this.delivery_options = this.delivery_options.filter(option => option.name.toLowerCase().includes(search.toLowerCase()))
        }, 1000)
      }
    },
    orderNextStep(order, e) {
      const nextStepID = 6//status to complete
      const localData = JSON.parse(localStorage.getItem('currentOrders'));
      const orderIndex = localData.findIndex(i => i.id == order.id)
      if (parseInt(order.status) !== 6) {
        this.changeStatus(order, nextStepID).then(res => {
          if (nextStepID === 6 && res.status === 200) {
            this.visible = false
            localData.splice(orderIndex, 1)
          } else {
            this.order.status = nextStepID
            localData[orderIndex].status = nextStepID
          }
          console.log('local storage has been updated');
          localStorage.setItem('currentOrders', JSON.stringify(localData))
        })
      }
      e.target.disabled = true
    },
  },
  watch: {
    _deliveries: function(data){
      console.log('from watcher deliveries', data) 
      this.delivery_options = [];
      data.forEach(el => {
        this.delivery_options.push(
          new Object({ 
            name: el.first_name,
            fullName: `${el.first_name} ${el.last_name}`,
            id: el.id
          }) 
        )
      })
    },
    _assigned: function(val){
      console.log('_assign', val);
      this.$notify("success", "Delivery has been assigned successfuly", null, { duration: 5000, permanent: false });
      this.$refs['delivery_popup'].hide();
      this.removeOrderFromQueue(this.processed_order)
      this.changeQueueCount({data: this.processed_order});
      this.processed_order = null;
      
    },
    _changeOrderStatus: function(val){
      this.$notify("success", "Order Status has been changed successfuly", null, { duration: 5000, permanent: false });
      this.assignToDelivery({user_id: this.selectedOption.id, order_id: this.processed_order.id});

    },
    _changeOrderStatusErr: function(val){
      this.$notify("warning", "Some thing went wrong", null, { duration: 5000, permanent: false });
      this.$refs['delivery_popup'].hide();
      this.processed_order = null;
    },
    not_assigned: function(val){
      console.log('not_assign', val);
      this.$notify("warning", "Delivery didn't assigned, Please try again ", null, { duration: 5000, permanent: false });
      this.$refs['delivery_popup'].hide();
      this.processed_order = null;
    }
  }
}
</script>

<style scoped>

/deep/ .badge-type {
  /*top: 45% !important;*/
  /*right: -22px !important;*/
  /*transform: rotate(-90deg);*/
  top: -24px !important;
  right: unset !important;
  font-size: 100%;
}

/deep/ .badge-bottom-right {
  bottom: -20px;
  right: -23px;
}

/deep/ .pointer-event {
  cursor: pointer;
}

/deep/ .order-steps .ps {
  max-height: 116px;
}

/deep/ .order-step {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #efeeee;
}

/deep/ .new-orders .loading {
  position: relative !important;
}

/deep/ .card-scale {
  transform: scale(1.1);
}

/deep/ .new-orders .app-menu-button {
  position: absolute;
  left: 0;
  background: #fff;
  top: 45px;
  padding: 12px 8px 12px 5px;
  border-radius: .2rem;
  color: #8f8f8f;
  box-shadow: -2px 0 5px rgba(0, 0, 0, .04);
  font-size: 15px;
  line-height: 0;
  z-index: 80;
}

/deep/ .border-bottom {
  border-bottom: 1px solid #dad5d5 !important;
}

/deep/ .scroll-area {
  position: relative;
  margin: auto 0px;
  /*width: 200px;*/
  height: auto;
}

/deep/ .items::-webkit-scrollbar {
  width: 12px; /* width of the entire scrollbar */
}

/deep/ .items::-webkit-scrollbar-track {
  background: lightgray; /* color of the tracking area */
}

/deep/ .items::-webkit-scrollbar-thumb {
  background-color: gray; /* color of the scroll thumb */
  border-radius: 50px; /* roundness of the scroll thumb */
  border: 3px solid lightgray; /* creates padding around scroll thumb */
}

/deep/ .items {
  scrollbar-width: thin; /* "auto" or "thin" */
  scrollbar-color: gray lightgray; /* scroll thumb and track */
}
.custom-search .search-input {
  background: red;
}
.custom-search .menu {
  list-style-type: none;
}
</style>
