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
    :addNew="addNew"
    :addEdit="addEdit"
    ref="grid"
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
     v-if="authorSuperadmin || authorAdmin"
     :class="`d-flex justify-content-end my-3 ${visibleState}`">
     <Switches
      v-model="editable"
      theme="custom"
      color="primary mx-2 d-inline"
      class="vue-switcher-small d-flex align-self-center"></Switches>
     <h6 class="font-weight-bold d-flex align-self-center">{{this.$t('forms.enable-form')}}</h6>
    </div>
    <b-button
     @click="resetForm()"
     variant="primary"
     class="mt-2 align-self-center align-self-baseline"
     :class="{'d-none':editable}">{{ $t('pages.add-new') }}
    </b-button>
   </div>
   <b-form
    v-if="isLoad"
    @submit.prevent="formSubmit">
    <b-form-group
     :label="$t('forms.meta-type')"
     :class="`has-float-label mb-4 ${toggleShadow}`">
     <v-select
      label="type"
      value="id"
      :disabled="toggleState"
      :class="{'is-invalid':selectValid}"
      v-model="selected"
      :options="meta_type">
      <template #search="{attributes, events}">
       <input class="vs__search" :required="(JSON.stringify(selected).length == 2 || selected == null)" v-bind="attributes" v-on="events" />
      </template>
     </v-select>
    </b-form-group>
    <b-form-group
     :label="$t('forms.meta-content-en')"
     :class="`has-float-label mb-4 ${toggleShadow}`">
     <b-textarea
      :disabled="toggleState"
      required
      type="text"
      v-model.trim="$v.formActions.meta_content_en.$model"
      :state="!$v.formActions.meta_content_en.$error"
      :dir="direction" />
     <b-form-invalid-feedback v-if="!$v.formActions.meta_content_en.required">{{`${$t('forms.meta-content-en')}
            ${$t('validations.required')}`}}!
     </b-form-invalid-feedback>
     <b-form-invalid-feedback v-if="!$v.formActions.meta_content_en.maxLength">{{`${$t('forms.meta-content-en')}
            ${$t('validations.max-seo-content')}`}}!
     </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
     :label="$t('forms.meta-content-ar')"
     :class="`has-float-label mb-4 ${toggleShadow}`">
     <b-textarea
      :disabled="toggleState"
      required
      type="text"
      v-model.trim="$v.formActions.meta_content_ar.$model"
      :state="!$v.formActions.meta_content_ar.$error"
      :dir="direction" />
     <b-form-invalid-feedback v-if="!$v.formActions.meta_content_ar.required">{{`${$t('forms.meta-content-ar')}
            ${$t('validations.required')}`}}!
     </b-form-invalid-feedback>
     <b-form-invalid-feedback v-if="!$v.formActions.meta_content_ar.maxLength">{{`${$t('forms.meta-content-ar')}
            ${$t('validations.max-seo-content')}`}}!
     </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
     :label="$t('forms.date')"
     :class="'has-float-label mb-4 ' + toggleShadow">
     <datepicker
      :disabled="toggleState"
      :bootstrap-styling="true"
      v-model.trim="$v.formActions.creation_date.$model"
      :state="!$v.formActions.creation_date.$error"
      :dir="direction"
      :required="true"
      format="yyyy-MM-dd"></datepicker>
     <b-form-invalid-feedback :class="{'d-block':notValid}">{{`${$t('forms.create-date')}
            ${$t('validations.required')}`}}
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
      <h6 class="d-flex align-self-center">{{$t('active-in-website')}}</h6>
     </div>
    </b-form-group>
    <div
     v-if="authorSuperadmin || authorAdmin"
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
   <template v-else>
    <div class="loading"></div>
   </template>
  </b-colxx>
 </b-row>
</template>

