<template>
 <b-modal
  :id="`modalright_customization_${id}`"
  ref="modalright"
  :title="id?$t('pages.customization'):$t('pages.customization-group')"
  modal-class="modal-right">
  <b-form
   v-if="isLoad"
   @submit.prevent="onValidateCategoryFormFormSubmit"
   class="av-tooltip tooltip-label-bottom">
   <b-form-group
    :label="$t('forms.name-ar')"
    class="has-float-label">
    <b-form-input
     required
     type="text"
     pat
     v-model.trim="$v.customizationGroup.ar.title.$model"
     :state="!$v.customizationGroup.ar.title.$error" />
    <!-- <b-form-invalid-feedback v-if="!$v.customizationGroup.ar.title.required">{{
            `${$t('forms.name-ar')}
          ${$t('validations.required')}`
          }}!
    </b-form-invalid-feedback> -->
   </b-form-group>
   <b-form-group
    :label="$t('forms.description-ar')"
    class="has-float-label">
    <quill-editor
     ref="myTextEditor"
     v-model.trim="$v.customizationGroup.ar.description.$model"
     :options="editorOption"
     @blur="onEditorBlur($event)"
     @focus="onEditorFocus($event)"
     @ready="onEditorReady($event)"
     :state="!$v.customizationGroup.ar.description.$error">
    </quill-editor>
    <b-form-invalid-feedback v-if="!$v.customizationGroup.ar.description.required">{{
            `${$t('forms.description-ar')}
          ${$t('validations.required')}`
          }}!
    </b-form-invalid-feedback>
    <b-form-invalid-feedback v-else-if="!$v.customizationGroup.ar.description.maxLength">Maximum 16
    </b-form-invalid-feedback>
   </b-form-group>
   <b-form-group
    :label="$t('forms.name-en')"
    class="has-float-label">
    <b-form-input
     required
     type="text"
     pat
     v-model.trim="$v.customizationGroup.en.title.$model"
     :state="!$v.customizationGroup.en.title.$error" />
    <!-- <b-form-invalid-feedback v-if="!$v.customizationGroup.en.title.required">{{
            `${$t('forms.name-en')}
          ${$t('validations.required')}`
          }}!
    </b-form-invalid-feedback> -->
   </b-form-group>
   <b-form-group
    :label="$t('forms.description-en')"
    class="has-float-label">
    <quill-editor
     ref="myTextEditor"
     v-model.trim="$v.customizationGroup.en.description.$model"
     :options="editorOption"
     @blur="onEditorBlur($event)"
     @focus="onEditorFocus($event)"
     @ready="onEditorReady($event)"
     :state="!$v.customizationGroup.en.description.$error">
    </quill-editor>
    <b-form-invalid-feedback v-if="!$v.customizationGroup.en.description.required">{{
            `${$t('forms.description-en')}
          ${$t('validations.required')}`
          }}!
    </b-form-invalid-feedback>
    <b-form-invalid-feedback v-else-if="!$v.customizationGroup.en.description.maxLength">Maximum 16
    </b-form-invalid-feedback>
   </b-form-group>
   <b-form-group
    v-if="!id"
    class="text-center">
    <thumbnail-image
     rounded
     small
     :src="srcUrl"
     class-name="m-4 w-30 h-25 m-1" />
   </b-form-group>
   <b-input-group
    v-if="!id"
    :prepend="$t('forms.image')"
    class="mb-3">
    <b-form-file
     type="image"
     @change="selectFile"
     :placeholder="$t('input-groups.choose-file')"
     accept="image/png, image/jpeg, image/svg" />
   </b-input-group>
   <b-form-group
    v-if="!id"
    :label="$t('forms.multi-selection')"
    :description="$t('forms.multi-selection-message')"
    class="mb-3">
    <switches
     type="number"
     value="0"
     v-model="set_switches_digit_val"
     theme="custom"
     color="primary"
     class="mr-4" />
   </b-form-group>
   <b-form-group
    v-else
    :label="$t('forms.price')"
    class="has-float-label">
    <b-form-input
     type="text"
     pat
     v-model.trim="$v.customizationGroup.added_value.$model"
     :state="!$v.customizationGroup.added_value.$error" />
    <b-form-invalid-feedback v-if="!$v.customizationGroup.added_value.required">{{
            `${$t('forms.name-ar')}
          ${$t('validations.required')}`
          }}!
    </b-form-invalid-feedback>
   </b-form-group>
   <b-button
    id="submit"
    type="submit"
    variant="primary"
    class="mr-1 d-none">
   </b-button>
  </b-form>
  <template v-if="isLoad" slot="modal-footer">
   <b-button
    variant="outline-secondary"
    @click="hideModal('modalright')">{{ $t('pages.cancel') }}
   </b-button>
   <label class="btn btn-primary" for="submit">{{ $t('pages.submit') }}</label>
  </template>
  <template v-else>
   <div class="loading"></div>
  </template>
 </b-modal>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import InputTag from "../../../components/Form/InputTag";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { BFormGroup } from 'bootstrap-vue'
import { validationMixin } from "vuelidate";
import Switches from "vue-switches";
import Colxx from "../../../components/Common/Colxx";
import { quillEditor } from "vue-quill-editor";
import ThumbnailImage from "@/components/Cards/ThumbnailImage";

const {
 required,
 alpha,
 maxLength,
 minLength,
 decimal,
 helpers
} = require("vuelidate/lib/validators");

