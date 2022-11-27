<template>
  <b-modal
    id="modalright"
    ref="modalright"
    :title="$t('pages.add-new-modal-title')"
    modal-class="modal-right">
    {{editable}}
    <div :class="`d-flex justify-content-end my-3`">
      <switches
        v-model="editable"
        theme="custom"
        color="primary mx-2 d-inline"
        class="vue-switcher-small d-flex align-self-center"></switches>
      <h6 class="font-weight-bold d-flex align-self-center">Enable Editing</h6>
    </div>
    <b-form>
      <b-form-group :label="$t('pages.product-name')">
        <b-form-input
          :disabled="toggleState"
          v-model="newItem.title" />
      </b-form-group>
      <b-form-group :label="$t('pages.category')">
        <v-select
          :disabled="toggleState"
          :options="categories"
          v-model="newItem.category" />
      </b-form-group>
      <b-form-group :label="$t('pages.description')">
        <b-textarea
          :disabled="toggleState"
          v-model="newItem.description"
          :rows="2"
          :max-rows="2" />
      </b-form-group>
      <b-form-group :label="$t('pages.status')">
        <b-form-radio-group
          :disabled="toggleState"
          stacked
          class="pt-2"
          :options="statuses"
          v-model="newItem.status" />
      </b-form-group>
    </b-form>

    <template slot="modal-footer">
      <b-button
        :disabled="toggleState"
        variant="outline-secondary"
        @click="hideModal('modalright')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :disabled="toggleState"
        variant="primary"
        @click="addNewItem()"
        class="mr-1">{{ $t('pages.submit') }}</b-button>
    </template>
  </b-modal>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { decrypt } from '../../utils';
import Switches from "vue-switches";
export default {
  components: {
    "v-select": vSelect,
    switches: Switches,
  },
  props: ["categories", "statuses"],
  data() {
    return {
      visibleState: "visible",
      disableSubmit: false,
      required: null,
      editable: false,
      toggleState: true,
      toggleShadow: "",
      newItem: {
        title: "",
        category: "",
        description: "",
        status: ""
      }
    };
  },
  watch: {
    editable(val) {
      if (val == true) {
        this.toggleState = false;
        this.toggleShadow = "laffah-shadow";
      } else {
        this.toggleState = true;
        this.toggleShadow = "";
      }
    },
  },
  computed: {
    // authorSuperadmin() {
    //   const userRole = decrypt(localStorage.getItem('userRole'))
    //   if (userRole == 1) {
    //     return true
    //   } else
    //     return false
    // },
    // authorAdmin() {
    //   const userRole = decrypt(localStorage.getItem('userRole'))
    //   if (userRole == 2) {
    //     return true
    //   } else
    //     return false
    // },
  },
  methods: {
    addNewItem() {
      console.log("adding item : ", this.newItem);
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    }
  }
};
</script>
