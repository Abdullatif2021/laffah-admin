<template>
  <b-row>
    <b-colxx class="disable-text-selection">
      <list-attribute-heading :title="$t('menu.attribute-group')" :selectAll="selectAll" :isSelectedAll="isSelectedAll"
                              :isAnyItemSelected="isAnyItemSelected" :keymap="keymap" :displayMode="displayMode"
                              :changeDisplayMode="changeDisplayMode" :changeOrderBy="changeOrderBy"
                              :changePageSize="changePageSize" :sort="sort" :searchChange="searchChange" :from="from"
                              :to="to" :total="total" :perPage="perPage">
      </list-attribute-heading>
      <template v-if="isLoad">
        <list-attribute-listing :displayMode="displayMode" :items="items" :selectedItems="selectedItems"
                                :toggleItem="toggleItem" :lastPage="lastPage" :perPage="perPage" :page="page"
                                :changePage="changePage" :handleContextMenu="handleContextMenu"
                                :onContextMenuAction="onContextMenuAction">
        </list-attribute-listing>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-colxx>
  </b-row>
</template>

<script>
    import axios from "axios";
    import {apiUrl} from "../../../../constants/config";
    import ListAttributeGroupHeading from "../../../../containers/pages/attribute-group/ListAttributeGroupHeading";
    import ListAttributeGroupListing from "../../../../containers/pages/attribute-group/ListAttributeGroupListing";

    export default {
        name: "list-attribute",
        components: {
            "list-attribute-heading": ListAttributeGroupHeading,
            "list-attribute-listing": ListAttributeGroupListing
        },
        data() {
            return {
                isLoad: false,
                apiBase: apiUrl + "attributes/groups",
                displayMode: "list",
                sort: {
                    column: "id",
                    label: "Id"
                },
                newPage: '',
                page: 1,
                perPage: 4,
                search: "",
                from: 0,
                to: 1,
                total: 0,
                lastPage: 0,
                items: [],
                selectedItems: []
            };
        },
        methods: {
            loadItems() {
                this.isLoad = false;
                axios
                    .get(this.apiUrl)
                    .then(response => {
                        console.log(response.data);
                        return response.data;
                    })
                    .then(res => {
                        this.total = res.total;
                        this.from = res.from;
                        this.to = res.to;
                        this.items = res.data.map(x => {
                            return {
                                ...x,
                            };
                        });
                        this.perPage = res.per_page;
                        this.selectedItems = [];
                        this.lastPage = res.last_page;
                        this.isLoad = true;
                    });
            },

            changeDisplayMode(displayType) {
                this.displayMode = displayType;
            },
            changePageSize(perPage) {
                if (perPage > this.total) {
                    this.page = 1;
                } else {
                    this.page = perPage + 1;
                }
                this.perPage = perPage;
            },
            changeOrderBy(sort) {
                this.sort = sort;
            },
            searchChange(val) {
                this.search = val;
                this.page = 1;
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
            toggleItem(event, itemId) {
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
                } else {
                    if (this.selectedItems.includes(itemId)) {
                        this.selectedItems = this.selectedItems.filter(x => x !== itemId);
                    } else this.selectedItems.push(itemId);
                }
            },
            handleContextMenu(vnode) {
                if (!this.selectedItems.includes(vnode.key)) {
                    this.selectedItems = [vnode.key];
                }
            },
            onContextMenuAction(action) {
                console.log(
                    "context menu item clicked - " + action + ": ",
                    this.selectedItems
                );
            },
            changePage(pageNum) {
                this.page = pageNum;
                this.newPage = ((pageNum * this.perPage) - this.perPage) + 1;
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
            apiUrl() {
                if (this.newPage !== '')
                    return `${this.apiBase}?sort=${this.sort.column}&offset=${this.newPage - 1}&limit=${this.perPage}&search=${this.search}`;
                else
                    return `${this.apiBase}?sort=${this.sort.column}&offset=${this.page - 1}&limit=${this.perPage}&search=${this.search}`;
            }
        },
        watch: {
            search() {
                this.page = 1;
            },
            apiUrl() {
                this.loadItems();
            }
        },
        mounted() {
            this.loadItems();
        }
    };

</script>

<style scoped>

</style>
