<template>
  <b-card
    :id="order.id"
    class="d-flex flex-column mb-3 border-bottom justify-content-between">
    <b-card-body class="d-flex justify-content-between align-content-start">
      <img
        src="/assets/logos/logo.png"
        :alt="order.name"
        class="img-thumbnail border-0 rounded-circle align-self-center xsmall w-20"
      />
      <div class="pl-3 flex-grow-1">
        <p class=" mb-0 text-uppercase font-weight-bolder">{{ order.contact_name }}</p>
        <p class="text-muted mb-3 text-small ">#{{ order.order_key }}</p>
      </div>
    </b-card-body>
    <b-card-text id="due-date" class="text-danger text-center font-weight-bolder">⏰ {{
        formatDateTime(order.delivery_time)
      }}
    </b-card-text>
    <b-tooltip target="due-date">{{ $t('pages.due') }}</b-tooltip>
    <div class="d-flex justify-content-between align-content-center my-2">
      <b-button variant="outline-success" size="sm" pill @click="showOrderDetails(order,$event)">
        <span v-if="fetchingOrder !== order.id">{{ $t('pages.view') }}</span>
        <div
          v-if="fetchingOrder === order.id"
          class="spinner d-inline-block"
        >
          <span class="bounce1"></span>
          <span class="bounce2"></span>
          <span class="bounce3"></span>
        </div>
      </b-button>
      <b-button size="sm" variant="outline-primary" pill @click="showRejectionMsgOk(order)">
        <span v-if="rejectOrder !== order.id">{{ $t('pages.reject') }}</span>
        <div
          v-if="rejectOrder === order.id"
          class="spinner d-inline-block"
        >
          <span class="bounce1"></span>
          <span class="bounce2"></span>
          <span class="bounce3"></span>
        </div>
      </b-button>
    </div>
  </b-card>
</template>

<script>
import axios from "axios";
import {apiUrl} from "@/constants/config";

export default {
  name: "orderCard",
  props: ['order', 'ordersInProgress', 'showRejectionMsgOk'],
  data() {
    return {
      isLoad: false,
      rejectOrder: null,
      fetchingOrder: null
    }
  },
  methods: {
    formatDateTime(date) {
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: "numeric",
        hour12: true,
        dayPeriod: "short"
      }
      let today = new Date(date.replace(/-/g, '/'));
      let o = new Intl.DateTimeFormat("en", options);
      return o.format(today)
    },
    showOrderDetails(order, event) {
      this.fetchingOrder = order.id
      axios.get(`${apiUrl}orders/${order.id}`).then(res => {
        this.ordersInProgress(res.data.data, event)
        this.fetchingOrder = null
      })
    },
  }
}
</script>

<style scoped>

</style>
