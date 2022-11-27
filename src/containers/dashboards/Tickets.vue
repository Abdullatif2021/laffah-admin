<template>
  <b-card :title="$t('dashboards.top-selling-items')">
    <vue-perfect-scrollbar
      class="scroll dashboard-list-with-user"
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
    >
      <list-with-user-item
        v-for="(item,index) in topSellingItems"
        :data="item"
        :detail-path="`${adminRoot}/items/item-form/${item.id}`"
        :key="index"
      />
    </vue-perfect-scrollbar>
  </b-card>
</template>
<script>
import ListWithUserItem from "../../components/Listing/ListWithUserItem";
import tickets from "../../data/tickets";
import {
  adminRoot
} from "../../constants/config";
export default {
  props:['topSellingItems'],
  components: {
    "list-with-user-item": ListWithUserItem
  },
  data() {
    return {
      tickets,
      adminRoot
    };
  }
};
</script>
