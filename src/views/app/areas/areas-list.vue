<template>
  <b-row>
    <b-colxx
      lg="7"
      xl="7">
      <grid-body
        :fieldsNames="fields"
        :perPage="perPage"
        :search="search"
        :apiBase="apiBase"
        :addRow="addRow"
        :title="title"
        :addNew="false"
        :addEdit="addEdit"
        :addDelete="addDelete"
        :addDisplay="addDisplay"
        ref="grid"
        :addMeta="false"
        @editMetadata="setMetaRow($event)"></grid-body>
    </b-colxx>
    <b-colxx
      lg="5"
      xl="5"
      class="mt-5">
      <div class="d-flex justify-content-between mb-4 mt-2">
        <!-- <b-button @click="()">
                  {{ $t('forms.enableEdit') }}
                </b-button> -->
        <div
          v-if="!disableForm"
          :class="`d-flex justify-content-end my-3 ${visibleState}`">
          <Switches
            v-model="editable"
            theme="custom"
            color="primary mx-2 d-inline"
            class="vue-switcher-small d-flex align-self-center"></Switches>
          <h6 class="font-weight-bold d-flex align-self-center">{{ this.$t('forms.enable-form') }}</h6>
        </div>
        <b-button
          v-if="addNew"
          @click="resetForm()"
          variant="primary"
          class="mt-2 align-self-center align-self-baseline"
          :class="{'d-none':editable}">{{ $t('pages.add-new') }}
        </b-button>
      </div>
      <div class="d-flex flex-column">
        <b-form
          v-if="isLoad"
          @submit.prevent="formSubmit">
          <b-form-group
            :label="$t('forms.name-ar')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <b-form-input
              :disabled="toggleState"
              required
              type="text"
              v-model.trim="$v.formActions.name_ar.$model"
              :state="!$v.formActions.name_ar.$error"
              :dir="direction"/>
            <b-form-invalid-feedback v-if="!$v.formActions.name_ar.required">{{
                `${$t('forms.name-ar')}
              ${$t('validations.required')}`
              }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.name-en')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <b-form-input
              :disabled="toggleState"
              required
              type="text"
              v-model.trim="$v.formActions.name_en.$model"
              :state="!$v.formActions.name_en.$error"
              :dir="direction"/>
            <b-form-invalid-feedback v-if="!$v.formActions.name_en.required">{{
                `${$t('forms.name-en')}
            ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.longitude')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <b-form-input
              :disabled="toggleState"
              required
              type="text"
              v-model.trim="$v.formActions.longitude.$model"
              :state="!$v.formActions.longitude.$error"
              :dir="direction"/>
            <b-form-invalid-feedback v-if="!$v.formActions.longitude.required">{{
                `${$t('forms.longitude')}
            ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.latitude')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <b-form-input
              :disabled="toggleState"
              required
              type="text"
              v-model.trim="$v.formActions.latitude.$model"
              :state="!$v.formActions.latitude.$error"
              :dir="direction"/>
            <b-form-invalid-feedback v-if="!$v.formActions.latitude.required">{{
                `${$t('forms.latitude')}
            ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.minimum-orders')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <b-form-input
              :disabled="toggleState"
              required
              type="number"
              v-model.trim="$v.formActions.minimum_orders.$model"
              :state="!$v.formActions.minimum_orders.$error"
              :dir="direction"/>
            <b-form-invalid-feedback v-if="!$v.formActions.minimum_orders.required">{{
                `${$t('forms.minimum-orders')}
            ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.delivery-cost')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <b-form-input
              :disabled="toggleState"
              required
              type="number"
              v-model.trim="$v.formActions.delivery_cost.$model"
              :state="!$v.formActions.delivery_cost.$error"
              :dir="direction"/>
            <b-form-invalid-feedback v-if="!$v.formActions.delivery_cost.required">{{
                `${$t('forms.delivery-cost')}
            ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.salik-cost')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <b-form-input
              :disabled="toggleState"
              required
              type="number"
              v-model.trim="$v.formActions.salik_fee.$model"
              :state="!$v.formActions.salik_fee.$error"
              :dir="direction"/>
            <b-form-invalid-feedback v-if="!$v.formActions.salik_fee.required">{{
                `${$t('forms.salik-cost')}
            ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.city')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <v-select
              label="name"
              value="id"
              :disabled="toggleState"
              :class="{'is-invalid':selectValid}"
              v-model="$v.selected.$model"
              :options="formActions.cities"/>
            <b-form-invalid-feedback :class="{'d-block':selectValid}">{{
                `${$t('forms.city')}
            ${$t('validations.required')}`
              }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.branch')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <v-select
              label="name"
              value="id"
              :disabled="toggleState"
              :class="{'is-invalid':selectBranchValid}"
              v-model="$v.selectedBranch.$model"
              :options="formActions.branches"/>
            <b-form-invalid-feedback :class="{'d-block':selectBranchValid}">{{
                `${$t('forms.branch')}
            ${$t('validations.required')}`
              }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <div class="d-flex justify-content-start">
              <Switches
                :disabled="toggleState"
                v-model="active"
                theme="custom"
                color="primary mx-2 d-inline"
                class="vue-switcher-small d-flex align-self-center"></Switches>
              <h6 class="d-flex align-self-center">{{ $t("active-in-website") }}</h6>
            </div>
          </b-form-group>
          <div
            v-if="!disableForm"
            class="d-flex ">
            <b-button
              v-if="!toggleState"
              type="submit"
              variant="primary"
              class="mt-4  align-self-center align-self-baseline"
              :class="{'opacity-0':toggleState}">{{ $t('forms.submit') }}
            </b-button>
            <b-button
              v-if="!toggleState"
              variant="danger"
              @click="editable = false"
              class="mt-4 mx-2 align-self-center align-self-baseline">{{ $t('forms.cancel') }}
            </b-button>
          </div>
        </b-form>
        <template v-if="!isLoad">
          <div class="loading"></div>
        </template>
      </div>
    </b-colxx>
  </b-row>
</template>

<script>
import GridBody from "../../../containers/Grid/GridBody";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import {validationMixin} from "vuelidate";
import {getDirection, decrypt} from '../../../utils';
import Datepicker from "vuejs-datepicker";
import Switches from "vue-switches";
import {mapGetters, mapActions} from 'vuex';
import axios from "axios";
import {BIconFileEasel, BRow} from 'bootstrap-vue';

const {
  required,
  maxLength,
  integer
} = require("vuelidate/lib/validators");
export default {
  components: {
    "grid-body": GridBody,
    "v-select": vSelect,
    datepicker: Datepicker,
    Switches
  },
  mixins: [validationMixin],
  validations: {
    formActions: {
      name_en: {
        required,
        maxLength: maxLength(200),
      },
      name_ar: {
        required,
        maxLength: maxLength(200),
      },
      longitude: {
        required
      },
      latitude: {
        required
      },
      delivery_cost: {
        required
      },
      salik_fee: {
        required
      },
      minimum_orders: {
        required
      }
    },
    selected: {
      required
    },
    selectedBranch: {
      required
    }
    //   cities: {
    //    required
    //   },
    //   branches: {
    //    required
    //   }
  },
  data() {
    return {
      isLoad: true,
      apiBase: `areas`,
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
      addRow: "",
      title: this.$t('menu.areas'),
      addNew: true,
      addEdit: true,
      addDelete: true,
      addDisplay: false,
      disableForm: false,
      active: true,
      visibleState: "visible",
      required: null,
      editable: false,
      toggleShadow: "",
      disableSubmit: false,
      direction: getDirection().direction,
      toggleState: true,
      selected: {},
      selectedBranch: {},
      formActions: {
        id: null,
        name_en: '',
        name_ar: '',
        latitude: '',
        longitude: '',
        areaID: null,
        cities: [],
        branches: [],
        minimum_orders: 0,
        delivery_cost: 0,
        salik_fee: 0
      },
      notValid: false,
      selectValid: false,
      selectBranchValid: false,
      fields: [{
        name: "id",
        title: "ID",
        titleClass: "",
        dataClass: "list-item-heading",
        width: "10%"
      },
        {
          name: "locales.en.name",
          title: this.$t('forms.name-en'),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "locales.ar.name",
          title: this.$t('forms.name-ar'),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "__slot:price",
          title: this.$t("forms.delivery-cost"),
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "__slot:price2",
          title: this.$t("forms.minimum-order"),
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
    }
  },
  computed: {
    authorSuperadmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      if (userRole == 1) {
        return true
      } else
        return false
    },
    authorAdmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      if (userRole == 2) {
        return true
      } else
        return false
    },
  },
  methods: {
    getMinOrder(value) {
      console.log(value, 'value')
      return value[0].minimum_orders;
    },
    formSubmit() {
      if (!this.disableForm) {
        this.$v.formActions.$touch();
        if (Object.keys(this.selected).length === 0 && this.selected.constructor === Object) {
          this.selectValid = true
        } else if (Object.keys(this.selectedBranch).length === 0 && this.selectedBranch.constructor === Object) {
          this.selectBranchValid = true
        } else {
          this.toggleState = true
          let form_data = new FormData();
          console.log(this.formActions.cities, 'cities')
          this.notValid = false
          let data = {
            'city_id': this.selected.id,
            'en[name]': this.formActions.name_en,
            'ar[name]': this.formActions.name_ar,
            'longitude': this.formActions.longitude,
            'latitude': this.formActions.latitude,
            'area_minimum_order[branch_id]': this.selectedBranch.id,
            'area_minimum_order[minimum_orders]': this.formActions.minimum_orders,
            'area_minimum_order[delivery_cost]': this.formActions.delivery_cost,
            'area_minimum_order[salik_fee]': this.formActions.salik_fee
          }
          for (var key in data) {
            form_data.append(key, data[key]);
          }
          console.log(form_data, 'form_data')
          if (this.areaID != null) {
            const self = this
            form_data.append("_method", 'PUT');
            this.isLoad = false;
            this.toggleState = false;
            axios //PUT method
              .post(this.apiBase + '/' + this.areaID, form_data).then(
              res => {
                this.toggleState = false
                self.$nextTick(() => self.$refs.grid.getData())
                this.$notify("success", "Done", null, {duration: 5000, permanent: false});
                this.isLoad = true;
              }).catch(error => {
              this.toggleState = false;
              this.isLoad = true;
              console.log(error)
            })
          } else {
            const self = this
            this.isLoad = false;
            this.toggleState = false;

            axios //PUT method
              .post(this.apiBase, form_data).then(
              res => {
                this.toggleState = false
                self.$nextTick(() => self.$refs.grid.getData())
                this.$notify("success", "Done", null, {duration: 5000, permanent: false});
                this.resetForm();
                this.isLoad = true;

              }).catch(error => {
              console.log(error)
              this.toggleState = false
              this.isLoad = true;
            })

          }
        }
      }

    },
    enableForm() {
      this.toggleState = false
      //  Object.keys(this.formActions).forEach(k =>  this.formActions[k] == '')
      // this.selected = {}
    },
    resetForm() {
      this.toggleState = false
      // Object.keys(this.formActions).forEach(k =>  this.formActions[k] == '')
      this.$v.selected.$model = {}
      this.$v.selectedBranch.$model = {}
      this.formActions.id = null
      this.$v.formActions.name_ar.$model = '';
      this.$v.formActions.name_en.$model = '';
      this.$v.formActions.latitude.$model = '';
      this.$v.formActions.longitude.$model = '';
      this.$v.formActions.minimum_orders.$model = '';
      this.$v.formActions.delivery_cost.$model = '';
      this.$v.formActions.salik_fee.$model = '';
      this.areaID = null;
    },
    setMetaRow(e) {
      this.formActions.id = e.id;
      this.formActions.name_ar = e.locales['ar'].name;
      this.formActions.name_en = e.locales['en'].name;
      this.formActions.latitude = e.latitude;
      this.formActions.longitude = e.longitude;
      this.formActions.minimum_orders = e.areaMinimumOrders[0].minimum_orders;
      this.formActions.delivery_cost = e.areaMinimumOrders[0].delivery_cost;
      this.formActions.salik_fee = e.areaMinimumOrders[0].salik_fee;
      this.areaID = e.areaMinimumOrders[0].area_id
      const obj = this.formActions.cities.filter(i => i.id == e.city_id)
      const objb = this.formActions.branches.filter(i => i.id == e.areaMinimumOrders[0].branch_id)
      this.selected = {id: obj[0].id, name: obj[0].name}
      this.selectedBranch = {id: objb[0].id, name: objb[0].name}
    }
  },
  watch: {
    editable(val) {
      if (val) {
        this.toggleState = false;
        this.toggleShadow = "laffah-shadow";
      } else {
        this.toggleState = true;
        this.toggleShadow = "";
      }
    },
  },
  created() {
    axios
      .get('cities')
      .then(res => {
        let result = res.data.data;
        this.formActions.cities = result.map(obj => ({id: obj.id, name: obj.locales['en'].name}))
        // let result = data.map(({ id, locales['en'].name }) => ({id, locales['en'].name}));

      }).catch(error => {
      console.log(error)
    })
    axios
      .get('branches')
      .then(res => {
        let result = res.data.data;
        this.formActions.branches = result.map(obj => ({id: obj.id, name: obj.locales['en'].name}))
        // let result = data.map(({ id, locales['en'].name }) => ({id, locales['en'].name}));
      }).catch(error => {
      console.log(error)
    })
  },
  mounted() {
    const userRole = decrypt(localStorage.getItem('userRole'))
    if (userRole == 2) {
      this.addNew = true
      this.addEdit = true
      this.addDelete = true
      this.disableForm = false
      this.addDisplay = false
    }
  }
}
</script>
