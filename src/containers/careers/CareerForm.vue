<template>
 <b-row>
  <b-colxx xxs="12">
   <b-card
    no-body
    class="mb-4">
    <b-card-body class="">
     <b-card-header class="d-flex justify-content-between mb-3 px-0">
      <h3 class="d-flex align-self-center font-weight-bold">
       {{ itemid == null ? $t('forms.create-career') : $t('forms.edit-career') }}</h3>
      <ThumbnailImage
       v-if="itemid !== undefined"
       rounded
       small
       :src="fileUrl"
       :alt="careersForm.name_en"
       class-name="m-4 w-12 h-100 m-1 " />
      <div :class="`d-flex justify-content-end my-3 ${visibleState}`">
       <Switches
        v-model="editable"
        theme="custom"
        color="primary mx-2 d-inline"
        class="vue-switcher-small d-flex align-self-center"></Switches>
       <h6 class="font-weight-bold d-flex align-self-center">{{ this.$t('forms.enable-form') }}</h6>
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
        v-model.trim="$v.careersForm.name_ar.$model"
        :state="!$v.careersForm.name_ar.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.careersForm.name_ar.required">{{
                  `${$t('forms.name-ar')}
              ${$t('validations.required')}`
                }}
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.type-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.careersForm.position_ar.$model"
        :state="!$v.careersForm.position_ar.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.careersForm.position_ar.required">{{
                  `${$t('forms.type-ar')}
              ${$t('validations.required')}`
                }}
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.benefit-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.careersForm.benefit_ar.$model"
        :state="!$v.careersForm.benefit_ar.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.careersForm.benefit_ar.required">{{
                  `${$t('forms.benefit-ar')}
              ${$t('validations.required')}`
                }}
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.description-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <quill-editor
        :disabled="toggleState"
        aria-describedby="v-desc"
        v-model.trim="careersForm.description_ar"
        :dir="direction"></quill-editor>
      </b-form-group>
      <b-form-group
       :label="$t('forms.name-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.careersForm.name_en.$model"
        :state="!$v.careersForm.name_en.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.careersForm.name_en.required">{{
                  `${$t('forms.name-en')}
              ${$t('validations.required')}`
                }}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.type-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.careersForm.position_en.$model"
        :state="!$v.careersForm.position_en.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.careersForm.position_en.required">{{
                  `${$t('forms.type-en')}
              ${$t('validations.required')}`
                }}
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.benefit-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        type="text"
        v-model.trim="$v.careersForm.benefit_en.$model"
        :state="!$v.careersForm.benefit_en.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.careersForm.benefit_en.required">{{
                  `${$t('forms.benefit-en')}
              ${$t('validations.required')}`
                }}
       </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
       :label="$t('forms.description-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <quill-editor
        :disabled="toggleState"
        aria-describedby="v-desc"
        v-model.trim="careersForm.description_en"
        :dir="direction"></quill-editor>
      </b-form-group>
      <b-form-group
       :label="$t('forms.from-date')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <datepicker
        :disabled="toggleState"
        :disabledDates="disabledDates"
        :bootstrap-styling="true"
        v-model.trim="careersForm.from_date"
        :dir="direction"
        format="yyyy-MM-dd"></datepicker>
      </b-form-group>
      <b-form-group
       :label="$t('forms.to-date')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <datepicker
        :disabled="toggleState"
        :disabledDates="disabledDates"
        :bootstrap-styling="true"
        v-model.trim="careersForm.to_date"
        :dir="direction"
        format="yyyy-MM-dd"></datepicker>
      </b-form-group>
      <b-form-group
       :label="$t('forms.telephone')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        required
        :disabled="toggleState"
        type="text"
        v-model.trim="$v.careersForm.telephone.$model"
        :state="!$v.careersForm.telephone.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.careersForm.telephone.required">{{
                  `${$t('forms.telephone')}
              ${$t('validations.required')}`
                }}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.salary')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        type="text"
        v-model.trim="careersForm.salary"
        :dir="direction" />
      </b-form-group>
      <b-form-group
       :label="$t('forms.choose-branch')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-select
        :disabled="toggleState"
        v-model="$v.careersForm.branch.$model"
        :state="!$v.careersForm.branch.$error"
        :options="branches"
        :dir="direction"></b-form-select>
       <b-form-invalid-feedback
        :class="{'d-block invalid-feedback':careersForm.branch == ''}"
        v-if="!$v.careersForm.branch.required">{{
                  `${$t('forms.branch')}
              ${$t('validations.required')}`
                }}
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :prepend="$t('forms.image')"
       :class="`mb-4 ${toggleShadow}`">
       <b-form-file
        :disabled="toggleState"
        type="file"
        id="file"
        ref="file"
        @change="changeFile"
        :placeholder="$t('input-groups.choose-image')"
        v-model.trim="careersForm.image"
        accept="image/png, image/jpeg, image/svg" />
      </b-form-group>
      <div class="d-flex justify-content-between">
       <b-button
        type="submit"
        :disabled="disableSubmit || toggleState"
        variant="primary"
        class="mt-4 align-self-center align-self-baseline">{{ $t('forms.submit') }}
       </b-button>
       <ThumbnailImage
        v-if="itemid !== undefined"
        rounded
        small
        :src="fileUrl"
        :alt="careersForm.name_en"
        class-name="m-4 w-30 h-25 m-1" />
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
// note: changing position to type to Benefit the display
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
  careersForm: {
   name_ar: {
    required,
    maxLength: maxLength(200),
   },
   name_en: {
    required,
    maxLength: maxLength(200),
   },
   position_ar: {
    required,
   },
   position_en: {
    required
   },
   benefit_ar: {
    required
   },
   benefit_en: {
    required
   },
   telephone: {
    required,
   },
   branch: {
    required
   },

  },
 },
 data() {
  return {
   visibleState: 'visible',
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
   newBranches: [
    //  { label: '', code: '' }, { label: '', code: '' }, { label: '', code: '' }, { label: '', code: '' }, { label: '', code: '' }
   ],
   careersForm: {
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    benefit_ar: '',
    benefit_en: '',
    position_ar: '',
    position_en: '',
    telephone: '',
    salary: '',
    from_date: '',
    to_date: '',
    branch: '',
    image: null
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
   this.required = "required";
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
  ...mapGetters(["getBranches"]),
  branches() {
   try {
    this.newBranches = this.getBranches.map(x => {
     return {
      text: x.locales[this.$i18n.locale].name,
      value: x.id,
     };
    });
    return this.newBranches
   } catch (err) {
    return this.newBranches
   }
  }

 },
 methods: {
  changeFile(event) {
   this.isfile = true;
   var input = event.target;
   if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = (e) => {
     this.fileUrl = e.target.result;
    }
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
   if (this.itemid != undefined || this.itemid != null) {
    axios
     .get(this.apiBase + '/' + this.itemid, {
      headers: {
       'Content-Type': 'multipart/form-data'
      }
     })
     .then(res => {

      //this.branches();
      this.dataresult = res.data.data;
      this.$v.careersForm.name_ar.$model = this.dataresult.locales.ar.name;
      this.$v.careersForm.name_en.$model = this.dataresult.locales.en.name;
      this.careersForm.description_ar = this.dataresult.locales.ar.description;
      this.careersForm.description_en = this.dataresult.locales.en.description;
      this.$v.careersForm.position_en.$model = this.dataresult.locales.en.position;
      this.$v.careersForm.position_ar.$model = this.dataresult.locales.ar.position;
      this.$v.careersForm.benefit_ar.$model = this.dataresult.locales.ar.benefit;
      this.$v.careersForm.benefit_en.$model = this.dataresult.locales.en.benefit;
      this.$v.careersForm.telephone.$model = this.dataresult.telephone;
      this.careersForm.salary = this.dataresult.salary;
      this.$v.careersForm.branch.$model = this.dataresult.branch_id
      this.careersForm.from_date = new Date(this.dataresult.from_date);
      this.careersForm.to_date = new Date(this.dataresult.to_date);
      this.fileUrl = this.dataresult.image;
      this.isLoad = true;

     });
   } else {
    this.isLoad = true;
    this.$v.careersForm.name_ar.$model = "";
    this.$v.careersForm.name_en.$model = "";
    this.$v.careersForm.position_en.$model = ""
    this.$v.careersForm.position_ar.$model = ""
    this.$v.careersForm.benefit_ar.$model = ""
    this.$v.careersForm.benefit_en.$model = ""
    this.$v.careersForm.telephone.$model = ""
    this.$v.careersForm.branch.$model = ""
   }
  },
  setData() {
   this.$v.careersForm.$touch();
   if (!this.$v.careersForm.$anyError) {
    this.disableSubmit = true
    this.isLoad = false;
    this.formData = new FormData();
    this.formData.append("en[name]", this.careersForm.name_en);
    this.formData.append("en[description]", this.careersForm.description_en);
    this.formData.append("ar[name]", this.careersForm.name_ar);
    this.formData.append("ar[description]", this.careersForm.description_ar);
    this.formData.append("ar[benefit]", this.careersForm.benefit_ar);
    this.formData.append("en[benefit]", this.careersForm.benefit_en);
    this.formData.append("ar[position]", this.careersForm.position_ar);
    this.formData.append("en[position]", this.careersForm.position_en);
    this.formData.append("telephone", this.careersForm.telephone);
    this.formData.append("salary", this.careersForm.salary);
    this.formData.append("branch_id", this.careersForm.branch);
    if(this.careersForm.from_date != ""){
    this.formData.append("from_date", this.careersForm.from_date.toISOString());
    }
    if(this.careersForm.to_date != ""){
    this.formData.append("to_date", this.careersForm.to_date.toISOString());
    }
    if (this.careersForm.image)
     if (this.isfile) { //check upload new file
      this.formData.append("image", this.careersForm.image);
     }
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
        console.log("res : " + this.dataresult.data.image)
        if (this.dataresult.data.success == true) {
         // window.location.href = '../../';
         this.$router.push('../careers-list')
         this.$notify("success", "Career has been Updated Successfully", null, {
          duration: 5000,
          permanent: false
         });
        } else if (this.dataresult == undefined) {
         this.$notify("warning", "Career was not Updated", "please try again Later", null, {
          duration: 5000,
          permanent: false
         });
         this.disableSubmit = false
         //  window.location.href = '../../';
        } else {
         this.$notify("warning", "Career was not Updated", "please try again Later", null, {
          duration: 5000,
          permanent: false
         });
         this.disableSubmit = false

        }
       })
      .catch(error => {
       this.isLoad = true
       this.disableSubmit = false
       this.$notify("error", "Career was not Updated", "Network Error", null, { duration: 5000, permanent: false });

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
        console.log("res : " + this.dataresult)

        if (this.dataresult.data.success == true) {
         this.$router.push('careers-list')
         this.$notify("success", "Career has been Added Successfully", null, { duration: 5000, permanent: false });
         // window.location.href = '../../';
        } else if (this.dataresult == undefined) {
         this.$notify("warning", "Career was not Added", "please try again Later", null, {
          duration: 5000,
          permanent: false
         });
         this.disableSubmit = false
         //  window.location.href = '../../';
        } else {
         this.$notify("warning", "Career was not Added", "please try again Later", null, {
          duration: 5000,
          permanent: false
         });
         this.disableSubmit = false
        }
       })
      .catch(error => {
       this.disableSubmit = false
       this.isLoad = true
       this.$notify("error", "Career was not Added", "Network Error", null, { duration: 5000, permanent: false });
       console.log(error)
      });
    }
   }
  },
  ...mapActions(["fetchBranches"]),

 },
 async mounted() {
  await this.getData();
  await this.fetchBranches();

 },
}
</script>

<style lang="scss" scoped>

</style>
