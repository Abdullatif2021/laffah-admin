<template>
  <b-row v-if="itemid">
    <b-colxx xxs="12">
      <!-- <h1>{{ $t("edit_category") }}</h1> -->
      <div v-if="enable_add" class="top-right-button-container">
        <b-button
          variant="primary"
          size="lg"
          class="top-right-button"
          @click="add_new()"
          >Add New</b-button
        >
      </div>
      <piaf-breadcrumb />
      <b-tabs
        nav-class="separator-tabs ml-0 mb-5"
        content-class="tab-content"
        :no-fade="true"
      >
        <b-tab @click="enable_add = false" title="Basic Details" active>
          <template v-if="isLoadCategory">
            <b-row>
              <b-colxx xxs="12">
                <b-card no-body class="mb-4">
                  <b-card-body class="">
                    <b-card-header
                      class="d-flex justify-content-between mb-3 px-0"
                    >
                      <h3
                        class="d-flex align-self-center text-uppercase font-weight-bold"
                      >
                        {{
                          itemid == null
                            ? $t("forms.create-category")
                            : $t("forms.edit-category")
                        }}
                      </h3>
                      <ThumbnailImage
                        v-if="itemid !== undefined"
                        rounded
                        small
                        :src="fileUrl"
                        :alt="categoryFrom.title_en"
                        class-name="m-4 w-12 h-100 m-1 "
                      />
                      <div
                        :class="`d-flex justify-content-end my-3 ${visibleState}`"
                      >
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
                        :label="$t('forms.title-en')"
                        :class="`has-float-label mb-4 ${toggleShadow}`"
                      >
                        <b-form-input
                          :disabled="toggleState"
                          required
                          type="text"
                          v-model.trim="$v.categoryFrom.title_en.$model"
                          :state="!$v.categoryFrom.title_en.$error"
                          :dir="direction"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.categoryFrom.title_en.required"
                          >{{
                            `${$t("forms.title-en")}
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
                          required
                          aria-describedby="v-desc"
                          v-model.trim="$v.categoryFrom.description_en.$model"
                          :state="!$v.categoryFrom.description_en.$error"
                          :dir="direction"
                        ></quill-editor>
                        <b-form-invalid-feedback
                          v-if="!$v.categoryFrom.description_en.required"
                          >{{
                            `${$t("forms.description-en")}
              ${$t("validations.required")}`
                          }}!
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        :label="$t('forms.title-ar')"
                        :class="`has-float-label mb-4 ${toggleShadow}`"
                      >
                        <b-form-input
                          :disabled="toggleState"
                          required
                          type="text"
                          v-model.trim="$v.categoryFrom.title_ar.$model"
                          :state="!$v.categoryFrom.title_ar.$error"
                          :dir="direction"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.categoryFrom.title_ar.required"
                          >{{
                            `${$t("forms.title-ar")}
              ${$t("validations.required")}`
                          }}!
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        :label="$t('forms.description-ar')"
                        :class="`has-float-label mb-4 ${toggleShadow}`"
                      >
                        <quill-editor
                          :disabled="toggleState"
                          required
                          aria-describedby="v-desc"
                          v-model.trim="$v.categoryFrom.description_ar.$model"
                          :state="!$v.categoryFrom.description_ar.$error"
                          :dir="direction"
                        ></quill-editor>
                        <b-form-invalid-feedback
                          v-if="!$v.categoryFrom.description_ar.required"
                          >{{
                            `${$t("forms.description-ar")}
              ${$t("validations.required")}`
                          }}!
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <!-- <b-form-group
                        :label="$t('forms.choose-parent-category')"
                        :class="`has-float-label mb-4 ${toggleShadow}`"
                      >
                        <v-select
                          :reduce="(label) => label.code"
                          label="label"
                          :disabled="toggleState"
                          v-model="categoryFrom.parent_id"
                          :options="categories"
                          :dir="direction"
                        >
                          <template #search="{ attributes, events }">
                            <input
                              class="vs__search"  
                              v-bind="attributes"
                              v-on="events"
                            />
                          </template>
                        </v-select>
                      </b-form-group> -->
                      <b-form-group>
                        <div class="d-flex justify-content-start">
                          <Switches
                            :disabled="toggleState"
                            v-model="active"
                            theme="custom"
                            color="primary mx-2 d-inline"
                            class="vue-switcher-small d-flex align-self-center"
                          ></Switches>
                          <h6 class="d-flex align-self-center">
                            {{ $t("forms.checkout-accessories") }}
                          </h6>
                        </div>
                      </b-form-group>
                      <b-form-group
                        :prepend="$t('forms.image')"
                        :class="`mb-4 ${toggleShadow}`"
                      >
                        <b-form-file
                          :disabled="toggleState"
                          type="file"
                          id="file"
                          ref="file"
                          @change="changeFile"
                          :placeholder="$t('input-groups.choose-image')"
                          v-model.trim="$v.categoryFrom.image.$model"
                          :state="!$v.categoryFrom.image.$error"
                          accept="image/png, image/jpeg, image/svg"
                        />
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
                          :alt="categoryFrom.title_en"
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
          <template v-else>
            <div class="loading"></div>
          </template>
        </b-tab>
        <b-tab @click="get_sub_cate" title="Sub Categories">
          <template v-if="isLoadingSubList">
            <b-colxx xs="12" md="12" class="mb-3">
              <b-card>
                <vuetable
                  ref="custom_vuetable"
                  :data="sub_data"
                  :api-mode="false"
                  :reactive-api-url="true"
                  :fields="sub_fields"
                >
                  <template slot="actions" slot-scope="props">
                    <b-dropdown
                      id="ddown2"
                      size="xs"
                      html=" "
                      split
                      split-class="p-0"
                      class=""
                      variant="secondary"
                    >
                      <template #button-content>
                        <div class="py-0">
                          <b-link
                            id="edit"
                            class="d-flex align-items-center text-white px-2"
                            @click="edit_sub(props.rowData)"
                          >
                            <i
                              style="font-size: 20px"
                              class="iconsminds-gear-2 d-flex"
                            ></i>
                          </b-link>
                        </div>
                      </template>

                      <b-dropdown-item
                        title="Delete Item"
                        class=""
                        v-b-modal="`delete${props.rowData.id}`"
                        scale="1.1"
                      >
                        <i class="simple-icon-trash" />
                        <span class="mx-1">{{ $t("delete") }}</span>
                      </b-dropdown-item>
                    </b-dropdown>

                    <b-modal
                      :id="`delete${props.rowData.id}`"
                      ref="modallg"
                      size="sm"
                      hide-header
                    >
                      <h3>{{ $t("are-you-sure-delete") }}</h3>
                      <template slot="modal-footer">
                        <b-button
                          size="xs"
                          variant="danger"
                          @click="deleteSub(props.rowData.id)"
                          class="mr-1"
                          >{{ $t("delete") }}
                        </b-button>
                        <b-button
                          size="xs"
                          variant="light"
                          @click="hideModal('modallg')"
                          >{{ $t("cancel") }}
                        </b-button>
                      </template>
                    </b-modal>
                  </template>
                </vuetable>
              </b-card>
            </b-colxx>
          </template>
          <template v-else>
            <div class="loading"></div>
          </template>
        </b-tab>
      </b-tabs>
    </b-colxx>
    <b-modal
      ref="subCategoryModal"
      id="subCategoryModal"
      size="lg"
      :title="isModify ? 'Edit Sub Category' : 'Add Sub Category'"
      :hide-backdrop="true"
      :no-close-on-backdrop="true"
    >
      <div>
        <b-colxx v-if="iseEditCategory" sm="12">
          <label
            style="display: flex; justify-content: center"
            class="form-group has-float-label"
          >
            <img
              :src="image"
              style="border-radius: 20%"
              alt="Image"
              width="120"
              height="120"
            />
          </label>
        </b-colxx>
        <b-form @submit.prevent="onGridFormSubmit">
          <b-colxx sm="12">
            <b-form-group class="has-float-label mb-4" label="English Title">
              <b-form-input
                required
                type="text"
                :state="!$v.english_title.$error"
                v-model="$v.english_title.$model"
              />
              <b-form-invalid-feedback v-if="!$v.english_title.required"
                >This Field is required</b-form-invalid-feedback
              >
            </b-form-group>
          </b-colxx>
          <b-colxx sm="12">
            <b-form-group
              class="has-float-label mb-4"
              label="English Description"
            >
              <quill-editor
                :disabled="toggleState"
                required
                aria-describedby="v-desc"
                :state="!$v.english_desc.$error"
                v-model.trim="$v.english_desc.$model"
                :dir="direction"
              ></quill-editor>
              <b-form-invalid-feedback v-if="!$v.english_desc.required"
                >This Field is required</b-form-invalid-feedback
              >
            </b-form-group>
          </b-colxx>
          <b-colxx sm="12">
            <b-form-group class="has-float-label mb-4" label="Arabic Title">
              <b-form-input
                required
                type="text"
                :state="!$v.arabic_title.$error"
                v-model="$v.arabic_title.$model"
              />
              <b-form-invalid-feedback v-if="!$v.arabic_title.required"
                >This Field is required</b-form-invalid-feedback
              >
            </b-form-group>
          </b-colxx>
          <b-colxx sm="12">
            <b-form-group
              class="has-float-label mb-4"
              label="Arabic Description"
            >
              <quill-editor
                :disabled="toggleState"
                required
                aria-describedby="v-desc"
                :state="!$v.arabic_desc.$error"
                v-model.trim="$v.arabic_desc.$model"
                :dir="direction"
              ></quill-editor>
              <b-form-invalid-feedback v-if="!$v.arabic_desc.required"
                >This Field is required</b-form-invalid-feedback
              >
            </b-form-group>
          </b-colxx>
          <b-colxx sm="12">
            <b-form-group class="has-float-label mb-4" label="Parent Category">
              <b-form-input type="text" readonly v-model="parent_category" />
            </b-form-group>
          </b-colxx>

          <b-colxx xxs="12">
            <b-form-group
              class="has-float-label mb-4"
              :label="$t('forms.image')"
            >
              <vue-dropzone
                ref="myVueDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-files-added="fileAdded"
                @vdropzone-removed-file="fileRemoved"
              ></vue-dropzone>
            </b-form-group>
            <div v-if="image" class="image-review-show">
              <img
                style="max-width: 100%; max-height: 100%"
                :src="isimgModify ? image : getImageUrl"
                alt="image"
              />
            </div>
          </b-colxx>
        </b-form>
      </div>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          :disabled="enable"
          @click="addSubCategory()"
          class="mr-1"
          >{{ isModify ? $t("forms.submit") : $t("pages.add-new") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('subCategoryModal')">{{
          $t("pages.cancel")
        }}</b-button>
      </template>
    </b-modal>
  </b-row>
  <b-row v-else>
    <b-colxx xxs="12">
      <!-- <h1>{{ $t("edit_category") }}</h1> -->

      <piaf-breadcrumb />
      <div class="separator mb-5" />

      <b-row>
        <b-colxx xxs="12">
          <b-card no-body class="mb-4">
            <b-card-body class="">
              <b-card-header class="d-flex justify-content-between mb-3 px-0">
                <h3
                  class="d-flex align-self-center text-uppercase font-weight-bold"
                >
                  {{
                    itemid == null
                      ? $t("forms.create-category")
                      : $t("forms.edit-category")
                  }}
                </h3>
                <ThumbnailImage
                  v-if="itemid !== undefined"
                  rounded
                  small
                  :src="fileUrl"
                  :alt="categoryFrom.title_en"
                  class-name="m-4 w-12 h-100 m-1 "
                />
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
                  :label="$t('forms.title-en')"
                  :class="`has-float-label mb-4 ${toggleShadow}`"
                >
                  <b-form-input
                    :disabled="toggleState"
                    required
                    type="text"
                    v-model.trim="$v.categoryFrom.title_en.$model"
                    :state="!$v.categoryFrom.title_en.$error"
                    :dir="direction"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.categoryFrom.title_en.required"
                    >{{
                      `${$t("forms.title-en")}
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
                    required
                    aria-describedby="v-desc"
                    v-model.trim="$v.categoryFrom.description_en.$model"
                    :state="!$v.categoryFrom.description_en.$error"
                    :dir="direction"
                  ></quill-editor>
                  <b-form-invalid-feedback
                    v-if="!$v.categoryFrom.description_en.required"
                    >{{
                      `${$t("forms.description-en")}
              ${$t("validations.required")}`
                    }}!
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                  :label="$t('forms.title-ar')"
                  :class="`has-float-label mb-4 ${toggleShadow}`"
                >
                  <b-form-input
                    :disabled="toggleState"
                    required
                    type="text"
                    v-model.trim="$v.categoryFrom.title_ar.$model"
                    :state="!$v.categoryFrom.title_ar.$error"
                    :dir="direction"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.categoryFrom.title_ar.required"
                    >{{
                      `${$t("forms.title-ar")}
              ${$t("validations.required")}`
                    }}!
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                  :label="$t('forms.description-ar')"
                  :class="`has-float-label mb-4 ${toggleShadow}`"
                >
                  <quill-editor
                    :disabled="toggleState"
                    required
                    aria-describedby="v-desc"
                    v-model.trim="$v.categoryFrom.description_ar.$model"
                    :state="!$v.categoryFrom.description_ar.$error"
                    :dir="direction"
                  ></quill-editor>
                  <b-form-invalid-feedback
                    v-if="!$v.categoryFrom.description_ar.required"
                    >{{
                      `${$t("forms.description-ar")}
              ${$t("validations.required")}`
                    }}!
                  </b-form-invalid-feedback>
                </b-form-group>
                <!-- <b-form-group
                  :label="$t('forms.choose-parent-category')"
                  :class="`has-float-label mb-4 ${toggleShadow}`"
                >
                  <v-select
                    :reduce="(label) => label.code"
                    label="label"
                    :disabled="toggleState"
                    v-model="categoryFrom.parent_id"
                    :options="categories"
                    :dir="direction"
                  >
                    <template #search="{ attributes, events }">
                      <input
                        class="vs__search"
                        v-bind="attributes"
                        v-on="events"
                      />
                    </template>
                  </v-select>
                </b-form-group> -->
                <b-form-group>
                  <div class="d-flex justify-content-start">
                    <Switches
                      :disabled="toggleState"
                      v-model="active"
                      theme="custom"
                      color="primary mx-2 d-inline"
                      class="vue-switcher-small d-flex align-self-center"
                    ></Switches>
                    <h6 class="d-flex align-self-center">
                      {{ $t("forms.checkout-accessories") }}
                    </h6>
                  </div>
                </b-form-group>
                <b-form-group
                  :prepend="$t('forms.image')"
                  :class="`mb-4 ${toggleShadow}`"
                >
                  <b-form-file
                    :disabled="toggleState"
                    type="file"
                    id="file"
                    ref="file"
                    @change="changeFile"
                    :placeholder="$t('input-groups.choose-image')"
                    v-model.trim="$v.categoryFrom.image.$model"
                    :state="!$v.categoryFrom.image.$error"
                    accept="image/png, image/jpeg, image/svg"
                  />
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
                    :alt="categoryFrom.title_en"
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
    </b-colxx>
  </b-row>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { validationMixin } from "vuelidate";
import { getDirection } from "../../utils";
import axios from "axios";
import Vuetable from "vuetable-2/src/components/Vuetable";

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
import VueDropzone from "vue2-dropzone";

import { mapGetters, mapActions } from "vuex";
// note: changing position to type to Benefit the display
const { required, maxLength, integer } = require("vuelidate/lib/validators");
export default {
  components: {
    "v-select": vSelect,
    datepicker: Datepicker,
    "quill-editor": quillEditor,
    ThumbnailImage,
    vuetable: Vuetable,
    "vue-dropzone": VueDropzone,

    Switches,
  },
  props: ["itemid", "apiBase"],
  mixins: [validationMixin],
  validations: {
    arabic_title: {
      required,
    },
    arabic_desc: {},
    english_title: {
      required,
    },
    english_desc: {},
    categoryFrom: {
      title_en: {
        required,
        maxLength: maxLength(200),
      },
      description_en: {
        required,
      },
      title_ar: {
        required,
        maxLength: maxLength(200),
      },
      description_ar: {
        required,
      },
      image: {
        required,
      },
    },
  },
  data() {
    return {
      active: false,
      visibleState: "visible",
      disableSubmit: false,
      required: null,
      sub_data: null,
      isfile: false,
      image: null,
      arabic_title: null,
      arabic_desc: null,
      english_title: null,
      english_desc: null,
      enable: false,
      isLoadCategory: true,
      parent_category: null,
      isLoadingSubList: true,
      fileUrl: "",
      isSub: true,
      isimgModify: false,
      sub_fields: [
        {
          name: "id",
          title: "ID",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: `locales.en.title`,
          title: "Title En",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: `locales.ar.title`,
          title: "Title Ar",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%",
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "10%",
        },
      ],
      isModify: false,
      dropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {},
        acceptedFiles: "image/jpeg,image/png,image/gif",
      },
      editable: false,
      enable_add: false,
      iseEditCategory: false,
      toggleState: true,
      toggleShadow: "",
      perent_id: null,
      isLoad: false,
      direction: getDirection().direction,
      dataresult: null,
      newCategories: [
        //  { label: '', code: '' }, { label: '', code: '' }, { label: '', code: '' }, { label: '', code: '' }, { label: '', code: '' }
      ],
      categoryFrom: {
        title_en: "",
        description_en: "",
        title_ar: "",
        description_ar: "",
        parent_id: {
          label: undefined,
          code: undefined,
        },
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
    if (this.itemid == undefined || this.itemid == null || true) {
      this.visibleState = "invisible";
      this.toggleState = false;
      this.toggleShadow = "fishday-shadow";
      this.required = "required";
    }
  },

  watch: {
    editable(val) {
      if (val) {
        this.toggleState = false;
        this.toggleShadow = "fishday-shadow";
      } else {
        this.toggleState = true;
        this.toggleShadow = "";
      }
    },
    successUpdateSubCategory: function (val) {
      this.$v.$reset();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Sub Category have been updated successfully",
        { duration: 3000, permanent: false }
      );
      this.$refs["subCategoryModal"].hide();
      this.getSubCategory({ id: this.itemid });
    },
    successCreateSubCategory: function (val) {
      this.$v.$reset();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Sub Category have been Created successfully",
        { duration: 3000, permanent: false }
      );
      this.$refs["subCategoryModal"].hide();
      this.getSubCategory({ id: this.itemid });
    },
    successDeleteSubCategory: function (val) {
      this.$v.$reset();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Sub Category have been deleted successfully",
        { duration: 3000, permanent: false }
      );
      this.$refs["modallg"].hide();
      this.getSubCategory({ id: this.itemid });
    },
    SubCategory: function (val) {
      this.sub_data = val;
      this.isLoadingSubList = true;
      this.enable = false;
      this.arabic_title = null;
      this.arabic_desc = null;
      this.english_title = null;
      this.english_desc = null;
      this.image = null;
    },
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    },
    getImageUrl() {
      return URL.createObjectURL(this.image[0]);
    },
    ...mapGetters(
      "category",

      [
        "getCategoriesList",
        "successDeleteSubCategory",
        "successUpdateSubCategory",
        "successCreateSubCategory",
        "SubCategory",
      ]
    ),

    categories() {
      try {
        this.newCategories = this.getCategoriesList.map((x) => {
          return {
            label: x.locales[this.$i18n.locale].title,
            code: x.id,
          };
        });
        if (this.itemid != undefined || this.itemid != null) {
          this.newCategories = this.newCategories.filter(
            (a) => a.code != this.dataresult.id
          );
        }

        return this.newCategories;
      } catch (err) {
        return this.newCategories;
      }
    },
  },
  methods: {
    get_sub_cate() {
      this.isLoadingSubList = false;
      this.getSubCategory({ id: this.itemid });
      this.enable_add = true;
    },
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
    add_new() {
      this.$refs["subCategoryModal"].show();
      this.parent_category = `${this.categoryFrom.title_ar} - ${this.categoryFrom.title_en}`;
      this.perent_id = this.itemid;
      this.enable = false;
      this.arabic_title = null;
      this.arabic_desc = null;
      this.english_title = null;
      this.english_desc = null;
      this.image = null;
    },
    edit_sub(item) {
      console.log(item);
      this.image = item.image;
      this.arabic_title = item.locales.ar.title;
      this.arabic_desc = item.locales.ar.description;
      this.english_title = item.locales.en.title;
      this.english_desc = item.locales.en.description;
      this.isModify = true;
      this.isimgModify = true;
      this.parent_category = `${this.categoryFrom.title_ar} - ${this.categoryFrom.title_en}`;
      this.image = item.image;
      this.sub_id = item.id;
      this.perent_id = item.parent_id;
      this.$refs["subCategoryModal"].show();
      console.log(this.english_title, "this.english_title ");

      this.english_title;
    },
    addSubCategory() {
      this.$v.$touch();
      if (!this.$v.arabic_title.$invalid && !this.$v.english_title.$invalid) {
        this.enable = true;
        if (this.isModify) {
          this.updateSubCategory({
            info: {
              "ar[title]": this.arabic_title,
              "ar[description]": this.arabic_desc,
              "en[title]": this.english_title,
              "en[description]": this.english_desc,
            },
            image: this.isimgModify ? null : this.image[0],
            sub_id: this.sub_id,
            id: this.perent_id,
          });
        } else {
          this.createSubCategory({
            info: {
              "ar[title]": this.arabic_title,
              "ar[description]": this.arabic_desc,
              "en[title]": this.english_title,
              "en[description]": this.english_desc,
            },
            image: this.image ? this.image[0] : null,
            id: this.perent_id,
          });
        }
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
    hideModal(val) {
      this.$refs[val].hide();
    },
    deleteSub(id) {
      this.deleteSubCategory({ sub_id: id });
    },
    fileAdded(image) {
      this.image = image;
      this.isimgModify = false;
    },
    fileRemoved(image) {
      this.image = null;
      this.isimgModify = false;
    },
    getData() {
      if (this.itemid != undefined || this.itemid != null) {
        axios
          .get(this.apiBase + "/" + this.itemid, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            //this.branches();
            this.dataresult = res.data.data;
            this.$v.categoryFrom.title_en.$model =
              this.dataresult.locales.en.title;
            this.$v.categoryFrom.description_en.$model =
              this.dataresult.locales.en.description;
            this.$v.categoryFrom.title_ar.$model =
              this.dataresult.locales.ar.title;
            this.$v.categoryFrom.description_ar.$model =
              this.dataresult.locales.ar.description;
            this.categoryFrom.parent_id = this.dataresult.parent_id;
            console.log(
              "this.categoryFrom.parent_id",
              this.categoryFrom.parent_id,
              " === ",
              this.dataresult.parent_id,
              this.categories.filter(
                (x) => x.code == parseInt(this.dataresult.parent_id)
              )
            );
            this.active = this.dataresult.add_to_menu == "1" ? true : false;
            this.fileUrl =
              this.dataresult.image_webp === ""
                ? this.dataresult.image
                : `${this.dataresult.image_baseurl}/small/${this.dataresult.image_webp}`;
            this.isLoad = true;
          });
      } else {
        this.isLoad = true;
      }
    },
    setData() {
      this.disableSubmit = true;
      this.isLoad = false;
      this.formData = new FormData();
      this.formData.append("en[title]", this.categoryFrom.title_en);
      this.formData.append("en[description]", this.categoryFrom.description_en);
      this.formData.append("ar[title]", this.categoryFrom.title_ar);
      this.formData.append("ar[description]", this.categoryFrom.description_ar);
      console.log("this.categoryFrom.parent_id", this.categoryFrom.parent_id);
      if (this.categoryFrom.parent_id !== undefined) {
        this.formData.append("parent_id", this.categoryFrom.parent_id);
      }
      this.formData.append("add_to_menu", this.active == true ? "1" : "0");
      if (this.categoryFrom.image)
        if (this.isfile) {
          //check upload new file
          this.formData.append("image", this.categoryFrom.image);
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
            //console.log("res : " + this.dataresult.data.image)
            if (this.dataresult.data.success == true) {
              // window.location.href = '../../';
              this.$router.push("../list");
              this.$notify(
                "success",
                "Category has been Updated Successfully",
                null,
                {
                  duration: 5000,
                  permanent: false,
                }
              );
            } else if (this.dataresult == undefined) {
              this.$notify(
                "warning",
                "Category was not Updated",
                "please try again Later",
                null,
                {
                  duration: 5000,
                  permanent: false,
                }
              );
              this.disableSubmit = false;
              //  window.location.href = '../../';
            } else {
              this.$notify(
                "warning",
                "Category was not Updated",
                "please try again Later",
                null,
                {
                  duration: 5000,
                  permanent: false,
                }
              );
              this.disableSubmit = false;
            }
          })
          .catch((error) => {
            this.isLoad = true;
            this.disableSubmit = false;
            this.$notify(
              "error",
              "Category was not Updated",
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
            //console.log("res : " + this.dataresult)

            if (this.dataresult.data.success == true) {
              this.$router.push("list");
              this.$notify(
                "success",
                "Category has been Added Successfully",
                null,
                { duration: 5000, permanent: false }
              );
              // window.location.href = '../../';
            } else if (this.dataresult == undefined) {
              this.$notify(
                "warning",
                "Category was not Added",
                "please try again Later",
                null,
                {
                  duration: 5000,
                  permanent: false,
                }
              );
              this.disableSubmit = false;
              //  window.location.href = '../../';
            } else {
              this.$notify(
                "warning",
                "Category was not Added",
                "please try again Later",
                null,
                {
                  duration: 5000,
                  permanent: false,
                }
              );
              this.disableSubmit = false;
            }
          })
          .catch((error) => {
            this.disableSubmit = false;
            this.isLoad = true;
            this.$notify(
              "error",
              "Category was not Added",
              "Network Error",
              null,
              { duration: 5000, permanent: false }
            );
            console.log(error);
          });
      }
    },
    ...mapActions("category", [
      "loadCategoriesList",
      "getSubCategory",
      "updateSubCategory",
      "createSubCategory",
      "deleteSubCategory",
    ]),

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
  async mounted() {
    await this.getData();
    //await this.$store.dispatch('category/loadCategoriesList')
    await this.loadCategoriesList();
  },
};
</script>

<style lang="scss" scoped>
.image-review-show {
  border: 1px solid #eceaea;
  height: 370px;
}
</style>
