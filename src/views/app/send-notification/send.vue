<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Send Notification" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xs="12" class="mb-3">
        <b-row>
          <b-colxx xxs="12">
            <b-card class="mb-4">
              <b-form
                @submit.prevent="onValitadeFormSubmit"
                class="av-tooltip tooltip-label-right"
              >
                <b-form-group label-class="font-weight-bold" label="Type">
                  <b-form-select
                    v-model.trim="$v.type.$model"
                    :state="!$v.type.$error"
                    :options="typeOptions"
                    plain
                  />
                  <b-form-invalid-feedback
                    >Type is required!</b-form-invalid-feedback
                  >
                </b-form-group>
                <b-form-group
                  v-if="type === 'Specific'"
                  label="Specified type"
                  class="error-l-150"
                  label-class="font-weight-bold"
                >
                  <b-form-input
                    type="number"
                    style="display: none"
                    v-model.trim="$v.specifiedType.$model"
                    :state="!$v.specifiedType.$error"
                  />
                  <b-form-checkbox-group
                    @change="handleCheckboxChange"
                    v-model.trim="$v.specifiedType.$model"
                  >
                    <b-form-checkbox value="item">Item</b-form-checkbox>
                    <b-form-checkbox value="category">Category</b-form-checkbox>
                  </b-form-checkbox-group>
                  <b-form-invalid-feedback
                    >Please select one!</b-form-invalid-feedback
                  >
                </b-form-group>
                <b-form-group
                  v-if="specifiedType"
                  class="form-group-label"
                  label-class="font-weight-bold"
                  :label="
                    specifiedType === 'category'
                      ? 'Choose Category'
                      : 'Choose Item'
                  "
                >
                  <b-form-input
                    type="number"
                    style="display: none"
                    v-model.trim="$v.selected_type.$model"
                    :state="!$v.selected_type.$error"
                  />

                  <v-select
                    label="name"
                    :filterable="false"
                    :options="couponableOptions"
                    @search="fetchcouponableOptions"
                    v-model="selected_type"
                  >
                    <template slot="no-options">{{
                      specifiedType === "category"
                        ? "type to search Category List.."
                        : "type to search Item List.."
                    }}</template>

                    <template slot="selected-option" slot-scope="option">
                      <div class="selected d-center">
                        {{ option.name }}
                      </div>
                    </template>
                    <template slot="spinner" slot-scope="spinner">
                      <div
                        class="spinner-border text-primary"
                        v-show="spinner"
                      ></div>
                    </template>
                  </v-select>
                  <b-form-invalid-feedback
                    >Please choose the value!</b-form-invalid-feedback
                  >
                </b-form-group>
                <b-form-group
                  label-class="font-weight-bold"
                  label="English Title"
                >
                  <b-form-input
                    type="text"
                    v-model.trim="$v.en_title.$model"
                    :state="!$v.en_title.$error"
                  />
                  <b-form-invalid-feedback
                    >Title is required!</b-form-invalid-feedback
                  >
                </b-form-group>
                <b-form-group
                  label-class="font-weight-bold"
                  label="English Details"
                >
                  <b-textarea
                    v-model.trim="$v.en_detail.$model"
                    :state="!$v.en_detail.$error"
                  ></b-textarea>
                  <b-form-invalid-feedback
                    >Please enter some details!</b-form-invalid-feedback
                  >
                </b-form-group>
                <b-form-group
                  label-class="font-weight-bold"
                  label="Arabic Title"
                >
                  <b-form-input
                    type="text"
                    v-model.trim="$v.ar_title.$model"
                    :state="!$v.ar_title.$error"
                  />
                  <b-form-invalid-feedback
                    >Title is required!</b-form-invalid-feedback
                  >
                </b-form-group>
                <b-form-group
                  label-class="font-weight-bold"
                  label="Arabic Details"
                >
                  <b-textarea
                    v-model.trim="$v.ar_detail.$model"
                    :state="!$v.ar_detail.$error"
                  ></b-textarea>
                  <b-form-invalid-feedback
                    >Please enter some details!</b-form-invalid-feedback
                  >
                </b-form-group>
                <b-form-group label-class="font-weight-bold" label="Image">
                  <vue-dropzone
                    @vdropzone-files-added="imgAdded"
                    @vdropzone-removed-file="imgRemoved"
                    ref="myVueDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                  ></vue-dropzone>
                </b-form-group>
                <b-form-group label-class="font-weight-bold" label="Activation">
                  <switches
                    v-model="activate"
                    theme="custom"
                    color="primary"
                    class="vue-switcher-small"
                  ></switches>
                </b-form-group>
                <b-button
                  :disabled="enable_submit"
                  type="submit"
                  variant="primary"
                  class="mt-4"
                  >{{ $t("forms.submit") }}</b-button
                >
              </b-form>
            </b-card>
          </b-colxx>
        </b-row>
      </b-colxx></b-row
    >
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { mapActions, mapGetters } from "vuex";
import VueDropzone from "vue2-dropzone";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Axios from "axios";
import Switches from "vue-switches";
import { adminRoot } from "../../../constants/config";