export default {
 components: {
  "colxx": Colxx,
  "input-tag": InputTag,
  "b-from-group": BFormGroup,
  "v-select": vSelect,
  "quill-editor": quillEditor,
  'thumbnail-image': ThumbnailImage,
  "switches": Switches
 },
 props: ["attributes", 'id', 'obj'],
 data() {
  return {
   isLoad: true,
   url: this.id ? `customizations` : 'customizations/groups',
   label: `locales.${this.$i18n.locale}.title`,
   set_switches_digit_val: false,
   srcUrl: '',
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
  };
 },
 mixins: [validationMixin],
 computed: {
  editor() {
   return this.$refs.myTextEditor.quill
  },
  customizationGroup() {
   let selectedObj = this.obj('get')
   let cg = {
    id: undefined,
    ar: {
     title: '',
     description: ''
    },
    en: {
     title: '',
     description: ''
    },
    image: '',
    is_multi_selection: 0,
    added_value: 0,
    customization_group_id: this.id
   }
   if (selectedObj) {
    cg = { ...selectedObj.locales }
    cg.id = selectedObj.id
    if (!this.id) {
     cg.is_multi_selection = selectedObj.is_multi_selection
     cg.image = selectedObj.image
     this.srcUrl = selectedObj.image
    } else {
     cg.added_value = selectedObj.added_value
     cg.customization_group_id = selectedObj.customization_group_id
    }
   }
   return JSON.parse(JSON.stringify(cg).replace(/\:null/gi, "\:\"\""))

  }
 },
 validations() {
  if (!this.id) {
   return {
    customizationGroup: {
     ar: {
      title: { required },
      description: { required },
     },
     en: {
      title: { required },
      description: { required },
     },
     image: { required },
     is_multi_selection: {
      required,
      decimal,
      maxLength: maxLength(1),
     },
    }
   }
  } else {
   return {
    customizationGroup: {
     ar: {
      title: { required },
      description: { required },
     },
     en: {
      title: { required },
      description: { required },
     },
     added_value: {
      required,
     },
     customization_group_id: {
      required,
     },
    }
   }
  }
 },
 methods: {
  onEditorBlur(editor) {
   console.log('editor blur!', editor)
  },
  onEditorFocus(editor) {
   console.log('editor focus!', editor)
  },
  onEditorReady(editor) {
   console.log('editor ready!', editor)
  },
  onEditorChange({ editor, html, text }) {
   // console.log('editor change!', editor, html, text)
   this.contentBubble = html
  },
  onValidateCategoryFormFormSubmit: function () {
   this.isLoad = false
   console.log('submit', this.url)
   this.$v.customizationGroup.$touch();
   let data = new FormData();
   let ids = this.customizationGroup.id
   if (ids) {
    console.log('in side ids')
    data.append('_method', 'PUT');
    data.append("id", this.customizationGroup.id)
    // if (this.id !== undefined) {
    //   ids = `${this.id}/${this.customizationGroup.id}`
    //   console.log('group', ids)
    // }
   }
   if (typeof this.customizationGroup.image === 'string') {
    delete this.customizationGroup.image
   }
   Object.keys(this.$v.customizationGroup.$model).map((key) => {
    let obj = {}
    if (this.$v.customizationGroup.$model[key] instanceof Object) {
     Object.keys(this.$v.customizationGroup.$model[key]).map((k) => {
      return data.append(`${key}[${k}]`, this.$v.customizationGroup.$model[key][k])
     })
    }
    return !(['en', 'ar'].indexOf(key) !== -1) ?
     data.append(key, this.$v.customizationGroup.$model[key]) :
     ''
   });
   for (var pair of data.entries()) {
    console.log(pair[0] + ', ' + pair[1], typeof pair[1]);
   }

   this.$store.dispatch('handleSubmit', {
    url: ids ? `${this.url}/${ids}` : `${this.url}`,
    obj: data
   }).then(() => {
    this.hideModal('modalright')
    this.obj('refresh')
    this.isLoad = true
   })
  },
  setCityId(id, index) {
   this.batch.prices[index].city_id = id
  },
  selectFile(event) {
   // `files` is always an array because the file input may be in multiple mode
   this.$v.customizationGroup.image.$model = event.target.files[0];
   let imgUrl = this.customizationGroup.image
   if (imgUrl instanceof File && imgUrl.type.includes("image/")) {
    // create a new FileReader to read this image and convert to base64 format
    var reader = new FileReader();
    // Define a callback function to run, when FileReader finishes its job
    reader.onload = (e) => {
     // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
     // Read image as base64 and set to imageData
     this.srcUrl = e.target.result;
     console.log('file', this.srcUrl)
    }
    // Start the reader job - read file as a data url (base64 format)
    reader.readAsDataURL(imgUrl);
    console.log(imgUrl)
   }
   // this.$v.customizationGroup.image.$model = this.$refs.file.files;
  },
  hideModal(refname) {
   this.$refs[refname].hide();
  },
 },
 watch: {
  obj(val) {
   if (val.action === 'edit') {
    //todo:check reset the form
    console.log("val in modal : "+ val)
    console.log({ ...val.locales })

   } else {
    this.$v.$reset()
   }
  },
  set_switches_digit_val(val) {
   this.customizationGroup.is_multi_selection = 0
   if (val == true) {
    this.customizationGroup.is_multi_selection = 1
   }
  },
  'customizationGroup': {
   handler: function (val) {
    if (!this.id) {
     this.set_switches_digit_val = val.is_multi_selection === 1
    }
   },
   deep: true,
   immediate: true
  },
 }
};
</script>
