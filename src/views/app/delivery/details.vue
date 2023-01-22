<template>
    <b-row>
      <b-colxx xxs="4">
        <b-card class="mb-4" title="Branches">
          <b-form>
           
            
            <b-form-group label-cols="2" horizontal>
                <!-- <b-form-checkbox-group
                stacked
                switches
                button-variant="primary"
                class="mb-3 font-weight-bold "
                v-model="usersForm.branch"
                :disabled="toggleState"
                :options="branches"
                value-field="code"
                text-field="label"> -->
            </b-form-group>
           
            <b-button @click="update" variant="primary" class="mt-4">Save</b-button>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>
  </template>
  <script>
  import { mapGetters, mapActions } from "vuex";
  export default {
    data() {
      return {
        usersForm: {
            branch: [],
        },
        horizontalForm: {
            email: "",
            password: "",
            radio: "",
            checked: false
        },  
        horizontalFormRadios: [
          this.$t("forms.first-radio"),
          this.$t("forms.second-radio"),
          { text: this.$t("forms.third-radio-disabled"), disabled: true },
          this.$t("forms.first-radio"),
          this.$t("forms.second-radio"),
          { text: this.$t("forms.third-radio-disabled"), disabled: true },
          this.$t("forms.first-radio"),
          this.$t("forms.second-radio"),
          { text: this.$t("forms.third-radio-disabled"), disabled: true },
          this.$t("forms.first-radio"),
          this.$t("forms.second-radio"),
          { text: this.$t("forms.third-radio-disabled"), disabled: true },
        ]
      };
    },
    created(){
        this.getDeliveryData({user_id: this.$route.params.id});
    },
    methods: {
      ...mapActions(['getDeliveryData'])
    },
    computed: {
        ...mapGetters(["getBranches", "getRoles"]),
    },
    watch: {
        _delivery: function(val){
            this.usersForm.branch = val.branches.map(x => {
                return x.branch_id
              });
        },
        getBranches() {
            this.getBranches.map(x => {
                return {
                    label: x.locales[this.$i18n.locale].name,
                    code: x.id,
                };
            });
        },
    }
  };
  </script>
  