const { required, requiredIf } = require("vuelidate/lib/validators");
export default {
  components: {
    "vue-dropzone": VueDropzone,
    "v-select": vSelect,
    switches: Switches,
  },
  data() {
    return {
      ar_title: "",
      en_title: "",
      ar_detail: "",
      en_detail: "",
      type: null,
      activate: true,
      enable_submit: false,
      selected_type: null,
      specifiedType: null,
      typeOptions: ["General", "Specific"],
      couponableOptions: [],
      dropzoneOptions: {
        acceptedFiles: "image/jpeg,image/png,image/gif",
        url: "https://httpbin.org/post",
        thumbnailHeight: 160,
        maxFilesize: 2,
        previewTemplate: this.dropzoneTemplate(),
        headers: {
          "My-Awesome-Header": "header value",
        },
      },
      img: null,
    };
  },
  mixins: [validationMixin],
  validations: {
    type: {
      required,
    },
    specifiedType: {
      required: requiredIf(function () {
        return this.specifiedType_isOptional;
      }),
    },
    selected_type: {
      required: requiredIf(function () {
        return this.specifiedType_isOptional;
      }),
    },
    ar_title: {
      required,
    },

    ar_detail: {},
    en_title: {
      required,
    },

    en_detail: {},
  },
  methods: {
    // ...mapActions(["sendNotification"]),
    ...mapActions("notification", ["sendNotification"]),

    onValitadeFormSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        console.log(
          this.ar_title,
          this.ar_title,
          this.en_title,
          this.ar_detail,
          this.specifiedType,
          this.en_detail,
          this.type,
          this.selected_type,
          this.activate,
          "on validation "
        );
        this.sendNotification({
          info: {
            "ar[title]": this.ar_title,
            "en[title]": this.en_title,
            "ar[description]": this.ar_detail,
            "en[description]": this.en_detail,

            action: this.selected_type ? this.specifiedType : "notification",
            type: "notification",
            refer_id: this.selected_type?.id,
            active: this.activate ? 1 : 0,
          },

          image: this.img,
        });
      }
    },
    imgAdded(img) {
      this.img = img;
    },
    imgRemoved() {
      this.img = null;
    },
    handleCheckboxChange() {
      this.selected_type = null;
      this.couponableOptions = [];
    },
    fetchcouponableOptions(search, loading) {
      console.log("Loading", loading);
      loading(true);
      this.enable_submit = true;
      setTimeout(() => {
        if (this.specifiedType === "item") {
          return Axios.get(
            `https://api-v2.laffahrestaurants.com/public/api/items?orderBy[]=created_at&orderBy[]=desc&name=${search}`
          ).then((res) => {
            console.log(res);
            this.couponableOptions = [];
            this.enable_submit = false;
            this.couponableOptions = res.data.data.map((x) => {
              return {
                name: x.locales[this.$i18n.locale].name,
                id: x.id,
              };
            });

            loading(false);
          });
        } else {
          return Axios.get(
            `https://api-v2.laffahrestaurants.com/public/api/categories?sort=id&offset=0&limit=4&title=${search}`
          ).then((res) => {
            console.log(res);
            this.couponableOptions = [];
            this.enable_submit = false;
            this.couponableOptions = res.data.data.map((x) => {
              return {
                name: x.locales[this.$i18n.locale].title,

                id: x.id,
              };
            });

            loading(false);
          });
        }
      }, 1000);
    },
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `;
    },
  },
  computed: {
    ...mapGetters("notification", ["_isSendNotif", "_notSendNotif"]),
    couponable_isOptional() {
      return this.couponableType != null;
    },
    specifiedType_isOptional() {
      return this.type === "Specific";
    },
  },
  watch: {
    _isSendNotif: function (val) {
      this.$v.$reset();
      this.$notify("success", "Notification send Successfuly", "", {
        duration: 4000,
        permanent: false,
      });
      this.$router.push(`${adminRoot}/send-notification`);
    },
    specifiedType: function (val) {
      console.log(val);
    },
    _notSendNotif: function (val) {
      //   this.$v.title.$model = "";
      //   this.$v.detail.$model = null;
      //   this.detail = null;
      //   this.$v.$reset();
      this.$notify(
        "error",
        "Notification doesnot send Successfuly",
        "Please try again",
        {
          duration: 4000,
          permanent: false,
        }
      );
    },
  },
};
</script>
