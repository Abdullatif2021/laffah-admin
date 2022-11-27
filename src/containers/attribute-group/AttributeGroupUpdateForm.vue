<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('menu.update-attribute-group')">
        <div id="enable-update" class="enable-update">
          <a v-on:click="enableForm()" class="btn top-right-button btn-primary btn-lg">
            {{ $t('forms.enableEdit') }}
          </a>
        </div>
        <b-form @submit.prevent="update" class="av-tooltip tooltip-label-bottom">

          <b-form-group :label="$t('forms.name-ar')" class="has-float-label">
            <b-form-input type="text" :disabled="disableForm"
                          v-model.trim="$v.attributeGroupUpdateForm.name_ar.$model"
                          :state="!$v.attributeGroupUpdateForm.name_ar.$error"/>
            <b-form-invalid-feedback v-if="!$v.attributeGroupUpdateForm.name_ar.required">{{`${$t('forms.name-ar')}
              ${$t('validations.required')}`}}!
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group :label="$t('forms.description-ar')" class="has-float-label">
            <b-form-textarea :disabled="disableForm" type="text"
                             v-model.trim="$v.attributeGroupUpdateForm.description_ar.$model"
                             :state="!$v.attributeGroupUpdateForm.description_ar.$error"/>
          </b-form-group>

          <b-form-group :label="$t('forms.name-en')" class="has-float-label">
            <b-form-input :disabled="disableForm" type="text"
                          v-model.trim="$v.attributeGroupUpdateForm.name_en.$model"
                          :state="!$v.attributeGroupUpdateForm.name_en.$error"/>
            <b-form-invalid-feedback v-if="!$v.attributeGroupUpdateForm.name_en.required">{{`${$t('forms.name-en')}
              ${$t('validations.required')}`}}!
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.attributeGroupUpdateForm.name_en.minLength">
              Minimum 6
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.attributeGroupUpdateForm.name_en.maxLength">
              Maximum 16
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group :label="$t('forms.description-en')" class="has-float-label">
            <b-form-textarea :disabled="disableForm" type="text"
                             v-model.trim="$v.attributeGroupUpdateForm.description_en.$model"
                             :state="!$v.attributeGroupUpdateForm.description_en.$error"/>
          </b-form-group>

          <b-button :disabled="disableForm" type="submit" variant="primary" class="mt-4">{{ $t('forms.submit')}}</b-button>
        </b-form>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
    import InputTag from "../../components/Form/InputTag";
    import vSelect from "vue-select";
    import "vue-select/dist/vue-select.css";
    import Datepicker from "vuejs-datepicker";
    import axios from "axios";
    import {validationMixin} from "vuelidate";
    import {apiUrl} from "../../constants/config";

    const {
        required,
        email,
        alpha,
        maxLength,
        helpers
    } = require("vuelidate/lib/validators");

    export default {
        name: "AttributeGroupUpdateForm",

        components: {
            "input-tag": InputTag,
            "v-select": vSelect,
            "datepicker": Datepicker
        },
        data() {
            return {
                apiBase: apiUrl + "attributes/groups",
                disableForm: true,
                attributeGroupUpdateForm: {
                    name_ar: "",
                    description_ar: "",
                    name_en: "",
                    description_en: "",
                },
            };
        },
        mixins: [validationMixin],
        validations: {
            attributeGroupUpdateForm: {
                name_ar: {
                    required,
                    maxLength: maxLength(200),
                },
                name_en: {
                    required,
                    maxLength: maxLength(200),
                },
                description_ar: {},
                description_en: {}
            },
        },
        methods: {
            getAttributeGroup() {

                axios.get(this.apiBase + '/' + this.$route.params.id).then(res => {
                    this.$v.attributeGroupUpdateForm.name_ar.$model = res.data.data.locales.ar.name;
                    this.$v.attributeGroupUpdateForm.description_ar.$model = res.data.data.locales.ar.description;
                    this.$v.attributeGroupUpdateForm.name_en.$model = res.data.data.locales.en.name;
                    this.$v.attributeGroupUpdateForm.description_en.$model = res.data.data.locales.en.description;
                });

            },
            update() {
                this.$v.attributeGroupUpdateForm.$touch();

                let currentObj = this;
                axios.put(this.apiBase + '/' + this.$route.params.id, {
                    ar: {
                        name: this.attributeGroupUpdateForm.name_ar,
                        description: this.attributeGroupUpdateForm.description_ar
                    },
                    en: {
                        name: this.attributeGroupUpdateForm.name_en,
                        description: this.attributeGroupUpdateForm.description_en
                    },
                }).then(function (response) {
                    window.location.href = '../list-attribute-group';
                }).catch(function (error) {
                    currentObj.output = error;
                });
            },
            enableForm() {
                this.disableForm = false;
                document.getElementById('enable-update').remove();
            }
        },
        mounted() {
            this.getAttributeGroup();
        }
    }
</script>

<style scoped>

</style>
