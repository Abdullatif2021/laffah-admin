<template>
  <div>
    <datatable-heading
      :title="title"
      :has-add-button="hasAddButton"
      :selectAll="selectAll"
      :isSelectedAll="isSelectedAll"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :from="from"
      :to="to"
      :total="total"
      :perPage="perPage"
    ></datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <vuetable
          ref="vuetable2"
          class="table-divided order-with-arrow"
          :api-url="apiBase"
          :query-params="makeQueryParams"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fields"
          :api-mode="apiMode"
          :data="data"
          pagination-path=""
          :row-class="onRowClass"
          @vuetable:pagination-data="onPaginationData"
          @vuetable:row-clicked="rowClicked"
          @vuetable:cell-rightclicked="rightClicked"
        >
          <template slot="actions" slot-scope="props">
            <div v-if="hasAddButton" class="custom-control pl-1 align-self-center pr-4">
              <b-icon-pencil
                v-b-modal.modalright
                :batch-id="props.rowData.id"
                @click="onEditClick(props.rowData)"
                scale="1.5"
                class="ml-3"
              />
              <b-icon-trash
                v-b-modal="`delete-${props.rowData.item_id}-${props.rowData.id}`"
                :batch-id="props.rowData.id"
                scale="1.5"
                class="ml-3"
              />
            </div>
            <b-form-checkbox
              v-if="!hasAddButton"
              :checked="selectedItems.includes(props.rowData.id)"
              class="itemCheck mb-0"
            ></b-form-checkbox>
            <!-- modal for delete row -->
            <b-modal
              :id="`delete-${props.rowData.item_id}-${props.rowData.id}`"
              ref="modallg"
              size="sm"
              :title="`Delete '${props.rowData.batch}' Batch`">
              <h2>Are You Sure delete this batch? from item</h2>
              <template slot="modal-footer">
                <b-button
                  variant="danger"
                  @click="deleteItem(props.rowData)"
                  class="mr-1">Delete
                </b-button>
                <b-button
                  variant="light"
                  @click="hideModal('modallg')">Cancel
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
    </b-row>

  </div>
</template>
<script>
  import Vuetable from "vuetable-2/src/components/Vuetable";
  import VuetablePaginationBootstrap from "../../../../components/Common/VuetablePaginationBootstrap";
  import {apiUrl} from "../../../../constants/config";
  import DatatableHeading from "../../../../containers/datatable/DatatableHeadingWithoutBreadcrumb";
  import {BIconPencil, BIconTrash} from "bootstrap-vue";
  import axios from "axios";

  export default {
    props: [
      "title",
      "hasAddButton",
      "fields",
      "modelUrl",
      'apiMode',
      'data',
      'preSelectedItems'
    ],
    components: {
      vuetable: Vuetable,
      "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
      "datatable-heading": DatatableHeading,
      'b-icon-pencil': BIconPencil,
      'b-icon-trash': BIconTrash
    },
    data() {
      return {
        isLoad: false,
        apiBase: apiUrl + this.modelUrl,
        sort: "",
        page: 1,
        perPage: 8,
        search: "",
        from: 0,
        to: 0,
        total: 0,
        lastPage: 0,
        items: [],
        selectedItems: this.preSelectedItems ? [...this.preSelectedItems] : [],
      };
    },
    methods: {
      calculatePagination() {
        this.from = (this.page - 1) * this.perPage + 1;
        let tempTo = this.from + this.perPage - 1;
        this.to = tempTo <= this.total ? tempTo : this.total;
        this.lastPage = this.total > this.perPage
          ? Number((this.total / this.perPage).toFixed(0))
          : 1;
      },
      makeQueryParams(sortOrder, currentPage, perPage) {
        this.selectedItems = [];
        return sortOrder[0]
          ? {
            sort: sortOrder[0]
              ? sortOrder[0].field + "|" + sortOrder[0].direction
              : "",
            offset: (currentPage - 1) * this.perPage,
            limit: this.perPage,
            title: this.search
          }
          : {
            offset: (currentPage - 1) * this.perPage,
            limit: this.perPage,
            title: this.search
          };
      },
      onRowClass(dataItem, index) {
        if (this.selectedItems.includes(dataItem.id)) {
          return "selected";
        }
        return "";
      },

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
      rightClicked(dataItem, field, event) {
        event.preventDefault();
        if (!this.selectedItems.includes(dataItem.id)) {
          this.selectedItems = [dataItem.id];
        }
        this.$refs.contextmenu.show({top: event.pageY, left: event.pageX});
      },
      onPaginationData(paginationData) {
        this.calculatePagination()
        paginationData.from = this.from;
        paginationData.to = this.to;
        paginationData.last_page = this.lastPage;
        this.total = paginationData.total;
        this.items = paginationData.data;
        this.$refs.pagination.setPaginationData(paginationData);
      },
      onChangePage(page) {
        this.page = page
        this.$refs.vuetable.changePage(page);
      },

      changePageSize(perPage) {
        this.perPage = perPage;
        this.$refs.vuetable.refresh();
      },

      searchChange(val) {
        this.search = val;
        this.$refs.vuetable.refresh();
      },

      selectAll(isToggle) {
        if (this.selectedItems.length >= this.items.length) {
          if (isToggle) this.selectedItems = [];
        } else {
          this.selectedItems = this.items.map(x => x.id);
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
      getIndex(value, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i][prop] === value) {
            return i;
          }
        }
        return -1;
      },
      hideModal(refname) {
        this.$refs[refname].hide()
      },
      deleteItem(rowData) {
        console.log("id batch delete: " + rowData.id)
        this.hideModal('modallg')
        this.$store.dispatch('item/deleteBatch', {item_id: rowData.item_id, id: rowData.id})
          .then(response => {
            this.isLoad = false
            console.log(response)
          })

      },
      onContextMenuAction(action) {
        console.log(
          "context menu item clicked - " + action + ": ",
          this.selectedItems
        );
      },
      onEditClick(rowData) {
        this.$store.commit('item/SET_CurrentBatch', rowData)
      }
    },
    computed: {
      isSelectedAll() {
        return this.selectedItems.length >= this.items.length;
      },
      isAnyItemSelected() {
        return (
          this.selectedItems.length > 0 &&
          this.selectedItems.length < this.items.length
        );
      },
    },
    mounted() {
      this.selectedItems = [].concat(this.preSelectedItems)
    },
    watch: {
      total() {
        this.calculatePagination()
      },
      perPage() {
        this.calculatePagination()
      },
      page() {
        this.calculatePagination()
      },
      modelUrl(val, oldVal) {
        if (val !== oldVal){
          this.apiBase = apiUrl + val
        }
      }
    }
  };
</script>
