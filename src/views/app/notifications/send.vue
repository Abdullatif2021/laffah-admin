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
                <b-form-group label="Title">
                  <b-form-input
                    type="text"
                    v-model.trim="$v.title.$model"
                    :state="!$v.title.$error"
                  />
                  <b-form-invalid-feedback
                    >Title is required!</b-form-invalid-feedback
                  >
                </b-form-group>

                <b-form-group label="Details">
                  <b-textarea
                    v-model.trim="$v.detail.$model"
                    :state="!$v.detail.$error"
                  ></b-textarea>
                  <b-form-invalid-feedback
                    >Please enter some details!</b-form-invalid-feedback
                  >
                </b-form-group>
                <b-form-group label="Image">
                  <vue-dropzone
                    @vdropzone-files-added="imgAdded"
                    @vdropzone-removed-file="imgRemoved"
                    ref="myVueDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                  ></vue-dropzone>
                </b-form-group>
                <b-button type="submit" variant="primary" class="mt-4">{{
                  $t("forms.submit")
                }}</b-button>
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
const { required } = require("vuelidate/lib/validators");
export default {
  components: {
    "vue-dropzone": VueDropzone,
  },
  data() {
    return {
      title: "",
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailHeight: 160,
        maxFilesize: 2,
        previewTemplate: this.dropzoneTemplate(),
        headers: {
          "My-Awesome-Header": "header value",
        },
      },
      detail: "",
      img: null,
    };
  },
  mixins: [validationMixin],
  validations: {
    title: {
      required,
    },

    detail: {
      required,
    },
  },
  methods: {
    // ...mapActions(["sendNotification"]),
    ...mapActions("notification", ["sendNotification"]),

    onValitadeFormSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.sendNotification({
          title: this.title,
          details: this.detail,
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
  },
  watch: {
    _isSendNotif: function (val) {
      this.$v.title.$model = "";
      this.$v.detail.$model = null;
      this.detail = null;
      this.$v.$reset();
      this.$notify("success", "Notification send Successfuly", "", {
        duration: 4000,
        permanent: false,
      });
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
