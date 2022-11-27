<template>
  <div>
    <b-row v-if="displayMode==='image'" key="image">
      <b-colxx
        sm="6"
        lg="4"
        xl="3"
        class="mb-3"
        v-for="(item,index) in items"
        :key="index"
        :id="item.id"
      >
        <image-list-item
          :key="item.id"
          :data="item"
          :selected-items="selectedItems"
          @toggle-item="toggleItem"
          v-contextmenu:contextmenu
        />
      </b-colxx>
    </b-row>
    <b-row v-else-if="displayMode==='thumb'" key="thumb">
      <b-colxx xxs="12" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
        <thumb-list-item
          :key="item.id"
          :data="item"
          :selected-items="selectedItems"
          @toggle-item="toggleItem"
          v-contextmenu:contextmenu
        />
      </b-colxx>
    </b-row>
    <b-row v-else-if="displayMode==='list'" key="list">
      <b-colxx xxs="12" class="mb-3">
      <b-card no-body>
        <div class="pl-2 d-flex flex-grow-1 min-width-zero">
          <div
            class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
            <p class="mb-0 text-muted text-small w-15 w-sm-100">Name En</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">Address EN</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">Name AR</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100" >Mobiel</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100" >Phone</p>
          </div>

          <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
            <a class="custom-control-icon">
              <i class="simple-icon-pencil"></i>
            </a>
            <a  style="padding: 0" class="custom-control-icon">
              <i class="simple-icon-trash"></i>
            </a>
          </div>
        </div>
      </b-card>
      </b-colxx>
      <b-colxx xxs="12" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
        <data-list-item
          :key="item.id"
          :data="item"
          :selected-items="selectedItems"
          @toggle-item="toggleItem"
          v-contextmenu:contextmenu
        />
      </b-colxx>
    </b-row>
    <b-row v-if="lastPage>1">
      <b-colxx xxs="12">
        <b-pagination-nav
          :number-of-pages="lastPage"
          :link-gen="linkGen"
          :value="page"
          @change="(a)=>changePage(a)"
          :per-page="perPage"
          align="center"
        >
          <template v-slot:next-text>
            <i class="simple-icon-arrow-right"/>
          </template>
          <template v-slot:prev-text>
            <i class="simple-icon-arrow-left"/>
          </template>
          <template v-slot:first-text>
            <i class="simple-icon-control-start"/>
          </template>
          <template v-slot:last-text>
            <i class="simple-icon-control-end"/>
          </template>
        </b-pagination-nav>
      </b-colxx>
    </b-row>

    <v-contextmenu @contextmenu="handleContextMenu" ref="contextmenu">
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
  import ImageListItem from "../../../components/Listing/ImageListItem";
  import ThumbListItem from "../../../components/Listing/ThumbListItem";
  import DataListBranch from "../../../components/Listing/branches/DataListBranch";

  export default {
    name: "ListBranchListing",

    components: {
      "image-list-item": ImageListItem,
      "thumb-list-item": ThumbListItem,
      "data-list-item": DataListBranch
    },
    props: [
      "displayMode",
      "items",
      "selectedItems",
      "toggleItem",
      "lastPage",
      "perPage",
      "page",
      "changePage",
      "handleContextMenu",
      "onContextMenuAction"
    ],
    methods: {
      linkGen(pageNum) {
        return "#page-" + pageNum;
      }
    }
  }
</script>

<style scoped>

</style>
