<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card no-body class="mb-4">
        <b-card-body class="">
          <b-card-header class="d-flex justify-content-between mb-3 px-0">
            <h3 class="d-flex align-self-center font-weight-bold">
              {{
                itemid == null
                  ? $t("forms.create-block")
                  : $t("forms.edit-block")
              }}
            </h3>
            <div :class="`d-flex justify-content-end my-3 ${visibleState}`">
              <Switches
                v-model="editable"
                theme="custom"
                color="primary mx-2 d-inline"
                class="vue-switcher-small d-flex align-self-center"
              ></Switches>
              <h6 class="font-weight-bold d-flex align-self-center">
                {{ this.$t("forms.enable-form") }}
              </h6>
            </div>
          </b-card-header>

          <b-form @submit.prevent="setData" v-if="isLoad">
            <b-form-group
              :label="$t('forms.name-ar')"
              :class="`has-float-label mb-4 ${toggleShadow}`"
            >
              <b-form-input
                :disabled="toggleState"
                required
                type="text"
                v-model.trim="$v.blockForm.name_ar.$model"
                :state="!$v.blockForm.name_ar.$error"
                :dir="direction"
              />
              <b-form-invalid-feedback v-if="!$v.blockForm.name_ar.required"
                >{{
                  `${$t("forms.name-ar")}
              ${$t("validations.required")}`
                }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('forms.description-ar')"
              :class="`has-float-label mb-4 ${toggleShadow}`"
            >
              <quill-editor
                :disabled="toggleState"
                aria-describedby="v-desc"
                v-model.trim="blockForm.description_ar"
                :dir="direction"
              ></quill-editor>
            </b-form-group>
            <b-form-group
              :label="$t('forms.name-en')"
              :class="`has-float-label mb-4 ${toggleShadow}`"
            >
              <b-form-input
                :disabled="toggleState"
                required
                type="text"
                v-model.trim="$v.blockForm.name_en.$model"
                :state="!$v.blockForm.name_en.$error"
                :dir="direction"
              />
              <b-form-invalid-feedback v-if="!$v.blockForm.name_en.required"
                >{{
                  `${$t("forms.name-en")}
              ${$t("validations.required")}`
                }}!
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('forms.description-en')"
              :class="`has-float-label mb-4 ${toggleShadow}`"
            >
              <quill-editor
                :disabled="toggleState"
                aria-describedby="v-desc"
                v-model.trim="blockForm.description_en"
                :dir="direction"
              ></quill-editor>
            </b-form-group>
            <b-form-group
              :label="$t('forms.date')"
              :class="`has-float-label mb-4  ${toggleShadow}`"
            >
              <datepicker
                :disabled="toggleState"
                :disabledDates="disabledDates"
                :required="true"
                :bootstrap-styling="true"
                v-model.trim="$v.blockForm.post_date.$model"
                :state="!$v.blockForm.post_date.$error"
                :dir="direction"
                format="yyyy-MM-dd"
              />
              <b-form-invalid-feedback
                :class="{
                  'd-block invalid-feedback': blockForm.post_date == '',
                }"
                v-if="!$v.blockForm.post_date.required"
                >{{
                  `${$t("forms.date")}
              ${$t("validations.required")}`
                }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :prepend="$t('forms.image')"
              :class="`mb-4 ${toggleShadow}`"
            >
              <b-form-file
                v-if="itemid !== undefined"
                :disabled="toggleState"
                type="file"
                id="file"
                ref="file"
                @change="changeFile"
                :placeholder="$t('input-groups.choose-image')"
                v-model.trim="blockForm.image"
                accept="image/png, image/jpeg, image/svg"
              />
              <b-form-file
                v-if="itemid == undefined"
                :disabled="toggleState"
                type="file"
                id="file"
                ref="file"
                @change="changeFile"
                :placeholder="$t('input-groups.choose-image')"
                v-model.trim="blockForm.image"
                accept="image/png, image/jpeg, image/svg"
              />
            </b-form-group>
            <b-form-group>
              <div class="d-flex justify-content-start">
                <Switches
                  :disabled="toggleState"
                  v-model="visible"
                  theme="custom"
                  color="primary mx-2 d-inline"
                  class="vue-switcher-small d-flex align-self-center"
                ></Switches>
                <h6 class="d-flex align-self-center">
                  {{ $t("forms.visible-in-website") }}
                </h6>
              </div>
            </b-form-group>
            <div class="d-flex justify-content-between">
              <b-button
                type="submit"
                :disabled="disableSubmit || toggleState"
                variant="primary"
                class="mt-4 align-self-center align-self-baseline"
                >{{ $t("forms.submit") }}
              </b-button>
              <ThumbnailImage
                v-if="itemid !== undefined"
                rounded
                small
                :src="fileUrl"
                :alt="blockForm.name_en"
                class-name="m-4 w-30 h-25 m-1"
              />
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
import { barChartOptions } from "../../components/Charts/config";
import { defaultDirection } from "../../constants/config";
import { BIconArrowDownSquareFill } from "bootstrap-vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import ThumbnailImage from "../../components/Cards/ThumbnailImage";
import Switches from "vue-switches";

//import { mapGetters, mapActions } from 'vuex';

const { required, maxLength, integer } = require("vuelidate/lib/validators");
export default {
  components: {
    "v-select": vSelect,
    datepicker: Datepicker,
    "quill-editor": quillEditor,
    ThumbnailImage,
    Switches,
  },
  props: ["itemid", "apiBase", "slug"],
  mixins: [validationMixin],
  validations: {
    blockForm: {
      name_ar: {
        required,
        maxLength: maxLength(200),
      },
      name_en: {
        required,
        maxLength: maxLength(200),
      },
      post_date: {
        required,
      },
    },
  },
  data() {
    return {
      visibleState: "visible",
      categories: [],
      visible: false,
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
      newBranches: [],
      blockForm: {
        name_en: "",
        name_ar: "",
        description_en: "",
        description_ar: "",
        post_date: "",
        image: null,
      },
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
          ],
        },
      },
    };
  },
  created() {
    if (this.itemid == undefined) {
      this.visibleState = "invisible";
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
      let today = new Date().getDate();
      let month = new Date().getMonth();
      let year = new Date().getFullYear();
      let newDate = new Date(year, month, today);
      return {
        to: newDate,
      };
    },
    editor() {
      return this.$refs.myTextEditor.quill;
    },
    getCategoryId() {
      let id = this.categories.find((x) => x.slug == this.slug).id;
      return id;
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
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    onEditorBlur(editor) {
      console.log("editor blur!", editor);
    },
    onEditorFocus(editor) {
      console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    getData() {
      if (this.itemid != null) {
        axios
          .get(this.apiBase + "/" + this.itemid, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            // console.log(res.data.data);
            //  let date = this.blockForm.post_date.toISOString()

            this.dataresult = res.data.data;
            this.$v.blockForm.name_ar.$model = this.dataresult.locales.ar.name;
            this.$v.blockForm.name_en.$model = this.dataresult.locales.en.name;
            this.blockForm.description_ar =
              this.dataresult.locales.ar.description;
            this.blockForm.description_en =
              this.dataresult.locales.en.description;
            this.$v.blockForm.post_date.$model = new Date(
              this.dataresult.post_date
            );
            // this.$v.blockForm.image.$model = this.dataresult.image;
            //this.visible = this.dataresult.visible;
            this.visible = this.dataresult.visible == "1" ? true : false;
            this.fileUrl =
              this.dataresult.image_webp === ""
                ? this.dataresult.image
                : `${this.dataresult.image_baseurl}/small/${this.dataresult.image_webp}`;
            this.isLoad = true;
          });
      } else {
        this.$v.blockForm.name_ar.$model = "";
        this.$v.blockForm.name_en.$model = "";
        this.$v.blockForm.post_date.$model = "";
        this.isLoad = true;
      }
    },
    setData() {
      this.$v.blockForm.$touch();
      if (!this.$v.blockForm.$anyError) {
        this.isLoad = false;
        this.disableSubmit = true;
        this.formData = new FormData();
        this.formData.append("block_category_id", this.getCategoryId);
        this.formData.append("en[name]", this.blockForm.name_en);
        this.formData.append("en[description]", this.blockForm.description_en);
        this.formData.append("ar[name]", this.blockForm.name_ar);
        this.formData.append("ar[description]", this.blockForm.description_ar);
        if (this.blockForm.post_date != "") {
          this.formData.append(
            "post_date",
            this.blockForm.post_date.toISOString()
          );
        }
        this.formData.append("visible", this.visible == true ? 1 : 0);
        // if(this.blockForm.image)
        if (this.isfile) {
          //check upload new file
          this.formData.append("image", this.blockForm.image);
        }
        if (this.itemid != null) {
          this.formData.append("_method", "PUT");
          axios //PUT method
            .post(this.apiBase + "/" + this.itemid, this.formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              this.disableSubmit = false;

              this.dataresult = res;
              console.log("res : " + this.dataresult.data.image);
              if (this.dataresult.data.success == true) {
                // window.location.href = '../../';
                this.$router.push("../list");
                this.$notify(
                  "success",
                  "Block has been Updated Successfully",
                  null,
                  { duration: 5000, permanent: false }
                );
              } else {
                this.$notify(
                  "warning",
                  "Block was not Updated",
                  "please try again Later",
                  null,
                  { duration: 5000, permanent: false }
                );
                this.disableSubmit = false;
                //  window.location.href = '../../';
              }
            })
            .catch((error) => {
              this.disableSubmit = false;
              this.$notify(
                "error",
                "Block was not Updated",
                "Network Error",
                null,
                { duration: 5000, permanent: false }
              );
            });
        } else {
          axios //POST method
            .post(this.apiBase, this.formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              this.disableSubmit = false;

              this.dataresult = res;
              console.log("res : " + this.dataresult);

              if (this.dataresult.data.success == true) {
                this.$router.push("list");
                this.$notify(
                  "success",
                  "Block has been Added Successfully",
                  null,
                  { duration: 5000, permanent: false }
                );
                // window.location.href = '../../';
              } else {
                this.$notify(
                  "warning",
                  "Block was not Added",
                  "please try again Later",
                  null,
                  { duration: 5000, permanent: false }
                );
                this.disableSubmit = false;
                //  window.location.href = '../../';
              }
            })
            .catch(function (error) {
              this.disableSubmit = false;
              this.$notify(
                "error",
                "Block was not Added",
                "Network Error",
                null,
                { duration: 5000, permanent: false }
              );
              console.log(error);
            });
        }
      }
    },
    // ...mapActions(["fetchBranches"]),
  },
  async mounted() {
    await this.getData();
    await axios
      .get(this.apiBase + "/categories")
      .then((res) => {
        this.categories = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
    //   this.fetchBranches();
  },
};
</script>

<style lang="scss" scoped></style>
