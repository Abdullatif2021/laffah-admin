<template>
 <b-colxx>
  <b-card class="mb-4">
   <div class="d-flex justify-content-between">
    <b-card-title>
     Attribute Values :
    </b-card-title>
    <div class="top-right-button-container">
     <b-button
      v-if="authorSuperadmin"
      v-b-modal="'addNew'"
      variant="primary"
      class="top-right-button"
      @click="resetForm()">{{ $t('pages.add-new') }}
     </b-button>
    </div>
   </div>
   <b-alert
    show
    v-for="value in attributeValues"
    :key="value.id"
    class="d-flex justify-content-between shadow"
    :class="value.code == attr_val_id ? 'addClass' : '' "
    variant="primary">
    <span> {{ value.label_en }}</span>
    <span> {{ value.label_ar }}</span>
    <div class="d-flex justify-content-center">
     <a v-if="authorSuperadmin" class="custom-control-icon" href="#" @click="fillForm(value)" v-b-modal="`edit${value.code}`">
      <i class="simple-icon-pencil"></i>
     </a>
     <a v-if="authorSuperadmin" class="custom-control-icon" href="#" @click="delAttVal(value)" v-b-modal="`delete${value.code}`">
      <i class="simple-icon-trash"></i>
     </a>
    </div>
   </b-alert>
  </b-card>
  <b-modal
   hide-footer
   :id="modal"
   ref="attributeValuesModal"
   :title="$t('forms.edit-attribute-value')"
   :modal-class="modal.includes('delete') ? '' : 'modal-right'">
   <div v-if="modal.includes('delete')">
    <h3>{{ $t("are-you-sure-delete") }}</h3>
    <b-button
     size="xs"
     variant="danger"
     @click="deleteItem()"
     class="mr-1">{{ $t("delete") }}
    </b-button>
    <b-button
     size="xs"
     variant="light"
     @click="hideModal('attributeValuesModal')">{{ $t("cancel") }}
    </b-button>
   </div>
   <b-form
    v-else
    @submit.prevent="sendAttrValue">
    <b-form-group
     :label="$t('forms.name-en')"
     :class="`has-float-label mb-4 ${toggleShadow}`">
     <b-form-input
      required
      type="text"
      v-model.trim="$v.attribute_value_en.$model"
      :state="!$v.attribute_value_en.$error"
      :dir="direction" />
    </b-form-group>
    <b-form-group
     :label="$t('forms.name-ar')"
     :class="`has-float-label mb-4 ${toggleShadow}`">
     <b-form-input
      required
      type="text"
      v-model.trim="$v.attribute_value_ar.$model"
      :state="!$v.attribute_value_ar.$error"
      :dir="direction" />
    </b-form-group>
    <b-button
     variant="primary"
     type="submit"
     class="mr-1">{{$t('forms.submit')}}</b-button>
    <b-button
     variant="secondary"
     @click="hideModal('attributeValuesModal')">{{$t('forms.cancel')}}</b-button>
   </b-form>
  </b-modal>
 </b-colxx>
</template>

<script>
import InputTag from "../../components/Form/InputTag";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Datepicker from "vuejs-datepicker";
import axios from "axios";
import { validationMixin } from "vuelidate";
import { apiUrl } from "@/constants/config";
import Switches from "vue-switches";
import { decrypt } from '../../utils';
import { getDirection } from "@/utils";
import { BIconPlusCircle, BIconXCircle } from "bootstrap-vue";

const {
 required,
 email,
 maxLength,
 integer
} = require("vuelidate/lib/validators");

