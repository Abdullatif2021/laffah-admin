<template>
  <div>
    <datatable-heading
      v-if="show_heading"
      :title="title"
      :has-add-button="hasAddButton"
      :selectAll="selectAll"
      :isSelectedAll="isSelectedAll"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :disabled="disabled"
      :searchChange="searchChange"
      :from="from"
      :to="to"
      :total="total"
      :perPage="perPage"/>
    <b-row>
      <b-colxx xxs="12">
        <vuetable
          ref="vuetable"
          :disabled="disabled"
          :http-options="httpOptions"
          class="table-divided order-with-arrow"
          :api-url="apiBase"
          :query-params="makeQueryParams"
          :per-page="perPage"
          :reactive-api-url="!dataList"
          :fields="fields"
          :api-mode="apiMode"
          :data-manager="dataManager"
          :append-params="appendParams"
          :pagination-path="paginationUse"
          :row-class="onRowClass"
          :no-data-template="noDataString"
          @vuetable:pagination-data="onPaginationData"
          @vuetable:row-clicked="rowClicked"
          @vuetable:cell-rightclicked="rightClicked"
          @vuetable:loading="onLoading"
          @vuetable:loaded="onLoaded">
          <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
            <slot
              :name="name"
              v-bind="data"></slot>
          </template>
          <template slot="price" slot-scope="props">
            <b-badge
              pill
              variant="outline-primary">
              <span>{{ `${props.rowData.total}  ${$t('pages.aed')}` }}</span>
            </b-badge>
          </template>
          <template slot="actions" slot-scope="props">
            <div
              v-if="hasAddButton"
              class="custom-control pl-1 align-self-center pr-4">
              <b-icon-pencil
                v-b-modal.modalright
                :batch-id="props.rowData.id"
                @click="onEditClick(props.rowData)"
                scale="1.5"
                class="ml-3"/>
              <b-icon-trash
                v-if="authorSuperadmin"
                v-b-modal="`delete-${props.rowData.item_id}-${props.rowData.id}`"
                :batch-id="props.rowData.id"
                scale="1.5"
                class="ml-3"/>
            </div>
            <b-form-checkbox
              :disabled="disabled"
              v-if="!hasAddButton"
              :checked="selectedItems.includes(props.rowData.id)"
              class="itemCheck mb-0"></b-form-checkbox>
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
          @vuetable-pagination:change-page="onChangePage"/>
      </b-colxx>
    </b-row>

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="onContextMenuAction('copy')">
        <i class="simple-icon-docs"/>
        <span>Copy</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="onContextMenuAction('move-to-archive')">
        <i class="simple-icon-drawer"/>
        <span>Move to archive</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="onContextMenuAction('delete')">
        <i class="simple-icon-trash"/>
        <span>Delete</span>
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import {apiUrl} from "@/constants/config";
import DatatableHeading from "../../../containers/datatable/DatatableHeadingWithoutBreadcrumb";
import {BIconPencil, BIconTrash} from "bootstrap-vue";
import 'bootstrap-vue/dist/bootstrap-vue-icons.css'
import {decrypt} from '@/utils';
import _ from "lodash";

