<template>
  <b-card :title="title" >
    <div v-if="Array.isArray(bestData) && bestData.length > 0">
      <vuetable
        ref="vuetable"
        :api-mode="false"
        :fields="bestsellers.fields"
        :data="bestData"
        :per-page="perPage"
        :from="from"
        :to="to"
        :total="bestData.length"
        :perPage="perPage"
        :data-manager="dataManager2"
        pagination-path="pagination"
        @vuetable:pagination-data="onPaginationData"
      ></vuetable>
    </div>
  </b-card>

</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../components/Common/VuetablePaginationBootstrap";
import _ from "lodash";

export default {
  props: {
    isLoad: {
      type: Boolean,
      default: false
    },
    title:{
      type:String
    },
    bestData:{
      type:Array
    }
  },
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap
  },
  data() {
    return {
      bestsellers: {
        fields: [
          {
            name: "user.name",
            sortField: "user.name",
            title: "Name",
            titleClass: "",
            dataClass: "list-item-heading"
          },
          {
            name: "user.email",
            sortField: "user.email",
            title: "Email",
            titleClass: "",
            dataClass: "list-item-heading"
          },
          {
            name: "user.phone",
            sortField: "user.phone",
            title: "Phone",
            titleClass: "",
            dataClass: "list-item-heading"
          },
          {
            name: "orders_number",
            sortField: "orders_number",
            title: "Order Count",
            titleClass: "",
            dataClass: "text-muted"
          },
          {
            name: "orders_total",
            sortField: "orders_total",
            title: "Total",
            titleClass: "",
            dataClass: "text-muted"
          }
        ]
      },
      sort: "",
      page: 1,
      perPage: 15,
      from: 0,
      to: 0,
      total: this.bestData.length,
      lastPage: 0,
    };
  },
  methods: {
    onChangePage(page) {
      this.page = page
      this.$refs.vuetable.changePage(page);
      console.log(page,'page')
    },

    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },
    calculatePagination() {
      this.from = (this.page - 1) * this.perPage + 1;
      let tempTo = this.from + this.perPage - 1;
      this.to = tempTo <= this.total ? tempTo : this.total;
      this.lastPage = Number((this.total / this.perPage).toFixed(0))
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    dataManager2( pagination) {
      // console.log("RRR", this.data)

      if (this.bestData.length < 1) return;

      let local = this.bestData;


      pagination = this.$refs.vuetable.makePagination(
        local.length,
        this.perPage
      );
      console.log('pagination:', pagination)
      let from = pagination.from - 1;
      let to = from + this.perPage;
      return {
        pagination: pagination,
        data: _.slice(local, from, to)
      };
    },
  }
};
</script>