export default {
 name: "AttributeForm",
 props: ['attribute_id'],

 components: {
  "input-tag": InputTag,
  "v-select": vSelect,
  "b-icon-plus-circle": BIconPlusCircle,
  "b-icon-x-circle": BIconXCircle,
  "datepicker": Datepicker,
  Switches
 },
 mixins: [validationMixin],
 validations: {
  attribute_value_en: {
   required
  },
  attribute_value_ar: {
   required
  },
 },
 data() {
  return {
   attr_val_id: null,
   modal: '',
   attribute_value_en: '',
   attribute_value_ar: '',
   visibleState: "visible",
   disableSubmit: false,
   required: null,
   isfile: false,
   fileUrl: "",
   editable: false,
   isAdd: false,
   toggleState: true,
   toggleShadow: "",
   direction: getDirection().direction,
   dataResult: null,
   isLoad: false,
   selectAttributeGroup: [],
   selectAttributeType: [],
   attributeValues: [],
  };
 },
 computed: {
  authorSuperadmin() {
   const userRole = decrypt(localStorage.getItem('userRole'))
   if (userRole == 1) {
    return true
   } else
    return false
  },
  authorDelete() {
   const userRole = decrypt(localStorage.getItem('userRole'))
   if (userRole == 1) {
    return true
   } else
    return false
  },
  authorAddEdit() {
   const userRole = decrypt(localStorage.getItem('userRole'))
   if (userRole == 1) {
    return true
   } else
    return false
  },
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
  }
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
  hideModal(refname) {
   this.$refs[refname].hide()
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
  fillForm(value) {
   this.attribute_value_en = value.label_en;
   this.attribute_value_ar = value.label_ar;
   this.modal = 'edit' + value.code;
   this.attr_val_id = value.code;
  },
  resetForm() {
   this.attribute_value_en = '';
   this.attribute_value_ar = '';
   this.modal = 'addNew';
   this.attr_val_id = null
  },
  delAttVal(value) {
   this.modal = 'delete' + value.code;
   this.attr_val_id = value.code
  },
  deleteItem() {
   this.hideModal('attributeValuesModal')
   //this.isLoadValues = false
   axios
    .delete('attributes/values/' + this.attr_val_id)
    .then(res => {
     //this.isLoadValues = true
     this.getAttributeValues()
     this.$notify("success", "Deleted Successfully", null, { duration: 5000, permanent: false });
     //this.attributeValues = this.attributeValues.filter(x => x.code !== id)
    })
    .catch(err => {
     //this.isLoadValues = true
     this.$notify("error", "Attribute Value was not deleted", "Network Error", null, {
      duration: 5000,
      permanent: false
     });
     console.log(error)
    })
  },

  sendAttrValue() {
   this.hideModal('attributeValuesModal')
   this.formData = new FormData();
   this.formData.append("en[name]", this.attribute_value_en);
   this.formData.append("ar[name]", this.attribute_value_ar);
   this.formData.append("attribute_id", this.attribute_id);
   if (this.attr_val_id != null) {
    this.formData.append("_method", 'PUT');
   }
   axios
    .post(this.attr_val_id != null ? apiUrl + 'attributes/values/' + this.attr_val_id : apiUrl + 'attributes/values', this.formData, {
     headers: {
      'Content-Type': 'multipart/form-data'
     }
    })
    .then(res => {
     //this.isLoadValues = true
     this.attr_val_id = res.data.data.id
     this.getAttributeValues()
     this.$notify("success", "Updated Successfully", null, { duration: 5000, permanent: false });
     //this.attributeValues = this.attributeValues.filter(x => x.code !== id)
    })
    .catch(err => {
     console.log("error : " + JSON.stringify(err.response))

     //this.isLoadValues = true
     if (err.response == undefined) {
      this.$notify("error", "Attribute Value was not Added", "Network Error", null, {
       duration: 5000,
       permanent: false
      });
     } else if (err.response.data.status == 422) {
      this.$notify("error", "Attribute Value was not Added", "The Name Field is Required", null, {
       duration: 5000,
       permanent: false
      });

     }
     console.log(error)

    })
  },
  async getAttributeValues() {
   //this.isLoadValues = false;
   await axios.get(apiUrl + `attributes/values?attribute_id=${this.attribute_id}`)
    .then(response => {
     return response.data;
    })
    .then(res => {
     //this.isLoadValues = true;
     this.attributeValues = res.data.map(x => {
      return {
       label_en: x.locales.en.name,
       label_ar: x.locales.ar.name,
       code: x.id,
      };
     });
    });
  }
 },
 async mounted() {
  await this.getAttributeValues();
 }
}
</script>

<style scoped>
.shadow {
 transition-duration: 0.5s;
 left: 0px;
}

.shadow:hover {
 left: 5px;
 box-shadow: 0px 0px 3px black !important;
}

.addClass {
 background-color: transparent;
}
</style>
