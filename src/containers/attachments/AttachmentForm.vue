<template>
 <b-row>
  <b-colxx xxs="12">
   <b-card class="mb-4">
    <b-card-body class="pt-1">
     <b-card-header class="d-flex justify-content-between mb-3 px-0">
      <h3 class="d-flex align-self-center text-uppercase font-weight-bold"> {{itemid == null ? $t('forms.create-attachment') : $t('forms.edit-attachment')}}</h3>
      <ThumbnailImage
       v-if="itemid !== undefined && itemtype == 'images'"
       rounded
       small
       :src="fileUrl"
       :alt="attachForm.title_en"
       class-name="m-4 w-12 h-100 m-1 " />
      <div :class="`d-flex justify-content-end my-3 ${visibleState}`">
       <Switches
        v-model="editable"
        theme="custom"
        color="primary mx-2 d-inline"
        class="vue-switcher-small d-flex align-self-center"></Switches>
       <h6 class="font-weight-bold d-flex align-self-center">{{$t('forms.enable-editing')}}</h6>
      </div>
     </b-card-header>
     <!-- <img :src="dataresult.path" alt=""> -->
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
        v-model.trim="$v.attachForm.title_en.$model"
        :state="!$v.attachForm.title_en.$error"
        :placeholder="$t('input-groups.english-name')"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.attachForm.title_en.required">{{`${$t('forms.title-en')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       :label="$t('forms.description-en')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-textarea
        :disabled="toggleState"
        type="text"
        row="3"
        v-model.trim="$v.attachForm.description_en.$model"
        :state="attachForm.description_en"
        :placeholder="$t('input-groups.english-description')"
        :dir="direction" />
       <b-form-invalid-feedback
        ack
        v-if="!$v.attachForm.description_en.required">{{`${$t('forms.description-en')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       v-if="ar"
       :label="$t('forms.title-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        v-model.trim="$v.attachForm.title_ar.$model"
        :placeholder="$t('input-groups.arabic-name')"
        :dir="direction" />
       <b-form-invalid-feedback v-if="!$v.attachForm.title_ar.required">{{`${$t('forms.title-ar')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       v-if="ar"
       :label="$t('forms.description-ar')"
       :class="`has-float-label mb-4 ${toggleShadow}`">
       <b-form-textarea
        :disabled="toggleState"
        type="text"
        v-model.trim="$v.attachForm.description_ar.$model"
        :placeholder="$t('input-groups.arabic-description')"
        :dir="direction" />
      </b-form-group>
      <b-form-group
       v-if="itemtype == 'youtube-videos'"
       :prepend="$t('forms.file')"
       :class="`mb-4 ${toggleShadow}`">
       <b-form-input
        :disabled="toggleState"
        required
        type="text"
        :placeholder="$t('input-groups.youtube-link')"
        v-model.trim="$v.attachForm.url.$model"
        :state="!$v.attachForm.url.$error" />
       <b-form-invalid-feedback v-if="!$v.attachForm.title_en.required">{{`${$t('forms.youtube-link')}
              ${$t('validations.required')}`}}!
       </b-form-invalid-feedback>
       <b-form-invalid-feedback>{{`${$t('forms.youtube-link')}
              ${$t('validations.not-youtube-link')}`}}!
       </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
       v-if="itemtype == 'files' && itemid !==undefined"
       :prepend="$t('forms.file')"
       :class="`mb-4 ${toggleShadow}`">
       <b-form-file
        :disabled="toggleState"
        type="file"
        @change="changeFile"
        :placeholder="$t('input-groups.choose-file')"
        v-model.trim="$v.attachForm.file.$model"
        :state="!$v.attachForm.file.$error" />
      </b-form-group>
      <b-form-group
       v-if="itemtype == 'files' && itemid == undefined"
       :prepend="$t('forms.file')"
       :class="`mb-4 ${toggleShadow}`">
       <b-form-file
        :disabled="toggleState"
        required
        type="file"
        @change="changeFile"
        :placeholder="$t('input-groups.choose-file')"
        v-model.trim="$v.attachForm.file.$model"
        :state="!$v.attachForm.file.$error" />
      </b-form-group>
      <b-form-group
       v-if="itemtype == 'images' && itemid !== undefined"
       :prepend="$t('forms.image')"
       :class="`mb-4 ${toggleShadow}`">
       <b-form-file
        :disabled="toggleState"
        type="file"
        @change="changeFile"
        :placeholder="$t('input-groups.choose-image')"
        v-model.trim="$v.attachForm.file.$model"
        :state="!$v.attachForm.file.$error" />
      </b-form-group>
      <b-form-group
       v-if="itemtype == 'images' & itemid == undefined"
       :prepend="$t('forms.image')"
       :class="`mb-4 ${toggleShadow}`">
       <b-form-file
        :disabled="toggleState"
        required
        type="file"
        @change="changeFile"
        :placeholder="$t('input-groups.choose-image')"
        v-model.trim="$v.attachForm.file.$model"
        :state="!$v.attachForm.file.$error" />
      </b-form-group>
      <div class="d-flex justify-content-between">
       <b-button
        type="submit"
        :disabled="disableSubmit || toggleState"
        variant="primary"
        class="mt-4 align-self-center align-self-baseline">{{ $t('forms.submit') }}
       </b-button>
       <ThumbnailImage
        v-if="itemid !== undefined && itemtype == 'images'"
        rounded
        small
        :src="fileUrl"
        :alt="attachForm.title_en"
        class-name="m-4 w-30 h-25 m-1" />
      </div>
     </b-form>
    </b-card-body>
    <template v-if="!isLoad">
     <div class="loading"></div>
    </template>
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
import { barChartOptions } from '../../components/Charts/config';
import { defaultDirection } from '../../constants/config';
import { BIconArrowDownSquareFill } from 'bootstrap-vue';
import ThumbnailImage from "../../components/Cards/ThumbnailImage";
import Switches from "vue-switches";

const {
 required,
 maxLength,
 url,
} = require("vuelidate/lib/validators");
export default {

 components: {
  "v-select": vSelect,
  ThumbnailImage,
  Switches

 },
 props: ['page_id', 'itemid', 'itemtype', 'apiBase'],
 mixins: [validationMixin],
 validations: {
  attachForm: {
   title_en: {
    required,
    maxLength: maxLength(100),
   },
   description_en: {
    required,
   },
   title_ar: {
    required,
    maxLength: maxLength(100),
   },
   description_ar: {
    required,
   },
   file: {
    required
   },
   url: {
    required,
    url
   }
  },
 },
 data() {
  return {
   ar: true,
   visibleState: "visible",
   disableSubmit: false,
   required: null,
   isfile: false,
   fileUrl: "",
   visibleState: "",
   editable: false,
   toggleState: true,
   toggleShadow: "",
   isLoad: false,
   direction: getDirection().direction,
   dataresult: null,
   attachForm: {
    title_en: '',
    description_en: '',
    title_ar: '',
    description_ar: '',
    file: null,
    url: '',
   },
  }
 },
 created() {
  if ((this.itemid == undefined || this.itemid == null) || true) {
   this.visibleState = "invisible"
   this.toggleState = false;
   this.toggleShadow = "fishday-shadow";
   this.required = "required"

  }
 },
 watch: {
  editable(val) {
   if (val == true) {
    this.toggleState = false;
    this.toggleShadow = "fishday-shadow";
   } else {
    this.toggleState = true;
    this.toggleShadow = "";
   }
  },
 },

 methods: {
  changeFile(event) {
   this.isfile = true;
   if (this.itemtype == "images") {
    var input = event.target;
    if (input.files && input.files[0]) {
     var reader = new FileReader();
     reader.onload = (e) => {
      this.fileUrl = e.target.result;
     }
     reader.readAsDataURL(input.files[0]);
    }
   }
  },
  getData() {
   if (this.itemid != undefined) {
    axios
     .get(this.apiBase + '/' + this.itemtype.toLowerCase() + '/' + this.page_id + '/' + this.itemid)
     .then(res => {
      this.dataresult = res.data.data;
      //console.log("test : " +JSON.stringify(this.dataresult.locales) )
      this.$v.attachForm.title_en.$model = this.dataresult.locales.en == undefined ? '' : this.dataresult.locales.en.title;
      this.$v.attachForm.description_en.$model = this.dataresult.locales.en == undefined ? '' : this.dataresult.locales.en.description;
      this.$v.attachForm.title_ar.$model = this.dataresult.locales.ar == undefined ? '' : this.dataresult.locales.ar.title;
      this.$v.attachForm.description_ar.$model = this.dataresult.locales.ar == undefined ? '' : this.dataresult.locales.ar.description;
      if (this.itemtype == 'youtube-videos') {
       this.$v.attachForm.url.$model = this.dataresult.path;
      }
      this.fileUrl = this.dataresult.path;
      this.isLoad = true;
     })
   } else {
    this.isLoad = true;
   }
  },
  setData() {
   this.disableSubmit = true
   this.formData = new FormData();
   this.formData.append("en[title]", this.attachForm.title_en);
   this.formData.append("en[description]", this.attachForm.description_en);
   this.formData.append("ar[title]", this.attachForm.title_ar);
   this.formData.append("ar[description]", this.attachForm.description_ar);
   if (this.itemtype == 'youtube-videos') {
    this.formData.append("path", this.attachForm.url);
   }
   if (this.isfile) { //check upload new file
    this.formData.append("path", this.attachForm.file);
   }
   if (this.itemid != null) {
    this.formData.append("_method", 'PUT');
    this.isLoad = false;
    axios
     .post(this.apiBase + '/' + this.itemtype.toLowerCase() + '/' + this.page_id + '/' + this.itemid, this.formData, {
      headers: {
       'Content-Type': 'multipart/form-data'
      }
     })
     .then(
      res => {
       this.disableSubmit = false
       this.dataresult = res
       console.log("res : " + this.dataresult.data.file)
       if (this.dataresult.data.success == true) {
        // window.location.href = '../../';
        this.$router.push('../../../attachment-list/' + this.page_id)
        this.$notify("success", "Attachment has been Updated Successfully", null, { duration: 5000, permanent: false });
       } else {
        this.$notify("warning", "Attachment was not Updated", "please try again Later", null, { duration: 5000, permanent: false });

        //window.location.href = '../../';
       }
      })
     .catch(error => {
      this.isLoad = true
      this.disableSubmit = false
      this.$notify("error", "Attachment was not Updated", "Network Error", null, { duration: 5000, permanent: false });

     });
   } else {
    this.isLoad = false;
    axios
     .post(this.apiBase + '/' + this.itemtype.toLowerCase() + '/' + this.page_id, this.formData, {
      headers: {
       'Content-Type': 'multipart/form-data'
      }
     })
     .then(
      res => {
       this.disableSubmit = false;
       this.dataresult = res
       console.log("res : " + this.dataresult)
       if (this.dataresult.data.success == true) {
        this.$router.push('../../attachment-list/' + this.page_id)
        this.$notify("success", "Attachment has been Added Successfully", null, { duration: 5000, permanent: false });
        // window.location.href = '../../';
       }
       if (this.dataresult.success == false) {
        this.$notify("warning", "Attachment was not Added", "please try again Later", null, { duration: 5000, permanent: false });
        //  window.location.href = '../../';
       }
      })
     .catch(error => {
      this.disableSubmit = false;
      this.isLoad = true
      this.$notify("error", "Attachment was not Added", "Network Error", null, { duration: 5000, permanent: false });
     })
   }
  },

 },
 async mounted() {
  await this.getData()
 },
}
</script>

<style lang="scss" scoped>

</style>
