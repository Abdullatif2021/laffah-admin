<template>
  <div class="rounded new-orders">
    <b-container fluid class="position-relative">
      <b-row class=" h-100" :class="{'app-row':!isLoad||pendingOrders.length>0}">
        <b-colxx xxs="12" xl="12">
          <h2 class="text-center">Orders in Queue
            <b-badge pill variant="light">{{viewOrdersManageArray ? viewOrdersManageArray.length : 0 }}
            </b-badge>
          </h2>
          <b-card class="mb-4 bg-transparent shadow-none order-steps " no-body v-if="!isLoadStatus">
            <b-card-body
              v-if="Array.isArray(ordersManageArray) && ordersManageArray.length > 0"
              :key="Array.isArray(ordersManageArray) + ordersManageArray.length"
              class="bg-transparent px-1">
              <queue-item
                class-name="position-relative mb-5"
                v-for="(order,index) in ordersManageArray"
                :key="`item_${index}`"
                :data="order" :all-status="allStatus"
                :show-rejection-msg-ok="showRejectionMsgOk"
                :change-status="changeStatus"
              />
            </b-card-body>
          </b-card>
          <template v-if="isLoadStatus ">
            <div class="loading"></div>
          </template>
        </b-colxx>
      </b-row>
    </b-container>
    <b-card class="mb-4 app-menu " :class="{ 'shown' : isOpen,'main-shown':!this.menuType.includes('main-hidden')}"
            @mouseenter="isMenuOver=true"
            @mouseleave="isMenuOver=false">
      <h2 class="text-center">Recent Orders
        <b-refresh-button v-if="!isLoad" class="p-2" @click="fetchOrders()"/>
        <b-icon v-if="isLoad" icon="arrow-repeat" animation="spin"/>
      </h2>
      <vue-perfect-scrollbar
        class="scroll dashboard-list-with-user"
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <div class="h-100">
          <order-card
            v-if="isManaged(order.id)"
            v-for="order in pendingOrders"
            :key="order.id"
            :order="order"
            :orders-in-progress="ordersInProgress"
            :show-rejection-msg-ok="showRejectionMsgOk"
          />
          <template v-if="isLoad">
            <div class="loading-left loading"></div>
          </template>
        </div>
      </vue-perfect-scrollbar>
    </b-card>
    <a class="app-menu-button d-inline-block d-xl-none" @click.prevent="toggle"><i class="simple-icon-options"/></a>
    <order-modal :orderDetails="order"></order-modal>
    <rejection-modal v-model="rejectionReason" :order-id="rejectOrder" :change-status="changeStatus"
                     :update-queue="updateLocalStorage"/>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import {apiUrl} from "@/constants/config";
import {BootstrapVueIcons} from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue-icons.css'
import orderModal from "./orderModal";
import queueItem from "./queueItem";
import orderCard from "./orderCard";
import {setTimeout} from "timers";
import RejectionModal from "@/views/app/orders/rejectionModal";
import _ from "lodash";
import {mapActions, mapGetters} from "vuex";