<script>
import GridBody from "../../../containers/Grid/GridBody";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { validationMixin } from "vuelidate";
import { getDirection, decrypt } from '../../../utils';
import Datepicker from "vuejs-datepicker";
import Switches from "vue-switches";
import { mapGetters, mapActions } from 'vuex';
import axios from "axios";

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
   meta_content_en: {
    required,
    maxLength: maxLength(160),
   },
   meta_content_ar: {
    required,
    maxLength: maxLength(160),
   },
   creation_date: {
    required
   },
   meta_type_value: {}
  },
  meta_type: {
   required
  }
 },
 data() {
  return {
   isLoad: true,
   apiBase: `${this.$route.params.slug}/metadata/${this.$route.params.id}`,
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
   title: this.$t('menu.meta-data'),
   addNew: false,
   addEdit: true,
   active: true,
   disableSubmit: false,
   direction: getDirection().direction,
   editable: false,
   toggleState: true,
   toggleShadow: "",
   visibleState: "visible",
   selected: {},
   formActions: {
    meta_content_en: null,
    meta_content_ar: null,
    creation_date: new Date(),
    meta_type_value: '',
    metaDataID: null,

   },
   meta_type: [],
   notValid: false,
   selectValid: false,
   fields: [{
     name: "id",
     title: "ID",
     titleClass: "",
     dataClass: "list-item-heading",
     width: "2%"
    },
    {
     name: "locales.en.meta_content",
     title: "Meta  EN",
     titleClass: "",
     dataClass: "list-item-heading ",
     width: "10%"
    },
    {
     name: "locales.ar.meta_content",
     title: "Meta  AR",
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
 watch: {
  editable(val) {
   if (val) {
    this.resetForm()
    this.toggleState = false;
    this.toggleShadow = "fishday-shadow";
   } else {
    this.toggleState = true;
    this.toggleShadow = "";
   }
  },
 },
 methods: {
  formSubmit() {
   if (this.authorSuperadmin || this.authorAdmin) {
    this.$v.formActions.$touch();
    if (!this.$v.formActions.$anyError) {
     this.isLoad = false;
     if (!this.formActions.creation_date) {
      // alert('error')
      this.notValid = true
     } else if (Object.keys(this.selected).length === 0 && this.selected.constructor === Object) {
      this.selectValid = true
     } else {
      let form_data = new FormData();
      console.log(this.meta_type, 'meta_type')
      let data = {
       'meta_type_id': this.selected.id,
       'en[meta_content]': this.formActions.meta_content_en,
       'ar[meta_content]': this.formActions.meta_content_ar
      }
      for (var key in data) {
       form_data.append(key, data[key]);
      }
      console.log(form_data, 'form_data')
      if (this.metaDataID != null) {
       const self = this
       form_data.append("_method", 'PUT');
       axios //PUT method
        .post(this.apiBase + '/' + this.metaDataID, form_data).then(
         res => {
          this.resetForm()
          this.isLoad = true
          console.log(res, 'res meta')
          self.$nextTick(() => {
           self.$refs.grid.to = 0
           self.$refs.grid.getData()
          })
          this.$notify("success", "Done", null, { duration: 5000, permanent: false });
         }).catch(error => {
         this.$notify("error", "Failed", null, { duration: 5000, permanent: false });
         console.log(error)
        })
      } else {
       const self = this
       axios //POST method
        .post(this.apiBase, form_data).then(
         res => {
          this.resetForm()
          this.isLoad = true
          console.log(res, 'res meta')
          self.$nextTick(() => {
           self.$refs.grid.to = 0
           self.$refs.grid.getData()
          })
          this.$notify("success", "Done", null, { duration: 5000, permanent: false });
         }).catch(error => {
         this.$notify("error", "Failed", null, { duration: 5000, permanent: false });
         console.log(error)
        })

      }
     }
    }
   }
  },
  resetForm() {
   this.editable = true
   // Object.keys(this.formActions).forEach(k =>  this.formActions[k] == '')
   this.formActions.meta_content_ar = null;
   this.formActions.meta_content_en = null;
   this.metaDataID = null
   this.selected = {}
  },
  setMetaRow(e) {
   //console.log(e,'ddddd')
   this.formActions.meta_content_en = e.locales['en'].meta_content;
   this.formActions.meta_content_ar = e.locales['ar'].meta_content;
   this.metaDataID = e.id
   //this.formActions.creation_date = e.created_at
   //console.log(e,'eeeee')
   // this.formActions.meta_type_value= e.meta_type_value;
   const obj = this.meta_type.filter(i => i.id == e.meta_type_id)
   this.formActions.meta_type_value = obj[0].type
   this.selected = { id: obj[0].id, type: obj[0].type }
   // console.log(obj,'obk')
  }
 },
 created() {
  console.log(this.$route.path, 'path')
  axios
   .get('metadata/meta-type')
   .then(res => {
    let result = res.data.data;
    this.meta_type = result
    console.log(result, 'result')
   }).catch(error => { console.log(error) })
 }

}
</script>
