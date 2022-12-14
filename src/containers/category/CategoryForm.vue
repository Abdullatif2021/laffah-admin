<template>
 <b-row>
  <b-colxx xxs="12">
   <b-card
    no-body
    class="mb-4">
    <b-card-body class="">
     <b-card-header class="d-flex justify-content-between mb-3 px-0">
      <h3 class="d-flex align-self-center text-uppercase font-weight-bold">
       {{ itemid == null ? $t('forms.create-category') : $t('forms.edit-category') }}</h3>
      <ThumbnailImage
       v-if="itemid !== undefined"
       rounded
       small
       :src="fileUrl"
       :alt="categoryFrom.title_en"
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
       :label="$t('forms.title-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.categoryFrom.title_en.$model"
        :state="!$v.categoryFrom.title_en.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.categoryFrom.title_en.required">{{
                  `${$t('forms.title-en')}
              ${$t('validations.required')}`
                }}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.description-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <quill-editor
        :disabled="toggleState"
        required
        aria-describedby="v-desc"
        v-model.trim="$v.categoryFrom.description_en.$model"
        :state="!$v.categoryFrom.description_en.$error"
        :dir="direction"></quill-editor>
       <b-form-invalid-feedback v-if="!$v.categoryFrom.description_en.required">{{
                  `${$t('forms.description-en')}
              ${$t('validations.required')}`
                }}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.title-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.categoryFrom.title_ar.$model"
        :state="!$v.categoryFrom.title_ar.$error"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.categoryFrom.title_ar.required">{{
                  `${$t('forms.title-ar')}
              ${$t('validations.required')}`
                }}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.description-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <quill-editor
        :disabled="toggleState"
        required
        aria-describedby="v-desc"
        v-model.trim="$v.categoryFrom.description_ar.$model"
        :state="!$v.categoryFrom.description_ar.$error"
        :dir="direction"></quill-editor>
       <b-form-invalid-feedback v-if="!$v.categoryFrom.description_ar.required">{{
                  `${$t('forms.description-ar')}
              ${$t('validations.required')}`
                }}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.choose-parent-category')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <v-select
        :reduce="label => label.code"
        label="label"
        :disabled="toggleState"
        v-model="categoryFrom.parent_id"
        :options="categories"
        :dir="direction">
        <template #search="{attributes, events}">
         <input class="vs__search" v-bind="attributes" v-on="events" />
        </template>
       </v-select>
      </b-form-group>
      <b-form-group>
       <div class="d-flex justify-content-start">
        <Switches
         :disabled="toggleState"
         v-model="active"
         theme="custom"
         color="primary mx-2 d-inline"
         class="vue-switcher-small d-flex align-self-center"></Switches>
        <h6 class="d-flex align-self-center">{{$t('forms.checkout-accessories')}}</h6>
       </div>
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
        v-model.trim="$v.categoryFrom.image.$model"
        :state="!$v.categoryFrom.image.$error"
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
        :alt="categoryFrom.title_en"
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
  categoryFrom: {
   title_en: {
    required,
    maxLength: maxLength(200),
   },
   description_en: {
    required,
   },
   title_ar: {
    required,
    maxLength: maxLength(200),
   },
   description_ar: {
    required,
   },
   image: {
    required
   }

  },
 },
 data() {
  return {
   active: false,
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
   newCategories: [
    //  { label: '', code: '' }, { label: '', code: '' }, { label: '', code: '' }, { label: '', code: '' }, { label: '', code: '' }
   ],
   categoryFrom: {
    title_en: '',
    description_en: '',
    title_ar: '',
    description_ar: '',
    parent_id: {
     label: undefined,
     code: undefined
    },
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
  if ((this.itemid == undefined || this.itemid == null) || true ) {
   this.visibleState = "invisible"
   this.toggleState = false;
   this.toggleShadow = "fishday-shadow";
   this.required = "required";
  }
 },

 watch: {
  editable(val) {
   if (val) {
    this.toggleState = false;
    this.toggleShadow = "fishday-shadow";
   } else {
    this.toggleState = true;
    this.toggleShadow = "";

   }
  },
 },
 computed: {
  editor() {
   return this.$refs.myTextEditor.quill
  },
  ...mapGetters('category', ["getCategoriesList"]),
  categories() {
   try {
    this.newCategories = this.getCategoriesList.map(x => {
     return {
      label: x.locales[this.$i18n.locale].title,
      code: x.id,
     };
    })
    if (this.itemid != undefined || this.itemid != null) {
     this.newCategories = this.newCategories.filter(a => a.code != this.dataresult.id)
    }

    return this.newCategories
   } catch (err) {
    return this.newCategories
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
      this.$v.categoryFrom.title_en.$model = this.dataresult.locales.en.title;
      this.$v.categoryFrom.description_en.$model = this.dataresult.locales.en.description;
      this.$v.categoryFrom.title_ar.$model = this.dataresult.locales.ar.title;
      this.$v.categoryFrom.description_ar.$model = this.dataresult.locales.ar.description;
      this.categoryFrom.parent_id = this.categories.filter(x => x.code == parseInt(this.dataresult.parent_id))
      console.log('this.categoryFrom.parent_id',this.categoryFrom.parent_id, ' === ', this.dataresult.parent_id, this.categories.filter(x => x.code == parseInt(this.dataresult.parent_id)))
      this.active = this.dataresult.add_to_menu == "1" ? true : false;
      this.fileUrl = this.dataresult.image;
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
   this.formData.append("en[title]", this.categoryFrom.title_en);
   this.formData.append("en[description]", this.categoryFrom.description_en);
   this.formData.append("ar[title]", this.categoryFrom.title_ar);
   this.formData.append("ar[description]", this.categoryFrom.description_ar);
   if (this.categoryFrom.parent_id.code !== undefined) {
    this.formData.append("parent_id", this.categoryFrom.parent_id.code);
   }
   this.formData.append("add_to_menu", this.active == true ? "1" : "0");
   if (this.categoryFrom.image)
    if (this.isfile) { //check upload new file
     this.formData.append("image", this.categoryFrom.image);
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
       //console.log("res : " + this.dataresult.data.image)
       if (this.dataresult.data.success == true) {
        // window.location.href = '../../';
        this.$router.push('../list')
        this.$notify("success", "Category has been Updated Successfully", null, {
         duration: 5000,
         permanent: false
        });
       } else if (this.dataresult == undefined) {
        this.$notify("warning", "Category was not Updated", "please try again Later", null, {
         duration: 5000,
         permanent: false
        });
        this.disableSubmit = false
        //  window.location.href = '../../';
       } else {
        this.$notify("warning", "Category was not Updated", "please try again Later", null, {
         duration: 5000,
         permanent: false
        });
        this.disableSubmit = false

       }
      })
     .catch(error => {
      this.isLoad = true
      this.disableSubmit = false
      this.$notify("error", "Category was not Updated", "Network Error", null, { duration: 5000, permanent: false });

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
       //console.log("res : " + this.dataresult)

       if (this.dataresult.data.success == true) {
        this.$router.push('list')
        this.$notify("success", "Category has been Added Successfully", null, { duration: 5000, permanent: false });
        // window.location.href = '../../';
       } else if (this.dataresult == undefined) {
        this.$notify("warning", "Category was not Added", "please try again Later", null, {
         duration: 5000,
         permanent: false
        });
        this.disableSubmit = false
        //  window.location.href = '../../';
       } else {
        this.$notify("warning", "Category was not Added", "please try again Later", null, {
         duration: 5000,
         permanent: false
        });
        this.disableSubmit = false
       }
      })
     .catch(error => {
      this.disableSubmit = false
      this.isLoad = true
      this.$notify("error", "Category was not Added", "Network Error", null, { duration: 5000, permanent: false });
      console.log(error)
     });
   }
  },
  ...mapActions('category', ["loadCategoriesList", ]),
 },
 async mounted() {
  await this.getData();
  //await this.$store.dispatch('category/loadCategoriesList')
  await this.loadCategoriesList()
 },
}
</script>

<style lang="scss" scoped>

</style>
