<template>
  <b-card :title="$t('dashboards.recent-orders')">
    <b-refresh-button @click="refreshButtonClick" />
    <vue-perfect-scrollbar
      class="scroll dashboard-list-with-thumbs"
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
    >
      <b-table v-if="isLoad" striped :fields="fields" :items="rorders">
        <template #cell(status)="row">
          <b-badge pill v-if="statuses" :class="getStatusById(row.item.status)">
            <b class="text-dark">{{
              getStatusById(row.item.status).replaceAll("_", " ")
            }}</b>
          </b-badge>
        </template>
        <template #cell(actions)="row">
          <b-button
            class="my-0"
            :key="row.item.id"
            size="sm"
            @click="myRowClickHandler(row.item)"
            >Details</b-button
          >
        </template>
      </b-table>
      <template v-else>
        <div class="loading"></div>
      </template>

      <!--    <template v-if="Array.isArray(rorders) && rorders.length > 0">-->
      <!--      <recent-order-item-->
      <!--        v-for="(order,index) in rorders"-->
      <!--        :order="order"-->
      <!--        :detail-path="`${adminRoot}/orders/order-details/details/${order.id}`"-->
      <!--        :key="index"-->
      <!--        :styleItem="{background:colorRecent.includes(order.id)?'#ffeded':''}"-->
      <!--      />-->
      <!--    </template>-->
    </vue-perfect-scrollbar>
  </b-card>
</template>

<script>
import RecentOrderItem from "../../components/Listing/RecentOrderItem";
import { adminRoot } from "../../constants/config";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["rorders", "colorRecent", "isLoad"],
  components: {
    "recent-order-item": RecentOrderItem,
  },
  data() {
    return {
      adminRoot,
      fields: [
        {
          key: "order_key",
          label: "Order",
          class: "text-nowrap align-middle",
        },
        {
          key: "is_pickup",
          label: "Delivery Type",
          class: "align-middle",
          formatter: (value, key, item) => {
            return parseInt(value) === 1 ? "🚗 Pick Up" : "🏍 Delivery";
          },
        },
        {
          key: "qty",
          class: "align-middle",
        },
        {
          key: "branch_name",
          class: "align-middle",
        },
        {
          key: "status",
          class: "align-middle",
        },
        {
          key: "actions",
          label: "",
          class: "align-middlestu",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({ statuses: "orders/getStatuses" }),
    getStatusById({ statuses }) {
      return (id) => (statuses ? statuses[id] : id);
    },
  },
  methods: {
    myRowClickHandler(record, index) {
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      this.$router.push(`${this.adminRoot}/orders/details/${record.id}`);
      // console.log(record); // This will be the item data for the row
    },
    refreshButtonClick() {
      this.$emit("refreshRecent");
      console.log("refreshButtonClick");
    },
  },
};
</script>

<style>
.IN_WAITING {
  background-color: #4840432b !important;
  color: #484043 !important;
}

.PENDING {
  background-color: rgba(20, 0, 255, 0.31) !important;
  color: #1c0af9 !important;
}

.ACCEPTED {
  background-color: #b003444f !important;
  color: #b00344 !important;
}

.IN_PROGRESS {
  background-color: #03b0a061 !important;
  color: #03b0a0 !important;
}

.READY {
  background-color: #ec880882 !important;
  color: #ec8808 !important;
}

.ON_THE_WAY {
  background-color: #b0038d54 !important;
  color: #b0038d !important;
}

.COMPLETED {
  background-color: #05ae4763 !important;
  color: #05ae47 !important;
}

.REJECTED {
  background-color: #ff00004f !important;
  color: red !important;
}

.CANCELED {
  background-color: #f9f50a5e !important;
  color: #b0ae03 !important;
}
</style>
