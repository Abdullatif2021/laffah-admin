<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('menu.update-attribute')">
        <div id="enable-update" class="enable-update">
          <a v-on:click="enableForm()" class="btn top-right-button btn-primary btn-lg">
            {{ $t('forms.enableEdit') }}
          </a>
        </div>
        <b-form @submit.prevent="update" class="av-tooltip tooltip-label-bottom">

          <!--          ar  title        -->
          <b-form-group :label="$t('forms.titleAr')" class="has-float-label">
            <b-form-input type="text" :disabled="disableForm"
                          v-model.trim="$v.attributeUpdateForm.title_ar.$model"
                          :state="!$v.attributeUpdateForm.title_ar.$error"/>
            <b-form-invalid-feedback v-if="!$v.attributeUpdateForm.title_ar.required">{{`${$t('forms.titleAr')}
              ${$t('validations.required')}`}}!
            </b-form-invalid-feedback>
          </b-form-group>

          <!--          en  title        -->
          <b-form-group :label="$t('forms.titleEn')" class="has-float-label">
            <b-form-input :disabled="disableForm" type="text"
                          v-model.trim="$v.attributeUpdateForm.title_en.$model"
                          :state="!$v.attributeUpdateForm.title_en.$error"/>
            <b-form-invalid-feedback v-if="!$v.attributeUpdateForm.title_en.required">{{`${$t('forms.titleEn')}
              ${$t('validations.required')}`}}!
            </b-form-invalid-feedback>
          </b-form-group>

          <!--          attribute group          -->
          <div class="form-group has-top-label">
            <v-select :disabled="disableForm"
                      v-model="$v.attributeUpdateForm.attribute_group_id.$model"
                      :options="selectAttributeGroup"/>
            <span>{{ $t('forms.attributeGroup') }}</span>
            <div :class="{
              'invalid-feedback':true ,
              'd-block':$v.attributeUpdateForm.attribute_group_id.$error && !$v.attributeUpdateForm.attribute_group_id.required
              }">
              {{`${$t('forms.attribute_group')} ${$t('validations.required')}`}}!
            </div>
          </div>

          <!--          default value          -->
          <b-form-group :label="$t('forms.defaultValue')" class="has-float-label">
            <b-form-input :disabled="disableForm" type="text" v-model.trim="$v.attributeUpdateForm.default_value.$model"
                          :state="!$v.attributeUpdateForm.default_value.$error"/>
            <b-form-invalid-feedback v-if="!$v.attributeUpdateForm.default_value.required">
              {{`${$t('forms.default_value')} ${$t('validations.required')}`}}!
            </b-form-invalid-feedback>
          </b-form-group>

          <!--          mandatory          -->
          <b-form-group>
            <!--       v-bind:value="$v.attributeUpdateForm.mandatory.$model"      -->
            <b-form-checkbox :disabled="disableForm" unchecked-value="0"
                             v-model="$v.attributeUpdateForm.mandatory.$model">
              {{$t('forms.mandatory')}}
            </b-form-checkbox>
          </b-form-group>

          <!--          type          -->
          <div class="form-group has-top-label">
            <v-select text-field="label" value-field="value"
                      :disabled="disableForm" @input='getSelectionType'
                      v-model="$v.attributeUpdateForm.type.$model"
                      :options="selectAttributeType"/>
            <span>{{ $t('forms.type') }}</span>
            <div :class="{
              'invalid-feedback':true ,
              'd-block':$v.attributeUpdateForm.type.$error && !$v.attributeUpdateForm.type.required
              }">
              {{`${$t('forms.type')} ${$t('validations.required')}`}}!
            </div>
          </div>

          <!--          List Values          -->
          <div id="addListValue" v-if="$v.attributeUpdateForm.type.$model">
            <a class="addButton" @click="addListValues">Add</a>
            <div class="previous" v-for="(listValue, counter) in listValues" v-bind:key="counter">
              <span class="removeButton" @click="deleteListValues(counter)">x</span>
              <br><br>

              <b-form-group :label="counter+1 + '.' + $t('forms.listValuesEn')" class="has-float-label">
                <b-form-input :disabled="disableForm" name="listValues[]" type="text" v-model="listValue.en"
                              :state="!$v.attributeUpdateForm.list_values_en.$error"/>
              </b-form-group>

              <b-form-group :label="counter+1 + '.' + $t('forms.listValuesAr')" class="has-float-label">
                <b-form-input :disabled="disableForm" name="listValues[]" type="text" v-model="listValue.ar"
                              :state="!$v.attributeUpdateForm.list_values_ar.$error"/>
              </b-form-group>
            </div>
          </div>

          <b-button :disabled="disableForm" type="submit" variant="primary" class="mt-4">{{ $t('forms.submit')}}
          </b-button>
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
        helpers,
        integer
    } = require("vuelidate/lib/validators");

    export default {
        name: "AttributeUpdateForm",

        components: {
            "input-tag": InputTag,
            "v-select": vSelect,
            "datepicker": Datepicker
        },
        data() {
            return {
                apiBase: apiUrl + "attributes",
                disableForm: true,
                selectAttributeGroup: [],
                selectAttributeType: [],
                attributeUpdateForm: {
                    title_ar: "",
                    list_values_ar: "",
                    title_en: "",
                    list_values_en: "",
                    attribute_group_id: "",
                    mandatory: "0",
                    type: "",
                    default_value: ""
                },
                listValues: [
                    {
                        en: '',
                        ar: ''
                    }
                ]
            };
        },
        mixins: [validationMixin],
        validations: {
            attributeUpdateForm: {
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
                type: {required},
                default_value: {required},
            },
        },
        methods: {
            getAttribute() {
                axios.get(this.apiBase + '/' + this.$route.params.id).then(res => {
                    console.log(res.data.data);
                    this.$v.attributeUpdateForm.title_ar.$model = res.data.data.locales.ar.title;
                    this.$v.attributeUpdateForm.title_en.$model = res.data.data.locales.en.title;
                    this.$v.attributeUpdateForm.list_values_ar.$model = res.data.data.locales.ar.list_values;
                    this.$v.attributeUpdateForm.list_values_en.$model = res.data.data.locales.en.list_values;
                    this.$v.attributeUpdateForm.attribute_group_id.$model = res.data.data.attribute_group.locales.en.name;
                    this.$v.attributeUpdateForm.type.$model = res.data.data.type;
                    this.$v.attributeUpdateForm.default_value.$model = res.data.data.default_value;
                    this.$v.attributeUpdateForm.mandatory.$model = (res.data.data.mandatory == '0' ? false : true);
                });
            },
            getAttributeGroup() {
                axios.get(apiUrl + 'attributes/groups')
                    .then(response => {
                        return response.data;
                    })
                    .then(res => {
                        this.selectAttributeGroup = res.data.map(x => {
                            return {
                                label: x.locales.en.name,
                                value: x.id
                            };
                        });
                    });
            },

            getSelectionType(event) {
                let value = event.label;
                if (value == 'List')
                    document.getElementById("addListValue").style.display = "block";
                else
                    document.getElementById('addListValue').style.display = "none";
            },

            addListValues() {
                this.listValues.push({
                    en: '',
                    ar: ''
                });
            },

            update() {
                let currentObj = this;
                axios.put(this.apiBase + '/' + this.$route.params.id, {
                    ar: {
                        title: this.attributeUpdateForm.title_ar,
                    },
                    en: {
                        title: this.attributeUpdateForm.title_en,
                    },
                    attribute_group_id: this.attributeUpdateForm.attribute_group_id.value,
                    mandatory: this.attributeUpdateForm.mandatory,
                    type: this.attributeUpdateForm.type.value,
                    default_value: this.attributeUpdateForm.default_value,
                }, {
                    headers: {
                        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiNTRhNDNkMmZjM2NlZDZkNDczNzYwNjE2Mzg4OTE3NjdiY2VhYmY5YjUyYTExZDJjZjc2ODEzOWZkMGJlM2E2ZjQ2ZTUyNzViNDMzMTNmZGMiLCJpYXQiOjE2MDIwNzkyODIsIm5iZiI6MTYwMjA3OTI4MiwiZXhwIjoxNjMzNjE1MjgyLCJzdWIiOiIxMiIsInNjb3BlcyI6WyIqIl19.VIU0Hg-o5KK0TS_skrfxXej1WNHDlR0B6MeRo-Km1cF3efXTnu6hX9-PS7OxCpVS93hugnEcA0GYIkIouocagmgcXvdAEAwFJBht7OrOUTdAYq00ZQgWY7knY8bU90HGeHwnIOypQkjMSunpMNUiYxiZyfhRnynkQi8YZstPQREWr7QbV6EwIksIurazSOW6GKStI2y1h5viqgb7UeMLQfKYDzv51Qf7MKpYy90ILX2eIM9y3gIDDOrhSTmbnKD7JvOOTvqZF0Z7rTtIWr3IlzXIvmgFXyqfXc-n5F2lYP4k-oQDLJFdt9v7j7aPSYILklQ9u3-IV4mMIBY-GQFdvYR2_1j4cPrMUtsJlX5LDdsAcACosTAvtiRIu7Lz33PLCiyXwVP18IC1BQSrO-KAqlk2EC6TF06g3NPwx_f8D8RG9tzzEvXp5s6bhFZQOLeGlypUiZYf8-9RmiUbWwNL4ux_-Ba26XTnEmnK4RAjqHdMP9ZPxouNL8W_QHSTwjsRqSvhux6J53YF07JqqRClILhQf2q5o24tmVCkx9az7X9ZxcnGX-4qAEBH9glLXhuOtrXcUSsLKqzyO-UT3DNGAcEMMlydwASMmHgSnc1dC7d4VVORsng_z8LKc1QLKnHLxEgaOU_G0Ym0hVjekDN9IWljQjh6KaNlWfqDEbOZzpI`
                    }
                }).then(function (response) {
                    window.location.href = '../list-attribute';
                }).catch(function (error) {
                    currentObj.output = error;
                });
            },

            enableForm() {
                this.disableForm = false;
                document.getElementById('enable-update').remove();
            },

            getAttributeTypes() {
                axios.get(apiUrl + 'attributes/types')
                    .then(response => {
                        return response.data;
                    })
                    .then(res => {
                        this.selectAttributeType = res.data.map(x => {
                            return {
                                label: x,
                                value: res.data.indexOf(x),
                            };
                        });
                    });
            },

        },
        mounted() {
            this.getAttribute();
            this.getAttributeGroup();
            this.getAttributeTypes();
        }
    }
</script>

<style scoped>

</style>
