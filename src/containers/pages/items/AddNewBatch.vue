<template>
  <b-modal
    :hide-footer="authorSuperadmin || authorAdmin ? false: true"
    id="modalright"
    ref="modalright"
    :title="$t('pages.add-new-batch')"
    modal-class="modal-right">
    <div
      v-if="authorSuperadmin || authorAdmin"
      :class="`d-flex justify-content-end my-3 ${visibleState}`">
      <switches
        v-model="editable"
        theme="custom"
        color="primary mx-2 d-inline"
        class="vue-switcher-small d-flex align-self-center"></switches>
      <h6 class="font-weight-bold d-flex align-self-center">Enable Editing</h6>
    </div>
    <b-form
      @submit.prevent="onValidateCategoryFormFormSubmit"
      class="av-tooltip tooltip-label-bottom">
      <b-form-group
        :label="$t('forms.batch')"
        :class="`has-float-label mb-4 ${toggleShadow}`">
        <b-form-input
          :disabled="toggleState"
          type="text"
          pat
          v-model.trim="$v.batch.batch.$model"
          :state="!$v.batch.batch.$error" />
        <b-form-invalid-feedback v-if="!$v.batch.batch.required">{{`${$t('forms.title_ar')}
          ${$t('validations.required')}`}}!
        </b-form-invalid-feedback>
      </b-form-group>
      <b-input-group
        v-if="false"
        :prepend="$t('forms.image')"
        :class="`has-float-label mb-4 ${toggleShadow}`">
        <b-form-file
          :disabled="toggleState"
          type="image"
          @change="selectFile"
          :placeholder="$t('input-groups.choose-file')"
          accept="image/png, image/jpeg, image/svg" />
      </b-input-group>
      <b-form-group :class="`has-float-label mb-4 ${toggleShadow}`">

        <v-select
          :disabled="toggleState"
          label="subTitle"
          multiple
          :options="options"
          :reduce="attribute => ({attribute_id:attribute.attribute_id, value:attribute.value})"
          :selectable="option => !(batch.attributes.map(a=>a.attribute_id).includes(option.attribute_id) && option.type==='List')"
          v-model="batch.attributes"
          @search="onSearch"
          @change="selecting($event)">
          <template #option="{ title, subTitle}">
            <small>{{ title }}</small>
            <br />
            {{ subTitle }}
          </template>
          <template #header>
            <div style="opacity: .8">{{$t('forms.search-attribute-massage')}}!</div>
          </template>
        </v-select>
      </b-form-group>
      <b-form-group
        :label="$t('forms.cities-prices')"
        :class="`has-float-label mb-4 ${toggleShadow}`">
        <b-form-row
          v-if="batch && cities"
          v-for="(cityPrice,index) in {...batch.prices,...cities}"
          :key="cityPrice.id">
          <colxx xxs="8">
            <b-input-group
              :prepend="cityPrice.locales[$i18n.locale].name"
              class="mb-3">
              <b-form-input
                :disabled="toggleState"
                type="text"
                @input="setCityId(cityPrice.id,index)"
                v-model.trim="$v.batch.prices.$each[index].price.$model" />
            </b-input-group>
          </colxx>
          <colxx xxs="4">
            <b-from-group>
              <switches
                :disabled="toggleState"
                type="number"
                :label="$t('forms.active')"
                value="0"
                v-model="batch.prices[index].active"
                theme="custom"
                color="primary"
                class="mr-4"></switches>
            </b-from-group>
          </colxx>
        </b-form-row>
      </b-form-group>

    </b-form>

    <template v-if="authorSuperadmin || authorAdmin" slot="modal-footer">
      <b-button
        :disabled="toggleState"
        variant="outline-secondary"
        @click="hideModal('modalright')">{{ $t('pages.cancel') }}
      </b-button>
      <b-button
        :disabled="toggleState"
        variant="primary"
        @click="onValidateCategoryFormFormSubmit()"
        class="mr-1">{{ $t('pages.submit') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import InputTag from "../../../components/Form/InputTag";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { BFormGroup } from 'bootstrap-vue'
import { mapState, mapGetters } from 'vuex';
import { validationMixin } from "vuelidate";
import { apiUrl } from "../../../constants/config";
import Switches from "vue-switches";
import _ from 'lodash';
import axios from 'axios'
import Colxx from "../../../components/Common/Colxx";
import { decrypt } from '../../../utils';

const {
  required,
  alpha,
  maxLength,
  minLength,
  helpers
} = require("vuelidate/lib/validators");

export default {
  components: {
    "colxx": Colxx,
    "input-tag": InputTag,
    "b-from-group": BFormGroup,
    "v-select": vSelect,
    "switches": Switches
  },
  props: ["attributes", ],
  data() {
    return {
      visibleState: "visible",
      disableSubmit: false,
      required: null,
      editable: false,
      toggleState: true,
      toggleShadow: "",

      url: 'items/batches',
      label: `locales.${this.$i18n.locale}.title`,
      options: [],
      batch: {
        batch: '',
        attributes: [],
        prices: [{
            city_id: null,
            price: null,
            active: 1
          },
          {
            city_id: null,
            price: null,
            active: 1
          }
        ],
      },
      citiesPrices: [],
    };
  },
  mounted() {
    this.search(null, " ", this);
  },
  mixins: [validationMixin],
  validations: {
    batch: {
      batch: {
        required,
      },
      attributes: {
        required,
        minLength: minLength(1),
        $each: {
          attribute_id: { required },
          value: { required }
        }
      },
      prices: {
        required,
        $each: {
          city_id: { required },
          price: { required },
          active: { required }
        }
      },
    },
  },
  computed: {
    authorSuperadmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      if (userRole == 1) {
        return true
      } else
        return false
    },
    authorAdmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      if (userRole == 2) {
        return true
      } else
        return false
    },
    ...mapGetters({
      cities: 'getCities',
    }),
    ...mapState('item', [
      'currentBatch',
      'currentItem'
    ]),
  },
  methods: {
    onValidateCategoryFormFormSubmit: function () {
      this.$v.batch.$touch();
      let data = new FormData();
      let ids = this.currentItem.id
      if (this.currentBatch !== null) {
        data.append('_method', 'PUT');
        data.append("id", this.currentBatch.id)
        ids += `/${this.currentBatch.id}`
      }
      Object.keys(this.$v.batch.$model).map((key) => {
        let obj = {}
        return !(['attributes', 'prices'].indexOf(key) !== -1) ?
          data.append(key, this.$v.batch.$model[key]) :
          (obj[key] = this.$v.batch.$model[key], (data.append(key, JSON.stringify(obj))))
      });
      for (var pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1], typeof pair[1]);
      }

      this.$store.dispatch('handleSubmit', {
        url: `${this.url}/${ids}`,
        obj: data
      }).then(response => console.log(response))
    },
    setCityId(id, index) {
      this.batch.prices[index].city_id = id
    },
    selectFile(event) {
      // `files` is always an array because the file input may be in multiple mode
      this.$v.batch.image.$model = event.target.files[0];
      // this.$v.batch.image.$model = this.$refs.file.files;
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    selecting(e) {
      // this.$emit("input", e.target.value);
    },
    onSearch(search, loading) {
      console.log(search)
      loading(true);
      this.search(loading, search, this);
    },
    search: _.debounce((loading, search, vm) => {
      axios.get(
        `${apiUrl}attributes`
      ).then(res => {
        console.log(res)
        vm.options = res.data.data.flatMap((x, i) => {
          let vl = JSON.parse(x.locales[vm.$i18n.locale].list_values)
          return Object.keys(vl).map((key, index) => {
            let o = {}
            o["attribute_id"] = x.id
            o["type"] = x.type
            if (typeof vl[key] === 'object') {
              // o["title"] = x.locales[vm.$i18n.locale].title + '-' + vl[key].value
              o["title"] = x.locales[vm.$i18n.locale].title
              o["subTitle"] = vl[key].value
              o["value"] = vl[key].id
              return o
            }
            // o["title"] = x.locales[vm.$i18n.locale].title + '-' + vl[key]
            o["title"] = x.locales[vm.$i18n.locale].title
            o["subTitle"] = vl[key]
            o["value"] = key
            return o
          })
        });

        if (loading)
          loading(false);
      });
    }, 350),
  },
  watch: {
    editable(val) {
      if (val == true) {
        this.toggleState = false;
        this.toggleShadow = "laffah-shadow";
      } else {
        this.toggleState = true;
        this.toggleShadow = "";
      }
    },
    currentBatch(val) {
      this.$v.batch.$reset()
      //todo:check reset the form.
      if (val !== null) {
        this.$v.batch.batch.$model = val.batch
        this.$v.batch.attributes.$model = val.batchDetails.map(attr => {
          let subTitle = JSON.parse(attr.attribute.locales[this.$i18n.locale].list_values)[attr.value]
          let o = {
            attribute_id: attr.attribute_id,
            title: attr.attribute.locales[this.$i18n.locale].title,
            subTitle: subTitle.value,
            value: attr.value
          }
          // return o
          this.options.push(o)
          return {
            attribute_id: attr.attribute_id,
            value: attr.value,
            subTitle: subTitle.value
          }
        })
        this.$v.batch.prices.$model = val.prices.map((price, index) => {
          return {
            city_id: price.city_id,
            price: price.price,
            value: price.value,
            active: price.active
          }
        })
      } else {
        this.$v.$reset()
      }
    },
    'batch.prices': {
      handler: function (prices) {
        prices.forEach((price, index) => {
          this.$v.batch.prices.$each[index].active.$model = price.active == true ? 1 : 0
        })
      },
      deep: true,
      immediate: true
    },
  }
};
</script>
