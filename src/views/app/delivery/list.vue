<template>
    <div>
        <b-row>
            <b-colxx xxs="12">
                <piaf-breadcrumb heading="Delivery"/>
                <div class="separator mb-5"></div>
            </b-colxx>
        </b-row>
        <b-row>
            <b-colxx xxs="12">
                <vuetable
                    table-body-class="vuetable-body"
                    ref="vuetable"
                    class="table-divided order-with-arrow"
                    :per-page="perPage"
                    :reactive-api-url="true"
                    :api-mode="false"
                    :fields="fields"
                    pagination-path
                    @vuetable:pagination-data="onPaginationData"
                    >
                    <template slot="actions" slot-scope="props">
                        <b-dropdown
                            id="ddown2"
                            size="xs"
                            html=" "
                            split
                            split-class="p-0"
                            class=""
                            variant="secondary">
                            <template #button-content>
                                <div class="py-0">
                                    <b-link
                                        @click="open_details(props.rowData.id)"
                                        id="edit"
                                        class="d-flex align-items-center  text-white px-2">
                                        <i style='font-size:20px' class='iconsminds-gear-2 d-flex'></i>
                                    </b-link>
                                </div>
                            </template>
                        </b-dropdown>
                    </template>
                </vuetable>
                <!-- <vuetable-pagination-bootstrap
                class="mt-4"
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
                /> -->
            </b-colxx>
        </b-row>
    </div>
  </template>
  <script>
  import Vuetable from "vuetable-2/src/components/Vuetable";
  import { mapActions, mapGetters } from 'vuex';
  import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
  import {adminRoot} from "../../../constants/config";

  export default {
    components: {
      vuetable: Vuetable,
      "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    },
    data() {
      return {
        isLoad: false,
        sort: "",
        page: 1,
        perPage: 8,
        search: "",
        from: 0,
        to: 0,
        total: 0,
        lastPage: 0,
        items: [],
        selectedItems: [],
  
        fields: [
          {
            name: "first_name",
            sortField: "first_name",
            title: "First Name",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "20%"
          },
          {
            name: "last_name",
            sortField: "last_name",
            title: "Last Name",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "20%"
          },
          {
            name: "phone_number",
            title: "Telephone",
            titleClass: "",
            dataClass: "text-muted",
            width: "20%"
          },
          {
            name: "email",
            title: "Email",
            titleClass: "",
            dataClass: "text-muted",
            width: "20%"
          },
     
          {
            name: "__slot:actions",
            title: "",
            titleClass: "center aligned text-right",
            dataClass: "center aligned text-right",
            width: "20%"
          }
        ]
      };
    },
    created(){
        this.get_deliveries();
    },
    methods: {
        ...mapActions(['get_deliveries']),
      rowClicked(dataItem, event) {
        const itemId = dataItem.id;
        if (event.shiftKey && this.selectedItems.length > 0) {
          let itemsForToggle = this.items;
          var start = this.getIndex(itemId, itemsForToggle, "id");
          var end = this.getIndex(
            this.selectedItems[this.selectedItems.length - 1],
            itemsForToggle,
            "id"
          );
          itemsForToggle = itemsForToggle.slice(
            Math.min(start, end),
            Math.max(start, end) + 1
          );
          this.selectedItems.push(
            ...itemsForToggle.map(item => {
              return item.id;
            })
          );
          this.selectedItems = [...new Set(this.selectedItems)];
        } else {
          if (this.selectedItems.includes(itemId)) {
            this.selectedItems = this.selectedItems.filter(x => x !== itemId);
          } else this.selectedItems.push(itemId);
        }
      },
   
      onPaginationData(paginationData) {
        this.from = paginationData.from;
        this.to = paginationData.to;
        this.total = paginationData.total;
        this.lastPage = paginationData.last_page;
        this.items = paginationData.data;
        // this.$refs.pagination.setPaginationData(paginationData);
      },
      onChangePage(page) {
      this.$refs.vuetable.changePage(page);
        },
  
      changePageSize(perPage) {
        this.perPage = perPage;
      },
  
      searchChange(val) {
        this.search = val;
        this.$refs.vuetable.refresh();
      },
      open_details(id){
        this.$router.push(`details/${id}`)
        // this.$router.push({
        // path: `${adminRoot}/delivery/details/${id}`,
        // // query: { id: id }
        // });
      }
     
     
      
    },
    computed: {
      ...mapGetters(['_all_deliveries', '_delivery_paginations']),
      isSelectedAll() {
        return this.selectedItems.length >= this.items.length;
      },
      isAnyItemSelected() {
        return (
          this.selectedItems.length > 0 &&
          this.selectedItems.length < this.items.length
        );
      }
    },
    watch: {
        _all_deliveries: function(val){
            console.log('all deliveries watcher', val)
            this.$refs.vuetable.setData(val);
        },
        _delivery_paginations: function(val) {
            this.perPage = val.per_page;
            this.from = val.from;
            this.to = val.to;
            this.total = val.total;
            // this.$refs.pagination.setPaginationData(val);
        }
  
    }
  };
  </script>
<style scoped>
  .vuetable-body {
    background-color: red;
}
  </style>
  