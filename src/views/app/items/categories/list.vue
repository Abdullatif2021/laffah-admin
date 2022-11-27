<template>
  <b-row>
    <b-colxx class="disable-text-selection">
      <grid-body
        :fieldsNames="fields"
        :perPage="perPage"
        :search="search"
        :apiBase="apiBase"
        :addRow="addRow"
        :title="title"
        :addNew="addNew"
        :addEdit="addEdit"
        :addDelete="addDelete"
        :addMeta="false"
        ref="grid"
      ></grid-body>
    </b-colxx>
  </b-row>
</template>

<script>
  import {mapGetters, mapState, mapMutations, mapActions} from "vuex";
  import GridBody from "../../../../containers/Grid/GridBody";
  export default {
    name: "list-category",
    components: {
      "grid-body": GridBody
    },
    data() {
      return {
        isLoad: true,
        apiBase: `categories`,
        sort: "",
        page: 1,
        perPage: 3,
        search: "",
        from: 0,
        to: 0,
        total: 0,
        lastPage: 0,
        data: [],
        selectedItems: [],
        addRow: "create-category",
        title: this.$t('pages.categories'),
        addNew: true,
        addEdit: true,
        addDelete: true,
        items: [],
        fields: [{
          name: "id",
          title: "ID",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
          {
            name: `locales.en.title`,
            title: "Title En",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "10%"
          },
          {
            name: `locales.ar.title`,
            title: "Title Ar",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "10%"
          },
          {
            name: "__slot:actions",
            title: "",
            titleClass: "center aligned text-right",
            dataClass: "center aligned text-right",
            width: "10%"
          }
        ]
      };
    },
    methods: {
      loadItems() {
        this.isLoad = false;
        this.$store.dispatch('category/loadCategoriesListPagination')
      },

      changeDisplayMode(displayType) {
        this.displayMode = displayType;
      },
      changePageSize(perPage) {
        if (perPage > this.total) {
          this.$store.commit('category/SET_Page', 1);
        } else {
          this.$store.commit('category/SET_Page', perPage + 1);
        }
        this.$store.commit('category/SET_PerPage', perPage);
      },
      changeOrderBy(sort) {
        this.sort = sort;
      },
      searchChange(val) {
        this.search = val;
        this.$store.commit('category/SET_Page', 1);
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
        switch (action) {
          case 'delete':
            this.selectedItems.map(x => this.$store.dispatch('category/deleteCategory', x.toString()))
            break
          case 'copy':
            //
            break
          default:
            console.log(
              "context menu item clicked - " + action + ": ",
              this.selectedItems
            );
        }

      },
      changePage(pageNum) {
        this.$store.commit('category/SET_Page', pageNum)
        this.$store.commit('category/SET_CurrentPage', pageNum - 1)
      }
    },
    mounted() {
      this.loadItems();
    }
  };

</script>

<style scoped>

</style>
