<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1 class="mb-4 card-title font-weight-bold color-theme-1">{{ $t('cards.attachments') }}</h1>
        <b-row>
          <b-colxx
            xxs="12"
            xs="12"
            lg="12"
            class="mb-3">
            <b-card
              class="mb-4"
              no-body>
              <b-tabs
                card
                fade>
                <b-tab
                  :title="$t('menu.image')"
                  active
                  :title-item-class="`${tabWidth} text-center font-weight-bold`">
                  <grid-body
                    :fieldsNames="fields"
                    :perPage="perPage"
                    :search="search"
                    :apiBase="apiBase1"
                    :addRow="addRow"
                    :title="title"
                    :attachType="attachType1"
                    :id="id"
                    :addMeta="addMeta"
                    :addNew="addNew"
                    :addEdit="addEdit"
                    :addDelete="addDelete">
                  </grid-body>
                </b-tab>
                <b-tab
                  :title="$t('menu.youtube')"
                  :title-item-class="`${tabWidth} text-center font-weight-bold`">
                  <grid-body
                    :fieldsNames="fields"
                    :perPage="perPage"
                    :search="search"
                    :apiBase="apiBase2"
                    :addRow="addRow"
                    :attachType="attachType2"
                    :title="title"
                    :id="id"
                    :addMeta="addMeta"
                    :addNew="addNew"
                    :addEdit="addEdit"
                    :addDelete="addDelete">
                  </grid-body>
                </b-tab>
                <b-tab
                  v-if="!isGallery"
                  :title="$t('menu.file')"
                  :title-item-class="`${tabWidth} text-center font-weight-bold`">
                  <grid-body
                    :fieldsNames="fields"
                    :perPage="perPage"
                    :search="search"
                    :apiBase="apiBase3"
                    :addRow="addRow"
                    :title="title"
                    :attachType="attachType3"
                    :id="id"
                    :addMeta="addMeta"
                    :addNew="addNew"
                    :addEdit="addEdit"
                    :addDelete="addDelete">
                  </grid-body>
                </b-tab>

              </b-tabs>
            </b-card>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../../containers/Grid/GridBody";

export default {
  components: {
    GridBody,
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "grid-body": GridBody
  },
  data() {
    return {
      isLoad: false,
      apiBase1: 'blocks/images',
      apiBase2: 'blocks/youtube-videos',
      apiBase3: 'blocks/files',
      attachType1: "images",
      attachType2: "youtube-videos",
      attachType3: "files",
      sort: "",
      page: 1,
      perPage: 3,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      data: [],
      addRow: "attachment-form",
      selectedItems: [],
      title: this.$t('menu.image'),
      id: parseInt(this.$route.params.id),
      addNew: true,
      addEdit: true,
      addDelete: true,
      addMeta: false,
      tabWidth:null,
      fields: [{
          name: "__slot:image",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "2%"
        },
        {
          name: "locales.en.title",
          title: this.$t('forms.name-en'),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "locales.ar.title",
          title: this.$t('forms.name-ar'),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
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
  computed: {
    isGallery() {
      let blockType = localStorage.getItem("blockType");
      if (blockType == "photo-gallery" || blockType == "viedos") {
        this.tabWidth = 'w-50'
        return true
      } else {
        this.tabWidth = 'w-33'
        return false
      }
    }
  },
  methods: {
    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },

    searchChange(val) {
      this.search = val;
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
    }
  },
};
</script>

<style>
.w-33 {
  width: 33.3333% !important;
}
</style>
