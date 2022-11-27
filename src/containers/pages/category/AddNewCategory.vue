<template>
  <b-modal
    id="modalright"
    ref="modalright"
    :title="$t('pages.add-new-category-modal')"
    modal-class="modal-right"
  >
    <b-form
      @submit.prevent="onValidateCategoryFormFormSubmit"
      class="av-tooltip tooltip-label-bottom"
    >
      <b-form-group :label="$t('forms.title-ar')" class="has-float-label">
        <b-form-input
          type="text"
          pat
          v-model.trim="$v.category.ar.title.$model"
          :state="!$v.category.ar.title.$error"
        />
        <b-form-invalid-feedback v-if="!$v.category.ar.title.required">{{`${$t('forms.title_ar')}
          ${$t('validations.required')}`}}!
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('forms.description-ar')" class="has-float-label">
        <b-form-textarea
          type="text"
          v-model.trim="$v.category.ar.description.$model"
          :state="!$v.category.ar.description.$error"
        />
        <b-form-invalid-feedback v-if="!$v.category.ar.description.required">{{`${$t('forms.description_ar')}
          ${$t('validations.required')}`}}!
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('forms.title-en')" class="has-float-label">
        <b-form-input
          type="text"
          v-model.trim="$v.category.en.title.$model"
          :state="!$v.category.en.title.$error"
        />
        <b-form-invalid-feedback v-if="!$v.category.en.title.required">{{`${$t('forms.title_en')}
          ${$t('validations.required')}`}}!
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.category.en.title.maxLength">Maximum 16
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('forms.description-en')" class="has-float-label">
        <b-form-textarea
          type="text"
          v-model.trim="$v.category.en.description.$model"
          :state="!$v.category.en.description.$error"
        />
        <b-form-invalid-feedback v-if="!$v.category.en.description.required">{{`${$t('forms.description_en')}
          ${$t('validations.required')}`}}!
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.category.en.description.maxLength">Maximum 16
        </b-form-invalid-feedback>
      </b-form-group>
      <b-input-group :prepend="$t('forms.image')" class="mb-3">
        <b-form-file
          type="image"
          @change="selectFile"
          :placeholder="$t('input-groups.choose-file')"
          accept="image/png, image/jpeg, image/svg"
        />
      </b-input-group>
      <b-from-group :label="$t('forms.description-en')" class="mb-3">
        <b-input-group class="mb-3">
          <b-input-group-prepend is-text>
            <input type="checkbox" value="1" v-model="$v.category.add_to_menu.$model">
          </b-input-group-prepend>
          <b-form-input :value="$t('forms.is-menu')" disabled/>
        </b-input-group>
      </b-from-group>
      <div class="form-group has-float-label">
        <v-select
          label="title"
          v-model="$v.category.parent_id.$model"
          :options="categories"
        />
        <span>{{ $t('forms.parent') }}</span>
        <div
          :class="{'invalid-feedback':true ,'d-block':$v.category.parent_id.$error && !$v.category.parent_id.required}"
        >{{`${$t('forms.parent')} ${$t('validations.required')}`}}!
        </div>
      </div>
      <!--      <b-button type="submit" variant="primary" class="mt-4">{{ $t('forms.submit')}}</b-button>-->
    </b-form>

    <template slot="modal-footer">
      <b-button
        variant="outline-secondary"
        @click="hideModal('modalright')"
      >{{ $t('pages.cancel') }}
      </b-button>
      <b-button variant="primary" @click="onValidateCategoryFormFormSubmit()" class="mr-1">{{ $t('pages.submit') }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>

  import InputTag from "../../../components/Form/InputTag";
  import vSelect from "vue-select";
  import "vue-select/dist/vue-select.css";
  import {BFormGroup} from 'bootstrap-vue'
  import {mapState, mapGetters} from 'vuex';
  import {validationMixin} from "vuelidate";
  import category from "../../../store/modules/category";

  const {
    required,
    alpha,
    maxLength,
    helpers
  } = require("vuelidate/lib/validators");

  export default {
    components: {
      "input-tag": InputTag,
      "b-from-group": BFormGroup,
      "v-select": vSelect
    },
    props: ["categories", "statuses"],
    data() {
      return {
        url: 'categories',
        category: {
          ar: {
            title: "",
            description: "",
          },
          en: {
            title: "",
            description: "",
          },
          image: "",
          add_to_menu: 0,
          parent_id: ""
        },
        newItem: {
          title: "",
          category: "",
          description: "",
          status: ""
        }
      };
    },
    mixins: [validationMixin],
    validations: {
      category: {
        ar: {
          title: {
            required,
            alpha,
            maxLength: maxLength(200),
          },
          description: {
            required,
            alpha,
          },
        },
        en: {
          title: {
            required,
            alpha,
            maxLength: maxLength(200),
          },
          description: {
            required,
            alpha,
          },
        },
        image: {
          required
        },
        add_to_menu: {},
        parent_id: {},
      },
    },
    computed: {
      ...mapState('category', [
        'currentCategory',
      ]),
    },
    methods: {
      onValidateCategoryFormFormSubmit: function () {
        this.$v.category.$touch();
        let data = new FormData();
        if (this.currentCategory !== null) {
          data.append('_method', 'PUT');
          data.append("id", this.currentCategory)
        }
        Object.keys(this.$v.category.$model).map((key) => {
          if (this.$v.category.$model[key] instanceof Object) {
            Object.keys(this.$v.category.$model[key]).map((k) => {
              return data.append(`${key}[${k}]`, this.$v.category.$model[key][k])
            })
          }
          return !(['en', 'ar'].indexOf(key) !== -1)
            ? data.append(key, this.$v.category.$model[key])
            : ''
        });
        this.$store.dispatch('handleSubmit', {
          url: this.url,
          obj: data
        })
      },
      selectFile(event) {
        // `files` is always an array because the file input may be in multiple mode
        this.$v.category.image.$model = event.target.files[0];
        // this.$v.category.image.$model = this.$refs.file.files;
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      }
    },
    watch: {
      currentCategory(val) {
        //todo:check reset the form
        if (val !== null) {
          this.$store.dispatch('category/getCategory', val)
            .then(response => {
              this.$v.category.ar.title.$model = response.data.locales.ar.title
              this.$v.category.ar.description.$model = response.data.locales.ar.description
              this.$v.category.en.title.$model = response.data.locales.en.title
              this.$v.category.en.description.$model = response.data.locales.en.description
              this.$v.category.image.$model = response.data.locales.image
              this.$v.category.parent_id.$model = response.data.locales.parent_id
              this.$v.category.add_to_menu.$model = response.data.locales.add_to_menu
            })
        } else {
          this.$v.$reset()
        }
      }
    }
  };
</script>

