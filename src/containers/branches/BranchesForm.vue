<template>
 <b-row>

  <b-colxx xxs="12">
   <b-card
    no-body
    class="mb-4">
    <b-card-body class="">
     <b-card-header class="d-flex justify-content-between mb-3 px-0">
      <h3 class="d-flex align-self-center font-weight-bold"> {{itemid == null ? $t('forms.create-branches') : $t('forms.edit-branches')}}</h3>
      <div :class="`d-flex justify-content-end my-3 ${visibleState}`">
       <Switches
        v-model="editable"
        theme="custom"
        color="primary mx-2 d-inline"
        class="vue-switcher-small d-flex align-self-center"></Switches>
       <h6 class="font-weight-bold d-flex align-self-center">{{this.$t('forms.enable-form')}}</h6>
      </div>
     </b-card-header>
     <b-form
      @submit.prevent="setData"
      v-if="isLoad">
      <b-form-group
       :label="$t('forms.name-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.branchesForm.name_ar.$model"
        :state="!$v.branchesForm.name_ar.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.branchesForm.name_ar.required">{{`${$t('forms.name-ar')}
              ${$t('validations.required')}`}}
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.address-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.branchesForm.address_ar.$model"
        :state="!$v.branchesForm.address_ar.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.branchesForm.address_ar.required">{{`${$t('forms.address-ar')}
              ${$t('validations.required')}`}}
       </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
       :label="$t('forms.description-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <quill-editor
        :disabled="toggleState"
        required
        aria-describedby="v-desc"
        v-model.trim="$v.branchesForm.description_ar.$model"
        :state="!$v.branchesForm.description_ar.$error"
        :dir="direction"></quill-editor>
       <b-form-invalid-feedback
        id="v-desc"
        v-if="!$v.branchesForm.description_ar.required">{{`${$t('forms.description-ar')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.name-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.branchesForm.name_en.$model"
        :state="!$v.branchesForm.name_en.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.branchesForm.name_en.required">{{`${$t('forms.name-en')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>

      </b-form-group>
      <b-form-group
       :label="$t('forms.address-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.branchesForm.address_en.$model"
        :state="!$v.branchesForm.address_en.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.branchesForm.address_en.required">{{`${$t('forms.address-en')}
              ${$t('validations.required')}`}}
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.description-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <quill-editor
        :disabled="toggleState"
        required
        aria-describedby="v-desc"
        v-model.trim="$v.branchesForm.description_en.$model"
        :state="!$v.branchesForm.description_en.$error"
        :dir="direction"></quill-editor>
       <b-form-invalid-feedback v-if="!$v.branchesForm.description_en.required">{{`${$t('forms.description-en')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.date')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <datepicker
        :disabled="toggleState"
        :disabledDates="disabledDates"
        required
        :bootstrap-styling="true"
        v-model.trim="$v.branchesForm.creation_date.$model"
        :state="!$v.branchesForm.creation_date.$error"
        :dir="direction"
        format="yyyy-MM-dd"></datepicker>
      </b-form-group>
      <b-form-group
       :label="$t('forms.open-from')"
       :class="`mb-4 ${toggleShadow}`">
       <b-form-timepicker
        :disabled="toggleState"
        v-model.trim="$v.branchesForm.open_from.$model"
        :state="!$v.branchesForm.open_from.$error"
        right
        show-seconds
        locale="en"></b-form-timepicker>
      </b-form-group>
      <b-form-group
       :label="$t('forms.open-to')"
       :class="`mb-4 ${toggleShadow}`">
       <b-form-timepicker
        :disabled="toggleState"
        v-model.trim="$v.branchesForm.open_to.$model"
        :state="!$v.branchesForm.open_to.$error"
        left
        show-seconds
        locale="en"></b-form-timepicker>
      </b-form-group>
      <b-form-group
       :label="$t('forms.telephone')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.branchesForm.telephone.$model"
        :state="!$v.branchesForm.telephone.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.branchesForm.telephone.required">{{`${$t('forms.telephone')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.mobile')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.branchesForm.mobile.$model"
        :state="!$v.branchesForm.mobile.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.branchesForm.mobile.required">{{`${$t('forms.mobile')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>

      </b-form-group>
      <b-form-group
       :label="$t('forms.latitude')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.branchesForm.latitude.$model"
        :state="!$v.branchesForm.latitude.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.branchesForm.latitude.required">{{`${$t('forms.latitude')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.longitude')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.branchesForm.longitude.$model"
        :state="!$v.branchesForm.longitude.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.branchesForm.longitude.required">{{`${$t('forms.longitude')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>

      </b-form-group>
      <b-form-group
       :label="$t('forms.branch_code')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.branchesForm.branch_code.$model"
        :state="!$v.branchesForm.branch_code.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.branchesForm.branch_code.required">{{`${$t('forms.branch_code')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.choose-city')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <v-select
        :reduce="label => label.code"
        label="label"
        :disabled="toggleState"
        v-model="$v.branchesForm.city.$model"
        :state="!$v.branchesForm.city.$error"
        :options="cities"
        :dir="direction" />
      </b-form-group>
      <b-form-group>
       <div class="d-flex justify-content-start">
        <Switches
         :disabled="toggleState"
         v-model="isOpen"
         theme="custom"
         color="primary mx-2 d-inline"
         class="vue-switcher-small d-flex align-self-center"></Switches>
        <h6 class="d-flex align-self-center">{{$t('forms.is-open')}}</h6>
       </div>
      </b-form-group>
      <b-form-group>
       <div class="d-flex justify-content-start">
        <Switches
         :disabled="toggleState"
         v-model="active"
         theme="custom"
         color="primary mx-2 d-inline"
         class="vue-switcher-small d-flex align-self-center"></Switches>
        <h6 class="d-flex align-self-center">{{$t('forms.active')}}</h6>
       </div>
      </b-form-group>

      <div class="d-flex justify-content-between">
       <b-button
        type="submit"
        :disabled="disableSubmit || toggleState"
        variant="primary"
        class="mt-4 align-self-center align-self-baseline">{{ $t('forms.submit') }}
       </b-button>
      </div>
     </b-form>
     <template v-if="!isLoad">
      <div class="loading"></div>
     </template>
    </b-card-body>
   </b-card>
  </b-colxx>
 </b-row>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { validationMixin } from "vuelidate";
import { getDirection } from "../../utils";
import axios from "axios";
import Datepicker from "vuejs-datepicker";
import { barChartOptions } from '../../components/Charts/config';
import { defaultDirection } from '../../constants/config';
import { BIconArrowDownSquareFill } from 'bootstrap-vue';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import ThumbnailImage from "../../components/Cards/ThumbnailImage";
import Switches from "vue-switches";
import { mapGetters, mapActions } from 'vuex';

const {
 required,
 maxLength,
 integer
} = require("vuelidate/lib/validators");
export default {

 components: {
  "v-select": vSelect,
  datepicker: Datepicker,
  'quill-editor': quillEditor,
  ThumbnailImage,
  Switches

 },
 props: ['itemid', 'apiBase'],
 mixins: [validationMixin],
 validations: {
  branchesForm: {
   name_ar: {
    required,
    maxLength: maxLength(200),
   },
   name_en: {
    required,
    maxLength: maxLength(200),
   },
   description_ar: {
    required,
   },
   description_en: {
    required,
   },
   telephone: {
    required,
   },
   mobile: {
    required,
   },
   latitude: {
    required,
   },
   longitude: {
    required,
   },
   branch_code: {
    required
   },
   address_ar: {
    required,
   },
   address_en: {
    required
   },
   city: {
    required
   },
   creation_date: {
    required
   },
   open_from: {
    required
   },
    open_to: {
     required
    },

  },
 },
 data() {
  return {
   //value: '01:01:00',
   isOpen: false,
   visibleState: 'visible',
   active: true,
   disableSubmit: false,
   required: null,
   isfile: false,
   fileUrl: "",
   editable: false,
   toggleState: true,
   toggleShadow: "",
   isLoad: false,
   direction: getDirection().direction,
   dataresult: null,
   newCities: [],
   branchesForm: {
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    telephone: '',
    mobile: '',
    latitude: '',
    longitude: '',
    branch_code: '',
    address_ar: '',
    address_en: '',
    city: '',
    creation_date: '',
    open_from: '',
    open_to: ''
   },
   editorOption: {
    placeholder: '',
    modules: {
     toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
       { list: 'ordered' },
       { list: 'bullet' },
       { indent: '-1' },
       { indent: '+1' }
      ],
      ['link', 'image'],
      ['clean']
     ]
    }
   },
  }
 },
 created() {
  if (this.itemid == undefined || this.itemid == null) {
   this.visibleState = "invisible"
   this.toggleState = false;
   this.toggleShadow = "laffah-shadow";
   this.required = "required"

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
 computed: {
  disabledDates() {
   let today = new Date().getDate()
   let month = new Date().getMonth()
   let year = new Date().getFullYear()
   let newDate = new Date(year, month, today)
   return {
    to: newDate
   }
  },
  editor() {
   return this.$refs.myTextEditor.quill
  },
  ...mapGetters(["getCities"]),
  cities() {
   try {
    this.newCities = this.getCities.map(x => {
     return {
      label: x.locales[this.$i18n.locale].name,
      code: x.id,
     };
    });
    return this.newCities
   } catch (err) {
    return this.newCities
   }
  },

 },
 methods: {

  changeFile(event) {
   this.isfile = true;
   // Reference to the DOM input element
   var input = event.target;
   // Ensure that you have a file before attempting to read it
   if (input.files && input.files[0]) {
    // create a new FileReader to read this image and convert to base64 format
    var reader = new FileReader();
    // Define a callback function to run, when FileReader finishes its job
    reader.onload = (e) => {
     // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
     // Read image as base64 and set to imageData
     this.fileUrl = e.target.result;
    }
    // Start the reader job - read file as a data url (base64 format)
    reader.readAsDataURL(input.files[0]);

   }
  },
  onEditorBlur(editor) {
   console.log('editor blur!', editor)
  },
  onEditorFocus(editor) {
   console.log('editor focus!', editor)
  },
  onEditorReady(editor) {
   console.log('editor ready!', editor)
  },
  getData() {
   while (this.getCities == undefined || this.getCities == null) { //solve error getCities not fetched yet
    this.isLoad = false;
   }
   if (this.itemid != undefined || this.itemid != null) {
    axios
     .get(this.apiBase + '/' + this.itemid, {
      headers: {
       'Content-Type': 'multipart/form-data'
      }
     })
     .then(res => {
      // console.log(res.data.data);
      //  let date = this.branchesForm.post_date.toISOString()
      this.dataresult = res.data.data;
      this.$v.branchesForm.name_ar.$model = this.dataresult.locales.ar.name;
      this.$v.branchesForm.name_en.$model = this.dataresult.locales.en.name;
      this.$v.branchesForm.description_ar.$model = this.dataresult.locales.ar.description;
      this.$v.branchesForm.description_en.$model = this.dataresult.locales.en.description;
      this.$v.branchesForm.telephone.$model = this.dataresult.telephone;
      this.$v.branchesForm.mobile.$model = this.dataresult.mobile;
      this.$v.branchesForm.latitude.$model = this.dataresult.latitude;
      this.$v.branchesForm.longitude.$model = this.dataresult.longitude;
      this.$v.branchesForm.branch_code.$model = this.dataresult.branch_code;
      this.$v.branchesForm.address_ar.$model = this.dataresult.locales.ar.address;
      this.$v.branchesForm.address_en.$model = this.dataresult.locales.en.address;
      this.$v.branchesForm.city.$model = this.dataresult.city.id;
      this.isOpen = this.dataresult.is_open == "1" ? true : false;
      this.$v.branchesForm.creation_date.$model = new Date(this.dataresult.creation_date);
      this.$v.branchesForm.open_from.$model = this.dataresult.open_from;
      this.$v.branchesForm.open_to.$model = this.dataresult.open_to;
      this.active = this.dataresult.active == "1" ? true : false;
      // this.fileUrl = this.dataresult.image;

      this.isLoad = true;
     });
   } else {

    this.isLoad = true;
   }
  },
  setData() {
   this.disableSubmit = true
   this.isLoad = false;

   this.formData = new FormData();
   this.formData.append("en[name]", this.branchesForm.name_en);
   this.formData.append("en[description]", this.branchesForm.description_en);
   this.formData.append("ar[name]", this.branchesForm.name_ar);
   this.formData.append("ar[description]", this.branchesForm.description_ar);
   this.formData.append("telephone", this.branchesForm.telephone);
   this.formData.append("mobile", this.branchesForm.mobile);
   this.formData.append("latitude", this.branchesForm.latitude);
   this.formData.append("longitude", this.branchesForm.longitude);
   this.formData.append("en[address]", this.branchesForm.address_en);
   this.formData.append("ar[address]", this.branchesForm.address_ar);
   this.formData.append("branch_code", this.branchesForm.branch_code);
   this.formData.append("city_id", this.branchesForm.city);
   this.formData.append("creation_date", this.branchesForm.creation_date.toISOString());
   this.formData.append("open_from", this.branchesForm.open_from);
   this.formData.append("open_to", this.branchesForm.open_to);
   this.formData.append("active", this.active == true ? 1 : 0);
   this.formData.append("is_open", this.isOpen == true ? 1 : 0);
   // if(this.branchesForm.image)
   // if (this.isfile) { //check upload new file
   //     this.formData.append("image", this.branchesForm.image);
   // }
   if (this.itemid != null) {
    this.formData.append("_method", 'PUT');
    axios //PUT method
     .post(this.apiBase + '/' + this.itemid, this.formData, {
      headers: {
       'Content-Type': 'multipart/form-data'
      }
     })
     .then(
      res => {
       this.disableSubmit = false

       this.dataresult = res
       // console.log("res : " + this.dataresult.data.image)
       if (this.dataresult.data.success == true) {
        // window.location.href = '../../';
        this.$router.push('../branches-list')
        this.$notify("success", "Branches has been Updated Successfully", null, { duration: 5000, permanent: false });
       } else if (this.dataresult == undefined) {
        this.$notify("warning", "Branches was not Updated", "please try again Later", null, { duration: 5000, permanent: false });
        this.disableSubmit = false
        //  window.location.href = '../../';
       } else {
        this.$notify("warning", "Branches was not Updated", "please try again Later", null, { duration: 5000, permanent: false });
        this.disableSubmit = false

       }
      })
     .catch(error => {
      this.disableSubmit = false
      this.isLoad = true
      this.$notify("error", "Branches was not Updated", "Network Error", null, { duration: 5000, permanent: false });

     });
   } else {
    axios //POST method
     .post(this.apiBase, this.formData, {
      headers: {
       'Content-Type': 'multipart/form-data'
      }
     })
     .then(
      res => {
       this.disableSubmit = false
       this.dataresult = res
       // console.log("res : " + this.dataresult)

       if (this.dataresult.data.success == true) {
        this.$router.push('branches-list')
        this.$notify("success", "Branches has been Added Successfully", null, { duration: 5000, permanent: false });
        // window.location.href = '../../';
       } else if (this.dataresult == undefined) {
        this.$notify("warning", "Branches was not Added", "please try again Later", null, { duration: 5000, permanent: false });
        this.disableSubmit = false

        //  window.location.href = '../../';
       } else {
        this.$notify("warning", "Branches was not Added", "please try again Later", null, { duration: 5000, permanent: false });
        this.disableSubmit = false

       }
      })
     .catch(error => {
      this.disableSubmit = false
      this.isLoad = true
      this.$notify("error", "Branches was not Added", "Network Error", null, { duration: 5000, permanent: false });
      console.log(error)
     });
   }
  },
  ...mapActions(["fetchCities"]),

 },
 async mounted() {
  await this.getData()
  await this.fetchCities();
 },
}
</script>

<style lang="scss" scoped>
/deep/ .b-form-timepicker label.form-control{
  margin:0px !important;
      display: flex;
    align-items: center;
}
</style>