export default {
  props: [
    "title",
    "hasAddButton",
    "fields",
    "disabled",
    "modelUrl",
    "show_heading",
    "appendParams",
    "page_size",
    'apiMode',
    'dataList',
    'preSelectedItems',
    'search_change',
    'search_val'
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
      httpOptions: {headers: {Authorization: decrypt(localStorage.getItem('accessToken'))}},
      noDataString: 'No Data Available',
      apiBase: apiUrl + this.modelUrl,
      sort: "",
      page: 1,
      current_page: 1,
      perPage: 12,
      search: "",
      from: 0,
      to: 0,
      total: this.dataList ? this.dataList.length : 0,
      lastPage: 0,
      items: [],
      selectedItems: [],
    };
  },
  methods: {
    onLoading() {
      // this.isLoading = true
      this.noDataString = '<svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="circle fill" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-circle-fill b-icon bi text-primary b-icon-animation-throb" style="font-size: 300%;"><g><circle cx="8" cy="8" r="8"></circle></g></svg>'
      //this.noDataString = '<div class="loading"></div>'
      console.log('loading... show your spinner here')
    },
    onLoaded() {
      // this.isLoading = false
      this.noDataString = 'No Data Available'
      console.log('loaded! .. hide your spinner here')
    },
    dataManager(sortOrder, pagination) {
      // console.log("RRR", this.items)
      this.items = this.dataList
      if (this.items.length < 1) return;
      let local = this.items;
      // console.log(local, 'ddddd')
      if (this.search) {
        //console.log(this.search, 'ssssss')
        // the text should be case insensitive
        let txt = new RegExp(this.search, 'i')
        let dataFields = this.fields.map(function (el) {
          return el.name;
        })
          .filter(function (e) {
            return e.search('slot') < 0
          });
        local = _.filter(this.items, function (item) {
          for (let i = 0; i < dataFields.length; i++) {
            if (dataFields[i] != undefined) {
              let x;
              eval('x=item.' + dataFields[i]);
              if (x != null && x != 1) {
                try {
                  if (x.search(txt) >= 0) {
                    // console.log(x)
                    return true
                  }
                } catch (err) {

                }

              }
            }
          }
        })
        // local = _.filter(this.items, function (item) {
        //  console.log(item.locales.en.name.search(txt));
        //   return item.locales.en.name.search(txt) >= 0
        // })
      }
      // sortOrder can be empty, so we have to check for that as well
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
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
      console.log('pagination:', pagination)
      let from = pagination.from - 1;
      let to = from + this.perPage;
      return {
        pagination: pagination,
        data: _.slice(local, from, to)
      };
    },
    calculatePagination() {
      this.from = (this.page - 1) * this.perPage + 1;
      let tempTo = this.from + this.perPage - 1;
      this.to = tempTo <= this.total ? tempTo : this.total;
      this.lastPage = this.total > this.perPage ?
        Math.ceil(this.total / this.perPage) :
        1;
        this.$emit
    },
    makeQueryParams(sortOrder, currentPage, perPage) {
      // this.selectedItems = [];
      return sortOrder[0] ? {
        sort: sortOrder[0] ?
          sortOrder[0].field + "|" + sortOrder[0].direction : "",
        offset: (currentPage - 1) * this.perPage,
        limit: this.perPage,
        title: this.search,
        name: this.search,
        order_key: this.search
      } : {
        offset: (currentPage - 1) * this.perPage,
        limit: this.perPage,
        title: this.search,
        name: this.search,
        order_key: this.search
      };
    },
    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },

    rowClicked(dataItem, event) {
      if (!this.disabled) {
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
      this.total = paginationData.total;
      this.items = paginationData.data;
      this.calculatePagination()
      paginationData.from = this.from;
      paginationData.to = this.to;
      paginationData.last_page = this.lastPage;
      paginationData.current_page = this.current_page;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.current_page = page
      this.$refs.vuetable.changePage(page);
    },

    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },

    searchChange(val) {
      this.search = val;
      if (!this.apiMode) {
        this.dataManager(0, 1)
      }
      this.$refs.vuetable.refresh();
    },

    selectAll(isToggle) {
      if (this.items) {
        if (this.selectedItems.length >= this.items.length) {
          if (isToggle) this.selectedItems = [];
        } else {
          this.selectedItems = this.items.map(x => x.id);
        }
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
    paginationUse() {
      return this.dataList ? 'pagination' : ''
    },
    authorSuperadmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      if (userRole == 1) {
        return true
      } else
        return false
    },
    isSelectedAll() {
      this.items = this.dataList
      if (this.items) {
        return this.selectedItems.length >= this.items.length;
      }
    },
    isAnyItemSelected() {
      this.items = this.dataList
      if (this.items) {
        return (
          this.selectedItems.length > 0 &&
          this.selectedItems.length < this.items.length
        );
      } else {
        return false
      }
    },
  },

  mounted() {
    this.selectedItems = [].concat(this.preSelectedItems)
  },
  watch: {
    selectedItems(val) {
      if (this.apiBase.includes('customizations')) {
        this.$store.commit('item/SET_CustomizationGroups', val)
      }
    },
    preSelectedItems(val) {
      this.calculatePagination()
      this.selectedItems = val
    },
    perPage: function(perPage){
      this.$emit('perPage', perPage)
    },
    to: function(to){
      this.$emit('to', to)
    },
    from: function(from){
      this.$emit('from', from)
    },
    total: function(total){
      this.$emit('total', total)
    },
    search_val: function(val){
      this.searchChange(val);
    },
    page_size: function(val){
      this.changePageSize(val);
    }
  }
};
</script>