// Object.defineProperty(Vue.prototype, '$_', {value: _})
Vue.use(BootstrapVueIcons)
export default {
  name: 'queueOrders',
  components: {
    RejectionModal,
    'order-modal': orderModal,
    'queue-item': queueItem,
    'order-card': orderCard,
  },
  data() {
    return {
      isLoad: false,
      isLoadStatus: false,
      fetchingOrder: null,
      rejectOrder: null,
      apiBase: 'orders',
      apiQueryParams: {
        params: {
          orderBy: ['delivery_time', 'DESC'],
          status_id: [1, 2]
        }
      },
      rejectionReason: '',
      orders: [],
      waitingOrders: [],
      ordersManageArray: JSON.parse(localStorage.getItem('currentOrders')),
      currentPage: 1,
      order: [],
      allStatus: [],
      isOpen: false,
      isMenuOver: false,
      timer: null
    }
  },
  watch: {
    queue: function(val){
      console.log({val});
      this.updateLocalStorage(val, false)
    }
  },
  computed: {
    ...mapGetters({
      menuType: "getMenuType",
      queue: "_queueCount"
    }),
    pendingOrders: ({orders}) => {
      if (Array.isArray(orders) && orders.length > 0) {
        return orders
      }
      return []
    },
    viewOrdersManageArray({ordersManageArray}) {
      if (ordersManageArray) {
        if (ordersManageArray.length > 0) {
          let ids = this.orders.map(x => x.id)
          ordersManageArray.map((x, i) => {
            console.log('watch ordersManageArray', ids.includes(x.id));
            if (ids.includes(x.id)) {
              return x
            } else {
              ordersManageArray.splice(i, 1)
            }
          })
          console.log(ordersManageArray);
          localStorage.setItem('currentOrders', JSON.stringify(ordersManageArray))
          this.ordersManageArray = ordersManageArray
        }
        return ordersManageArray
      }
    }
  },
  methods: {
    ...mapActions(['handleSubmit',]),
    isManaged: function (id) {
      if (!_.isEmpty(this.ordersManageArray)) {
        return !(this.ordersManageArray.map(x => x.id).includes(id))
      }
      return true
    },
    updateLocalStorage(order, isDelete = false) {
      const localData = JSON.parse(localStorage.getItem('currentOrders'));
      const orderIndex = localData.findIndex(i => i.id === order.id)
      if (isDelete) {
        localData.splice(orderIndex, 1)
      } else {
        localData[orderIndex] = order
      }
      this.ordersManageArray = localData
      localStorage.setItem('currentOrders', JSON.stringify(localData))
    },
    showRejectionMsgOk(order) {
      this.rejectOrder = order.id
      this.$bvModal.show('modal-prevent-closing')

      /*let res = false
      const self = this
      const {handleOk} = this
      const h = this.$createElement
      // Using HTML string
      const titleVNode = h('div', {domProps: {innerHTML: this.$t('modal.rejection-reason')}})
      // More complex structure
      const messageVNode = h('div', {class: ['foobar']}, [
        h('b-form', {
          class: ['text-center'],
          ref: 'rejection-form',
          on: {
            submit: function (value) {
              self.rejectionReason = value
            }
          }
        }, [
          h('b-form-textarea', {
            props: {
              id: "rejection-reason",
              value: this.rejectionReason,
              required: true,
              placeholder: this.$t('modal.rejection-reason-placeholder'),
              rows: "3",
              maxRows: "6",
            },
            on: {
              input: function (value) {
                self.rejectionReason = value
              }
            }
          }),
        ]),
        // h('p', {class: ['text-center']}, [h('b-spinner')]),
      ])
      // We must pass the generated VNodes as arrays
      this.$bvModal.msgBoxOk([messageVNode], {
        title: [titleVNode],
        id: 'rejection',
        okTitle: this.$t('modal.submit'),
        centered: true,
      }).then(value => value && this.rejectionReason !== '' ?
        (this.rejectOrder = orderID, this.changeStatus(orderID, 7))
        :
        value
      )*/
    },
    manageOrder(order) {
      // if(this.ordersManageArray.filter(i=>i==order.id) ==undefined){
      //   this.ordersManageArray.push(order)
      // }
      const itemIndex = this.ordersManageArray.findIndex(i => i.id == order.id);
      console.log(order.id, 'itemIndex')
      if (itemIndex == -1) {
        this.ordersManageArray.push(order)
      }
    },
    ordersInProgress(order, e) {
      //here we need to change all pending orders to in progress
      if (Array.isArray(this.pendingOrders) && this.pendingOrders.length > 0) {
        e.target.disabled = true
        // const statusInProgress = this.allStatus.filter(s => s.status_id == 3)
        // order.status = statusInProgress[0].status_value
        // const status = 2
        // order.status = status
        let localData = []
        if (localStorage.getItem('currentOrders') == undefined) {
          localData.push(order)
          localStorage.setItem('currentOrders', JSON.stringify(localData))
        } else {
          localData = JSON.parse(localStorage.getItem('currentOrders'));
          const localDataIDS = localData.map(i => i.id);
          const oIndex = localData.findIndex(x => x.id == order.id);
          if (oIndex == -1) {
            localData.unshift(order)
            localStorage.setItem('currentOrders', JSON.stringify(localData))
          } else {
            console.log('order found ')
          }
          console.log(oIndex, 'oIndex')
        }
        /*this.changeStatus(order.id, status).then(res=>{

        })*/
        this.ordersManageArray = JSON.parse(localStorage.getItem('currentOrders'));

        this.fetchOrders()
        console.log(e, 'e start')
      }

    },
    fetchOrders() {
      this.isLoad = true;
      const {apiQueryParams} = this
      return axios
        .get(`${this.apiBase}`, {...apiQueryParams})
        .then(res => {
          let resultData = res.data.data;
          this.orders = resultData
          this.isLoad = !this.isLoad;
          return res
        }).catch(err => {
          console.log(err);
          return err
        })

    },
    changeStatus(order, statusID) {
      let url = 'orders/updatestatus'
      let orderID = order.id
      let data = {
        status: statusID,
        rejection_reason: this.rejectionReason
      }
      console.log(data);
      return this.handleSubmit({
        url: `${url}/${orderID}`,
        obj: data,
        options: {
          params: {
            _method: 'put'
          }
        }
      }).then(response => {
        if (response.status === 200) {
          order.status = statusID
          this.updateLocalStorage(order, statusID === 6)
          this.rejectionReason = ''
          this.rejectOrder = null
          this.fetchOrders()
          console.log('get new items');
          this.ordersManageArray = JSON.parse(localStorage.getItem('currentOrders'));
          return response
        }
      })
      /*return axios
        .post(`orders/updatestatus/${orderID}`,
          data, {
            params: {
              _method: 'put'
            }
          })
        .then(response => {
          order.status = statusID
          this.updateLocalStorage(order, statusID === 6)
          this.rejectionReason = ''
          this.rejectOrder = null
          this.fetchOrders()
          console.log('get new items');
          this.ordersManageArray = JSON.parse(localStorage.getItem('currentOrders'));
          return response
        }).catch(error => {
          let {response} = error
          if (response && response.status === 422) {
            if (Array.isArray(response.data.data)) {
              Object.keys(response.data.data).map(key => {
                response.data.data[key].map(val => {
                  this.$notify("error", response.data.message, `${key} - ${val}`, {
                    duration: 5000,
                    permanent: false
                  });
                })
              })
            } else {
              this.$notify("error", response.data.message, response.data.data, {
                duration: 5000,
                permanent: false
              });
            }
          }
          // request failed
          // reject(error) // return error to calling function
          return error
        })*/
    },
    toggle() {
      this.isOpen = !this.isOpen
    }

  },
  async mounted() {
    this.isLoadStatus = true
    await this.fetchOrders().then(res => res ? this.timer = setTimeout(() => {
        console.log('new fetch')
        this.fetchOrders();
      }, 60000)
      : null
    ).then(result => this.isLoadStatus = !this.isLoadStatus)
    await axios.get(`orders/getstatuses`).then(res => {
      //this.allStatus = res.data.data;
      console.log(res.data.data, 'res.data.data')
      for (var key in res.data.data) {
        if (key == 4 || key == 5 || key == 6) {
          this.allStatus.push({status_id: key, status_value: res.data.data[key], active: false})
        }
        if (key == 3) {
          this.allStatus.push({status_id: key, status_value: res.data.data[key], active: true})
        }

      }
      // this.isLoadStatus = !this.isLoadStatus
    }).catch(err => {
      console.log(err);
    })

  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
}
</script>
<style>

.new-orders .app-menu .ps-container {
  height: 600px !important;
}

.new-orders .app-menu .ps__rail-y, .new-orders .app-menu.ps__rail-y:hover {
  height: 580px !important;
  width: 6px;
  padding: 0 !important;
}

.new-orders .app-menu .ps__rail-y:hover > .ps__thumb-y, .ps__thumb-y {
  height: 25px !important;
  width: 6px !important;
  cursor: pointer;
}

.app-menu .card-body {
  padding: 10px;
}

.badge-date {
  top: 45% !important;
  left: -60px !important;
  transform: rotate(-90deg);
}

.badge-type {
  /*top: 45% !important;*/
  /*right: -22px !important;*/
  /*transform: rotate(-90deg);*/
  top: -24px !important;
  right: unset !important;
  font-size: 100%;
}

.pointer-event {
  cursor: pointer;
}

.order-steps .ps {
  max-height: 116px;
}

.new-orders .app-row {
  padding-left: 258px;
  padding-right: unset !important;
}

.new-orders .app-menu {
  float: left;
  left: 0;
  right: unset !important;
}

.new-orders .app-menu.main-shown {
  left: 120px !important;
}

.order-step {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #efeeee;
}

.badge-danger {
  background-color: #da1c15;
}

.border-row {
  border: 1px solid #c8040e87;
  border-radius: 10px;
}

.new-orders .loading {
  position: relative !important;
}

.card-scale {
  transform: scale(1.1);
}

@media (max-width: 1199px) {
  .app-row {
    padding-left: 0 !important;
  }

  .app-menu {
    transform: translateX(-280px);
  }

  .app-menu.shown {
    transform: translateX(0);
  }
}

.new-orders .app-menu-button {
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

.border-bottom {
  border-bottom: 1px solid #dad5d5 !important;
}

.new-orders .loading-left {
  border-color: transparent;
}

.app-menu .badge-danger {
  font-size: 0.8rem;
}

.app-menu .scroll > div {
  padding-right: 0.5rem !important;
  padding-left: 0.5rem !important;
}
</style>
