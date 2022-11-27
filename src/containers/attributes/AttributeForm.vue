<template>
 <b-row>
  <b-colxx xxs="12">
   <b-card class="mb-4">
    <b-card-header class="d-flex justify-content-between mb-3 px-0">
     <h3 class="d-flex align-self-center font-weight-bold"> {{
              isAdd ? $t('forms.create-attribute') :
                $t('forms.edit-attribute')
            }}</h3>
     <div
      v-if="!isAdd && authorSuperadmin"
      :class="`d-flex justify-content-end my-3 ${visibleState}`">
      <Switches
       v-model="editable"
       theme="custom"
       color="primary mx-2 d-inline"
       class="vue-switcher-small d-flex align-self-center"></Switches>
      <h6 class="font-weight-bold d-flex align-self-center">{{ this.$t('forms.enable-form') }}</h6>
     </div>
    </b-card-header>

    <b-form
     v-if="isLoad"
     @submit.prevent="setData"
     class="av-tooltip tooltip-label-bottom">
     <!--          ar  title        -->
     <b-form-group
      :label="$t('forms.titleAr')"
      :class="`has-float-label mb-4 ${toggleShadow}`">
      <b-form-input
       :disabled="toggleState"
       required
       type="text"
       v-model.trim="$v.attributeForm.title_ar.$model"
       :state="!$v.attributeForm.title_ar.$error"
       :dir="direction" />
      <b-form-invalid-feedback v-if="!$v.attributeForm.title_ar.required">{{
                `${$t('forms.titleAr')}
              ${$t('validations.required')}`
              }}
      </b-form-invalid-feedback>
     </b-form-group>
     <!--          en  title        -->
     <b-form-group
      :label="$t('forms.titleEn')"
      :class="`has-float-label ${toggleShadow}`">
      <b-form-input
       required
       type="text"
       v-model.trim="$v.attributeForm.title_en.$model"
       :state="!$v.attributeForm.title_en.$error" />
      <b-form-invalid-feedback v-if="!$v.attributeForm.title_en.required">{{
                `${$t('forms.titleEn')}
              ${$t('validations.required')}`
              }}!
      </b-form-invalid-feedback>
      <b-form-invalid-feedback v-else-if="!$v.attributeForm.title_en.minLength">
       Minimum 6
      </b-form-invalid-feedback>
      <b-form-invalid-feedback v-else-if="!$v.attributeForm.title_en.maxLength">
       Maximum 16
      </b-form-invalid-feedback>
     </b-form-group>
     <b-form-group
      :label="$t('forms.attributeGroup')"
      :class="`has-float-label mb-4 ${toggleShadow}`">
      <v-select
       :reduce="label => label.code"
       label="label"
       :disabled="toggleState"
       v-model="$v.attributeForm.attribute_group_id.$model"
       :state="!$v.attributeForm.attribute_group_id.$error"
       :options="selectAttributeGroup"
       :dir="direction" />
     </b-form-group>
     <!--          default value          -->
     <b-form-group
      :label="$t('forms.defaultValue')"
      :class="`has-float-label mb-4 ${toggleShadow}`">
      <b-form-input
       :disabled="toggleState"
       required
       type="text"
       v-model.trim="$v.attributeForm.default_value.$model"
       :state="!$v.attributeForm.default_value.$error"
       :dir="direction" />
      <b-form-invalid-feedback v-if="!$v.attributeForm.default_value.required">
       {{ `${$t('forms.default_value')} ${$t('validations.required')}` }}!
      </b-form-invalid-feedback>
     </b-form-group>
     <!--          mandatory          -->
     <b-form-group>
      <b-form-checkbox
       :disabled="toggleState"
       value="1"
       unchecked-value="0"
       v-model.trim="$v.attributeForm.mandatory.$model"
       :state="!$v.attributeForm.mandatory.$error">
       {{ $t('forms.mandatory') }}
      </b-form-checkbox>
     </b-form-group>
     <!--          type          -->
     <b-form-group
      v-if="selectAttributeType.length!==0"
      :label="$t('forms.type')"
      :class="`has-float-label mb-4 ${toggleShadow}`">
      <v-select
       :reduce="label => label.code"
       label="label"
       :disabled="toggleState"
       v-model="$v.attributeForm.type.$model"
       :state="!$v.attributeForm.type.$error"
       :options="selectAttributeType"
       :dir="direction" />
     </b-form-group>

     <!--          List Values          -->
     <div
      id="addListValue"
      v-if="attributeForm.type===0">
      <b-form-row
       cols="12"
       class="align-items-center justify-content-between"
       v-for="(listValue, counter) in listValues"
       v-bind:key="counter">
       <b-form-group
        :label="counter + 1 + '. ' + $t('forms.listValuesEn')"
        :class="`col has-float-label mr-3 ${toggleShadow}`">
        <b-form-input
         :class="`${toggleShadow}`"
         :disabled="toggleState"
         required
         name="listValues[]"
         type="text"
         v-model="listValue.en"
         :state="!$v.attributeForm.list_values_en.$error" />
       </b-form-group>
       <b-form-group
        :label="counter + 1 + '. ' + $t('forms.listValuesAr')"
        :class="`col has-float-label mr-3 ${toggleShadow}`">
        <b-form-input
         :class="`${toggleShadow}`"
         :disabled="toggleState"
         required
         name="listValues[]"
         type="text"
         v-model="listValue.ar"
         :state="!$v.attributeForm.list_values_ar.$error" />
       </b-form-group>
       <b-icon-x-circle
        v-if="authorSuperadmin"
        variant="danger"
        style="cursor: pointer;"
        :disabled="toggleState"
        @click="deleteListValues(counter)" />
      </b-form-row>
      <b-icon-plus-circle
       v-if="authorSuperadmin"
       style="cursor: pointer;"
       variant="info"
       scale="4"
       :disabled="toggleState"
       @click="addListValues('','')" />
     </div>
     <div
      v-if="authorSuperadmin"
      class="d-flex justify-content-between">
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
   </b-card>
  </b-colxx>
  <!--    {{dataResult.locales.ar.list_values}}-->
 </b-row>
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
 props: ['itemid', 'apiBase'],

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
  attributeForm: {
   title_ar: {
    required,
    maxLength: maxLength(200),
   },
   title_en: {
    required,
    maxLength: maxLength(200),
   },
   list_values_ar: {},
   list_values_en: {},
   attribute_group_id: {
    required,
    integer
   },
   mandatory: {},
   type: { required },
   default_value: { required },
  },
 },
 data() {
  return {
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
   isLoad: true,
   selectAttributeGroup: [],
   selectAttributeType: [],
   attributeForm: {
    title_ar: "",
    list_values_ar: "",
    title_en: "",
    list_values_en: "",
    attribute_group_id: "",
    mandatory: "0",
    type: "",
    default_value: ""
   },
   listValues: [{
    en: '',
    ar: ''
   }]
  };
 },
 created() {
  if (this.itemid == undefined) {
   this.visibleState = "invisible"
   this.toggleState = false;
   this.toggleShadow = "laffah-shadow";
   this.required = "required"
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
  '$route.params.id': {
   handler: function (id) {
    if (typeof id === 'undefined') {
     this.editable = true
     this.isAdd = true
    }
   },
   deep: true,
   immediate: true
  },
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
   if (this.itemid != null) {
    axios
     .get(this.apiBase + '/' + this.itemid)
     .then(res => {
      this.dataResult = res.data.data;
      console.log('getdata', this.dataResult)
      this.$v.attributeForm.title_ar.$model = this.dataResult.locales.ar.title;
      this.$v.attributeForm.title_en.$model = this.dataResult.locales.en.title;
      this.$v.attributeForm.list_values_ar.$model = this.dataResult.locales.ar.list_values;
      this.$v.attributeForm.list_values_en.$model = this.dataResult.locales.en.list_values;
      this.$v.attributeForm.attribute_group_id.$model = this.dataResult.attribute_group.id;
      this.$v.attributeForm.mandatory.$model = this.dataResult.mandatory;
      this.$v.attributeForm.default_value.$model = this.dataResult.default_value;
      this.$v.attributeForm.type.$model = this.selectAttributeType.find(item => item.label === this.dataResult.type).code
      let ar = JSON.parse(this.dataResult.locales.ar.list_values)
      let en = JSON.parse(this.dataResult.locales.en.list_values)
      this.listValues = []
      en.forEach((val, index) => {
       this.addListValues(ar[index].value, val.value)
      })
      console.log("list value : ", JSON.parse(this.dataResult.locales.ar.list_values))

      this.isLoad = true;
     });
   } else {
    this.isLoad = true;
   }
  },

  setData() {
   if (this.authorSuperadmin) {
    if (this.attributeForm.type === 0) {
     let enListValues = [];
     let arListValues = [];
     this.listValues.forEach((element, index) => {
      enListValues.push({ id: index, value: element.en });
      arListValues.push({ id: index, value: element.ar });
     });
     this.attributeForm.list_values_en = JSON.stringify(enListValues);
     this.attributeForm.list_values_ar = JSON.stringify(arListValues);
     console.log(this.attributeForm.list_values_en)
     console.log(this.attributeForm.list_values_ar)
    } else {
     this.attributeForm.list_values_en = '';
     this.attributeForm.list_values_ar = '';
    }
    this.disableSubmit = true
    this.isLoad = false;

    this.formData = new FormData();
    this.formData.append("en[title]", this.attributeForm.title_en);
    this.formData.append("en[list_values]", this.attributeForm.list_values_en);
    this.formData.append("ar[title]", this.attributeForm.title_ar);
    this.formData.append("mandatory", this.attributeForm.mandatory);
    this.formData.append("type", this.attributeForm.type);
    if (this.attributeForm.attribute_group_id !== "" && this.attributeForm.attribute_group_id) {
     this.formData.append("attribute_group_id", this.attributeForm.attribute_group_id);
    }
    this.formData.append("default_value", this.attributeForm.default_value);
    this.formData.append("ar[list_values]", this.attributeForm.list_values_ar);

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

        this.dataResult = res
        // console.log("res : " + this.dataResult.data.image)
        if (this.dataResult.data.success == true) {
         // window.location.href = '../../';
         this.$router.push('../attribute-list')
         this.$notify("success", "Attibutes has been Updated Successfully", null, {
          duration: 5000,
          permanent: false
         });
        } else if (this.dataResult == undefined) {
         this.$notify("warning", "Attributes was not Updated", "please try again Later", null, {
          duration: 5000,
          permanent: false
         });
         this.disableSubmit = false
         //  window.location.href = '../../';
        } else {
         this.$notify("warning", "Attributes was not Updated", "please try again Later", null, {
          duration: 5000,
          permanent: false
         });
         this.disableSubmit = false

        }
       })
      .catch(error => {
       this.isLoad = true
       this.disableSubmit = false

       this.$notify("error", "Attributes was not Updated", "Network Error", null, {
        duration: 5000,
        permanent: false
       });

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
        this.dataResult = res
        // console.log("res : " + this.dataResult)

        if (this.dataResult.data.success == true) {
         this.$router.push('attribute-list')
         this.$notify("success", "Attributes has been Added Successfully", null, {
          duration: 5000,
          permanent: false
         });
         // window.location.href = '../../';
        } else if (this.dataResult == undefined) {
         this.$notify("warning", "Attributes was not Added", "please try again Later", null, {
          duration: 5000,
          permanent: false
         });
         this.disableSubmit = false

         //  window.location.href = '../../';
        } else {
         this.$notify("warning", "Attributes was not Added", "please try again Later", null, {
          duration: 5000,
          permanent: false
         });
         this.disableSubmit = false

        }
       })
      .catch(error => {
       this.disableSubmit = false
       this.isLoad = true
       this.$notify("error", "Attributes was not Added", "Network Error", null, {
        duration: 5000,
        permanent: false
       });
       console.log(error)
      });
    }
   }
  },

  getAttributeGroup() {
   axios.get(apiUrl + 'attributes/groups')
    .then(response => {
     console.log(response.data);
     return response.data;
    })
    .then(res => {
     this.selectAttributeGroup = res.data.map(x => {
      return {
       label: x.locales.en.name,
       code: x.id
      };
     });
     return res
    });
  },

  getAttributeTypes() {
   axios.get(apiUrl + 'attributes/types')
    .then(response => {
     console.log('getAttributeTypes', response.data.data);
     return response.data;
    })
    .then(res => {
     // this.selectAttributeType = res.data
     this.selectAttributeType = res.data.map(x => {
      return {
       label: x,
       code: res.data.indexOf(x),
      };
     });
     this.getData();
     return res
    });
  },

  getSelectionType(event) {
   let value = event.label;
   if (value == 'List')
    document.getElementById("addListValue").style.display = "block";
   else
    document.getElementById('addListValue').style.display = "none";
  },

  addListValues(arVal, enVal) {
   this.listValues.push({
    en: enVal,
    ar: arVal
   });
  },

  deleteListValues(counter) {
   this.listValues.splice(counter, 1);
  },
 },
 async mounted() {
  await this.getAttributeTypes();
  await this.getAttributeGroup();
 }
}
</script>

<style scoped>
</style>
