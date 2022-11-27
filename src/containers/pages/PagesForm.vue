<template>
  <b-row>

    <b-colxx xxs="12">
      <b-card
        no-body
        class="mb-4">
        <b-card-body
          v-if="isLoad"
          class="">
          <b-card-header class="d-flex justify-content-between mb-3 px-0">
            <h3 class="d-flex align-self-center text-uppercase"> {{$t(`forms.edit`)}} {{dataresult.locales[$i18n.locale].name}}</h3>
            <ThumbnailImage
              v-if="itemid !== undefined"
              rounded
              small
              :src="fileUrl"
              :alt="pagesForm.name_en"
              class-name="m-4 w-12 h-100 m-1 " />
            <div
              v-if="authorSuperadmin || authorAdmin"
              :class="`d-flex justify-content-end my-3`">
              <Switches
                v-model="editable"
                theme="custom"
                color="primary mx-2 d-inline"
                class="vue-switcher-small d-flex align-self-center"></Switches>
              <h6 class="font-weight-bold d-flex align-self-center">{{this.$t('forms.enable-form')}}</h6>
            </div>
          </b-card-header>

          <b-form @submit.prevent="setData">
            <b-form-group
              :label="$t('forms.name-ar')"
              :class="`has-float-label mb-4 ${toggleShadow}`">
              <b-form-input
                :disabled="toggleState"
                required
                type="text"
                v-model.trim="$v.pagesForm.name_ar.$model"
                :state="!$v.pagesForm.name_ar.$error"
                :dir="direction" />
              <b-form-invalid-feedback v-if="!$v.pagesForm.name_ar.required">{{`${$t('forms.name-ar')}
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
                v-model.trim="$v.pagesForm.description_ar.$model"
                :state="!$v.pagesForm.description_ar.$error"
                :dir="direction"></quill-editor>
              <b-form-invalid-feedback
                id="v-desc"
                v-if="!$v.pagesForm.description_ar.required">{{`${$t('forms.description-ar')}
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
                v-model.trim="$v.pagesForm.name_en.$model"
                :state="!$v.pagesForm.name_en.$error"
                :dir="direction" />
              <b-form-invalid-feedback v-if="!$v.pagesForm.name_en.required">{{`${$t('forms.name-en')}
              ${$t('validations.required')}`}}!
              </b-form-invalid-feedback>

            </b-form-group>
            <b-form-group
              :label="$t('forms.description-en')"
              :class="`has-float-label mb-4 ${toggleShadow}`">
              <quill-editor
                :disabled="toggleState"
                required
                aria-describedby="v-desc"
                v-model.trim="$v.pagesForm.description_en.$model"
                :state="!$v.pagesForm.description_en.$error"
                :dir="direction"></quill-editor>
              <b-form-invalid-feedback v-if="!$v.pagesForm.description_en.required">{{`${$t('forms.description-en')}
              ${$t('validations.required')}`}}!
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
                v-model.trim="$v.pagesForm.image.$model"
                :state="!$v.pagesForm.image.$error"
                accept="image/png, image/jpeg, image/svg" />
            </b-form-group>

            <div
              v-if="authorSuperadmin || authorAdmin"
              class="d-flex justify-content-between">
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
                :alt="pagesForm.name_en"
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
import { getDirection, decrypt } from '../../utils';
import axios from "axios";
import { barChartOptions } from '../../components/Charts/config';
import { defaultDirection } from '../../constants/config';
import { BIconArrowDownSquareFill } from 'bootstrap-vue';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import ThumbnailImage from "../../components/Cards/ThumbnailImage";
import Switches from "vue-switches";

//import { mapGetters, mapActions } from 'vuex';

const {
  required,
  maxLength,
  integer
} = require("vuelidate/lib/validators");
export default {

  components: {
    "v-select": vSelect,
    'quill-editor': quillEditor,
    ThumbnailImage,
    Switches

  },
  props: ['itemid', 'apiBase'],
  mixins: [validationMixin],
  validations: {
    pagesForm: {
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
      image: {
        required
      },
    },
  },
  data() {
    return {

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
      pagesForm: {
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
        image: null,

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
    editor() {
      return this.$refs.myTextEditor.quill
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
          .get(this.apiBase + '/' + this.itemid, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            // console.log(res.data.data);
            //  let date = this.pagesForm.post_date.toISOString()

            this.dataresult = res.data.data;
            this.$v.pagesForm.name_ar.$model = this.dataresult.locales.ar.name;
            this.$v.pagesForm.name_en.$model = this.dataresult.locales.en.name;
            this.$v.pagesForm.description_ar.$model = this.dataresult.locales.ar.description;
            this.$v.pagesForm.description_en.$model = this.dataresult.locales.en.description;
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
      this.formData.append("block_category_id", 3);
      this.formData.append("en[name]", this.pagesForm.name_en);
      this.formData.append("en[description]", this.pagesForm.description_en);
      this.formData.append("ar[name]", this.pagesForm.name_ar);
      this.formData.append("ar[description]", this.pagesForm.description_ar);
      // if(this.pagesForm.image)
      if (this.isfile) { //check upload new file
        this.formData.append("image", this.pagesForm.image);
      }

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
              this.$router.push('../pages-list')
              this.$notify("success", "Updated Successfully", null, { duration: 5000, permanent: false });
            } else {
              this.$notify("warning", "Not Updated", "please try again Later", null, { duration: 5000, permanent: false });
              //  window.location.href = '../../';
            }
          })
        .catch(error => {
          this.isLoad = true
          this.disableSubmit = false
          this.$notify("error", "Not Updated", "Network Error", null, { duration: 5000, permanent: false });
        });

    },
  },
  async mounted() {
    await this.getData()
  },
}
</script>

<style lang="scss" scoped>

</style>
