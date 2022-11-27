<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card
        class="mb-4"
        :name="$t('forms.item-info')">
        <div
          v-if="authorSuperadmin && $route.params.id"
          :class="`d-flex justify-content-end my-3 ${visibleState}`">
          <switches
            v-model="allowEdit"
            theme="custom"
            color="primary mx-2 d-inline"
            class="vue-switcher-small d-flex align-self-center"></switches>
          <h6 class="font-weight-bold d-flex align-self-center">{{ this.$t('forms.enable-form') }}</h6>
        </div>
        <b-form
          @submit.prevent="onValidateItemFormFormSubmit"
          class="av-tooltip tooltip-label-bottom">
          <b-form-group
            dir="rtl"
            :label="$t('forms.name-ar')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <b-form-input
              required
              :disabled="toggleState"
              type="text"
              pat
              v-model.trim="$v.item.locales.ar.name.$model"
              :state="!$v.item.locales.ar.name.$error"/>
            <b-form-invalid-feedback v-if="!$v.item.locales.ar.name.required">{{
                `${$t('forms.name-ar')}
      ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            dir="rtl"
            :label="$t('forms.description-ar')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <quill-editor
              :disabled="toggleState"
              ref="myTextEditor"
              v-model.trim="$v.item.locales.ar.description.$model"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              :state="!$v.item.locales.ar.description.$error">
            </quill-editor>
            <b-form-invalid-feedback v-if="!$v.item.locales.ar.description.required">{{
                `${$t('forms.description-ar')}
  ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.name-en')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <b-form-input
              :disabled="toggleState"
              required
              type="text"
              v-model.trim="$v.item.locales.en.name.$model"
              :state="!$v.item.locales.en.name.$error"/>
            <b-form-invalid-feedback v-if="!$v.item.locales.en.name.required">{{
                `${$t('forms.name-en')}
  ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.item.locales.en.name.maxLength">Maximum 16
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.description-en')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <quill-editor
              :disabled="toggleState"
              ref="myTextEditor"
              v-model.trim="$v.item.locales.en.description.$model"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              :state="!$v.item.locales.en.description.$error">
            </quill-editor>
            <b-form-invalid-feedback v-if="!$v.item.locales.en.description.required">{{
                `${$t('forms.description-en')}
  ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.item.locales.en.description.maxLength">Maximum 16
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            v-if="srcUrl!==''"
            class="text-center">
            <thumbnail-image
              rounded
              small
              :src="srcUrl"
              class-name="m-4 w-30 h-25 m-1"/>
          </b-form-group>
          <b-input-group
            :prepend="$t('forms.image')"
            class="mb-3">
            <b-form-file
              :disabled="toggleState"
              type="image"
              @change="selectFile"
              :placeholder="$t('input-groups.choose-file')"
              accept="image/png, image/jpeg, image/svg"/>
          </b-input-group>
          <b-form-row>
            <colxx xxs="6">
              <b-from-group
                :label="$t('forms.online-status')"
                :description="$t('forms.is_published_message')"
                class="mb-3">
                <b-form-row>
                  <div class="mx-3">
                    <span v-text="$t('forms.publish')"></span>
                    <b-form-checkbox
                      name="batch-management"
                      :disabled="toggleState"
                      value="1"
                      size="lg"
                      unchecked-value="0"
                      v-model="$v.item.is_published.$model"
                      switch/>
                  </div>
                  <div class="mx-3">
                    <span v-text="$t('forms.active')"></span>
                    <b-form-checkbox
                      name="batch-management"
                      :disabled="toggleState"
                      value="1"
                      size="lg"
                      unchecked-value="0"
                      v-model="$v.item.active.$model"
                      switch/>
                  </div>
                </b-form-row>
              </b-from-group>
            </colxx>
            <colxx xxs="6">
              <b-from-group
                :label="$t('forms.batch-management')"
                :description="$t('forms.batch-message')"
                class="mb-3">
                <span v-text="$t('forms.batch')"></span>
                <b-form-checkbox
                  name="batch-management"
                  :disabled="toggleState"
                  value="1"
                  size="lg"
                  unchecked-value="0"
                  v-model="$v.item.type.$model"
                  switch/>
              </b-from-group>
            </colxx>
          </b-form-row>
          <b-form-group
            v-if="parseInt(item.type)===0 && item.prices"
            :label="$t('forms.cities-prices')">
            <b-input-group
              v-for="(price,index) in item.prices"
              :key="price.city_id"
              class="mb-3">
              <b-input-group-prepend is-text>
                <span>{{ price.locales[$i18n.locale].name }}</span>
              </b-input-group-prepend>
              <b-form-input
                :disabled="toggleState"
                required
                type="text"
                v-model.trim="$v.item.prices.$each[index].price.$model"/>
              <b-input-group-append is-text>
                <b-form-checkbox
                  :name="`switch-${index}`"
                  :disabled="toggleState"
                  class="mr-n2"
                  value="1"
                  unchecked-value="0"
                  v-model="item.prices[index].active"
                  switch>
                  <span class="sr-only">{{ $t('from.active-message') }}</span>
                </b-form-checkbox>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group
            :label="$t('forms.category')"
            class="has-float-label mb-4">
            <v-select
              required
              :disabled="toggleState"
              :class="`${toggleShadow}`"
              label="title"
              v-model="$v.item.category.$model"
              :options="selectData"
              :reduce="category => category.category_id">
              <template #search="{attributes, events}">
                <input
                  class="vs__search"
                  :required="!$v.item.category.$model"
                  v-bind="attributes"
                  v-on="events"
                />
              </template>
            </v-select>
            <div :class="{'invalid-feedback':true ,'d-block':$v.item.category.$error && !$v.item.category.required}">
              {{ `${$t('forms.parent')} ${$t('validations.required')}` }}!
            </div>
          </b-form-group>
          <b-form-group
            :label="$t('forms.record_order')">
            <b-input-group
              :key="item.record_order"
              class="mb-3"
              :class="`${toggleShadow}`"
            >
              <b-form-input
                :disabled="toggleState"
                required
                type="number"
                v-model.trim="item.record_order"/>
            </b-input-group>
          </b-form-group>

          <b-form-group
            :label="$t('forms.notes')"
            :class="`has-float-label mb-4 ${toggleShadow}`">
            <quill-editor
              :disabled="toggleState"
              ref="myTextEditor"
              v-model.trim="$v.item.notes.$model"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              :state="!$v.item.notes.$error">
            </quill-editor>
            <b-form-invalid-feedback v-if="!$v.item.notes.required">{{
                `${$t('forms.description-en')}
  ${$t('validations.required')}`
              }}!
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.item.notes.maxLength">Maximum 16
            </b-form-invalid-feedback>
          </b-form-group>
          <b-button
            v-if="authorSuperadmin"
            :disabled="toggleState"
            type="submit"
            variant="primary"
            class="mt-4">{{ $t('forms.submit') }}
          </b-button>
        </b-form>

      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import InputTag from "../../components/Form/InputTag";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import "bootstrap-vue/dist/bootstrap-vue.min.css"
import {BFormCheckbox, BFormGroup, BInputGroupAppend} from 'bootstrap-vue'
import {mapState, mapGetters, mapActions} from 'vuex';
import {validationMixin} from "vuelidate";
import {quillEditor} from "vue-quill-editor";
import Switches from "vue-switches";
import Colxx from "../../components/Common/Colxx";
import {decrypt} from '@/utils';
import ThumbnailImage from "@/components/Cards/ThumbnailImage";

const {
  required,
  alpha,
  maxLength,
  minLength,
  numeric,
  helpers
} = require("vuelidate/lib/validators");

export default {
  components: {
    Colxx,
    "input-tag": InputTag,
    "b-from-group": BFormGroup,
    "b-form-checkbox": BFormCheckbox,
    "b-input-group-append": BInputGroupAppend,
    'quill-editor': quillEditor,
    switches: Switches,
    'thumbnail-image': ThumbnailImage,
    "v-select": vSelect
  },
  data() {
    return {
      visibleState: "visible",
      disableSubmit: false,
      required: null,
      srcUrl: "",
      toggleShadow: "",
      url: 'items',
      primary: false,
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              {list: 'ordered'},
              {list: 'bullet'},
              {indent: '-1'},
              {indent: '+1'}
            ],
            ['link', 'image'],
            ['clean']
          ]
        }
      },
    };
  },
  mixins: [validationMixin],
  validations() {
    if (parseInt(this.item.type) === 0) {
      return {
        selectedItems: {},
        item: {
          id: '',
          locales: {
            ar: {
              name: {
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
              name: {
                required,
                alpha,
                maxLength: maxLength(200),
              },
              description: {
                required,
                alpha,
              },
            }
          },
          image: {},
          prices: {
            minLength: minLength(2),
            $each: {
              price: {
                required,
                numeric,
                minLength: minLength(2)
              }
            }
          },
          notes: {},
          is_published: {},
          type: {},
          active: {},
          category: {required},
        },
      }
    } else {
      return {
        itemFields: {},
        item: {
          locales: {
            ar: {
              name: {
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
              name: {
                required,
                alpha,
                maxLength: maxLength(200),
              },
              description: {
                required,
                alpha,
              },
            }
          },
          image: {},
          notes: {},
          is_published: {},
          type: {},
          active: {},
          category: {required},
        },
      }
    }
  },
  computed: {
    allowEdit: {
      get() {
        return this.editable
      },
      set(val) {
        this.$store.commit('item/SET_ItemStatus', val)
      }
    },
    toggleState: {
      get() {
        return !this.allowEdit
      },
      set(newVal) {
        return newVal
      }
    },
    /*item() {
      const currentItm = this.item
      let itm = {
        type: 0,
        active: 0,
        is_published: 0,
        category: [],
        locales: {
          ar: {
            name: ''
          },
          en: {
            name: ''
          }
        },
        prices: [
          {
            city_id: '',
            price: '',
            active: 1
          },
          {
            city_id: '',
            price: '',
            active: 1
          }
        ],
        notes: ''
      }
      return currentItm !== null ? currentItm : itm
    },*/
    authorSuperadmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      return userRole == 1;
    },
    editor() {
      return this.$refs.myTextEditor.quill
    },
    ...mapState('category', [
      'categoriesList',
    ]),
    ...mapState('item', {
      item: 'currentItem',
      selectedItems: 'customization_groups',
      editable: 'itemStatus'
    }),
    ...mapGetters('category', ['selectData',]),
    ...mapGetters({cities: 'getCities',}),
  },
  mounted() {
    this.$store.dispatch('category/loadCategoriesList')
  },
  methods: {
    ...mapActions(['handleSubmit']),
    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    },
    onEditorChange({editor, html, text}) {
      // console.log('editor change!', editor, html, text)
      this.contentBubble = html
    },
    onValidateItemFormFormSubmit: async function () {
      if (this.authorSuperadmin) {
        this.$v.item.$touch();
        let pObj = {}
        let selectCG = {}
        let data = new FormData();
        if (this.item.id !== undefined) {
          data.append('_method', 'PUT');
          data.append("id", this.item.id)
        }
        data.append(`en[name]`, this.$v.item.locales.en.name.$model)
        data.append(`en[description]`, this.$v.item.locales.en.description.$model)
        data.append(`ar[name]`, this.$v.item.locales.ar.name.$model)
        data.append(`ar[description]`, this.$v.item.locales.ar.description.$model)
        console.log(typeof this.$v.item.image.$model !== 'string')
        if (typeof this.$v.item.image.$model !== 'string' && this.$v.item.image.$model !== undefined) {
          data.append(`image`, this.$v.item.image.$model)
        }
        data.append(`type`, this.$v.item.type.$model)
        data.append(`record_order`, parseInt(this.item.record_order))
        data.append(`notes`, this.$v.item.notes.$model)
        data.append(`is_published `, this.$v.item.is_published.$model)
        data.append(`active`, this.$v.item.active.$model)
        console.log('prices', this.item.type)
        if (parseInt(this.item.type) === 0) {
          pObj.prices = this.$v.item.prices.$model
          data.append(`prices`, JSON.stringify(pObj))
        }
        selectCG.customization_groups = this.selectedItems.map(x => ({id: x}))
        data.append(`customization_groups`, JSON.stringify(selectCG))
        data.append(`itemCategory[category_id]`, this.$v.item.category.$model)

        for (var pair of data.entries()) {
          console.log(pair[0] + ', ' + pair[1], typeof pair[1]);
        }
        await this.handleSubmit({
          url: this.item.id ? this.url + `/${this.item.id}` : this.url,
          obj: data
        }).then(response => {
          if (response.status === 201) {
            this.$router.push(`${this.item.id ? '../' : ''}items-list`)
          }
          console.log(response)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    selectFile(event) {
      // `files` is always an array because the file input may be in multiple mode
      this.$v.item.image.$model = event.target.files[0];
      console.log('file', this.$v.item.image.$model instanceof File)
      let imgUrl = this.item.image
      if (imgUrl instanceof File && imgUrl.type.includes("image/")) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.srcUrl = e.target.result;
          // console.log('file', this.srcUrl)
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(imgUrl);
      }
    }
  },
  watch: {
    editable(val) {
      console.log('editable', val)
      if (val) {
        console.log('allowed')
        this.toggleState = false;
        this.toggleShadow = "laffah-shadow";
      } else {
        console.log('not allowed')
        this.toggleState = true;
        this.toggleShadow = "";
      }
    },
    'item': {
      handler: function (item) {
        if (typeof item.image === 'string') {
          this.srcUrl = item.image
        }
        if (item.type) {
          switch (item.type) {
            case true:
              this.$v.item.type.$model = 1
              break
            case false:
              this.$v.item.type.$model = 0
              break
          }

          this.$store.commit('item/SET_CurrentItem', this.$v.item.$model)
        }
        if (item.prices) {
          item.prices.map((x, i) => {
            this.item.prices[i].active = x.price && x.price !== '' ? 1 : 0
          })
        }
      },
      deep: true,
      immediate: true
    },
  }
};
</script>
