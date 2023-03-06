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
const { required } = require("vuelidate/lib/validators");
export default {
  data() {
    return {
      title: "",

      detail: "",
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
        this.sendNotification({ title: this.title, details: this.detail });
      }
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
