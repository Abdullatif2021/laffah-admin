<template>
  <div>
    <div v-if="tabs.length===0" class="loading"></div>
    <b-row align-h="between">
      <b-colxx xxs="6">
        <h1 class="text-uppercase font-weight-bold">{{ title }}</h1>
        <piaf-breadcrumb/>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-row>
          <b-colxx
            xxs="12"
            xs="12"
            lg="12"
            class="mb-3">
            <b-card
              class="mb-4"
              no-body>
              <b-tabs
                v-model="tabIndex"
                card
                fade
                vertical
                lazy
              >
                <b-tab
                  v-for="(i,index) in tabs"
                  v-show="!notAuthorAdmin(index)"
                  v-if="!notAuthorAdmin(index)"
                  :key="'tab-' +index "
                  lazy
                >
                  <template #title>
                    <b-spinner v-if="false" type="grow" small></b-spinner>
                    <strong>{{ $t(`tabs.${i}`) }}</strong>
                  </template>
                  <form action="" @submit.prevent="onFormSubmit">
                    <!--                  <form :action="urlStr" target="_blank" method="get">-->
                    <vue-form-generator
                      :schema="schema"
                      :model="model"
                      :options="formOptions"
                      :isNewModel="true"
                      @model-updated="updateModel"/>
                    <div class="d-flex justify-content-end mt-3 pr-4">
                      <b-button type="submit" size="lg">
                        {{ 'Download Report' }}
                      </b-button>
                    </div>
                  </form>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapGetters, mapActions} from 'vuex';
import VueFormGenerator from "vue-form-generator";
import 'vue-form-generator/dist/vfg.css'
import fieldVueDatetime from "@/containers/fields/fieldVueDatetime";
import axios from "axios";
import {apiUrl} from "@/constants/config";
import {decrypt} from "@/utils";

Vue.component("fieldVueDatetime", fieldVueDatetime);
export default {
  name: 'Reports',
  components: {
    "vue-form-generator": VueFormGenerator.component,
    "fieldVueDatetime": fieldVueDatetime
  },
  data() {
    return {
      isLoad: false,
      tabIndex: 1,
      model: {
        date_from: '',
        date_to: '',
        item: null,
        branch: null,
        withCode: false,
        byProduct: false,
        byBranch: false,
        code: null
      },
      url: apiUrl,
      params: {},
      apiBase: 'orders?order_by=created_at&order_dir=DESC',
      title: this.$t('menu.reports'),
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
        validateAsync: false
      }
    };
  },
  computed: {
    ...mapGetters({
      items: 'item/getItemsList'
    }),
    ...mapGetters({
      branches: 'getBranches'
    }),
    /*urlStr: ({tabIndex, model, url, params}) => {
      params = {}
      params.date_from = model.date_from
      params.date_to = model.date_to
      url += 'reports/export-excel'
      switch (tabIndex) {
        case 2:
          if (model.byProduct) {
            url += '/users-info-by-product'
            params.item_id = model.item.id;
          } else {
            url += '/users-info'
          }
          break
        case 0:
          url += '/get-orders-financial'
          break
        case 1:
          url += '/get-orders'
          if (model.byBranch) {
            params.branch_id = model.branch.id;
          }
          break
      }
      Object.keys(params).forEach(x => {
        let prefix = url.includes('?') ? '&' : '?'
        url += `${x}=${params[x]}`
      })
      return url
    },*/
    tabs: () => [
      'financial',
      'order',
      'user'
    ],
    schema: function ({items, branches, tabIndex}) {
      let lang = this.$i18n.locale
      let values = []
      let fields = []
      let groups = {
        groups: [
          {
            legend: "Date/time",
            fields: [
              {
                type: "VueDatetime",
                class: "col-6",
                label: "From",
                model: "date_from",
                clearButton: true,
              },
              {
                type: "VueDatetime",
                class: "col-6",
                label: "to",
                model: "date_to",
                clearButton: true,
              }
            ]
          }
        ]
      }
      switch (tabIndex) {
        case 2:
          if (items.length > 0) {
            values = items
              .map((itm, i) => {
                // console.log(itm.id, (itm.locales[this.$i18n.locale] || {}).name || '');
                return {
                  name: (itm.locales[this.$i18n.locale] || {}).name || 'noName',
                  id: itm.id
                }
              })
          }
          fields.push(
            {
              type: "checkbox",
              label: "Check for report with specific Product",
              model: "byProduct",
              default: true
            },
            {
              type: "vueMultiSelect",
              label: "item",
              model: "item",
              placeholder: "Select item",
              visible(model) {
                return model.byProduct;
              },
              required(model) {
                return model.byProduct;
              },
              featured: true,
              // validator: validators.required,
              selectOptions: {
                multiple: false,
                key: "id",
                trackBy: 'id',
                label: `name`,
                taggable: true,
                searchable: true,
                closeOnSelect: true,
                allowEmpty: false
              },
              onChanged: function (model, newVal, oldVal, field) {
                // if (newVal[newVal.length - 1].type === 'Value') {
                //   console.log('@tag:Value ', newVal);
                // }
                console.log('model: ', model);
                // console.log('oldVal: ', oldVal);
                // console.log('field: ', field);
              },
              values: values
            })
          break
        case 0:
        case 1:
          if (branches.length > 0 && decrypt(localStorage.getItem('userRole')) <= 2) {
            values = branches
              .map((brn, i) => {
                // console.log(brn.id, (brn.locales[this.$i18n.locale] || {}).name || '');
                return {
                  name: (brn.locales[this.$i18n.locale] || {}).name || 'noName',
                  id: brn.id
                }
              })
            fields.push(
              {
                type: "checkbox",
                label: "Check for report with specific Branch",
                model: "byBranch",
                default: true
              },
              {
                type: "vueMultiSelect",
                label: "Branch",
                model: "branch",
                placeholder: "Select item",
                visible(model) {
                  return model.byBranch;
                },
                required(model) {
                  return model.byBranch;
                },
                featured: true,
                // validator: validators.required,
                selectOptions: {
                  multiple: false,
                  key: "id",
                  trackBy: 'id',
                  label: `name`,
                  taggable: true,
                  searchable: true,
                  closeOnSelect: true,
                  allowEmpty: false
                },
                onChanged: function (model, newVal, oldVal, field) {
                  // if (newVal[newVal.length - 1].type === 'Value') {
                  //   console.log('@tag:Value ', newVal);
                  // }
                  console.log('model: ', model);
                  // console.log('oldVal: ', oldVal);
                  // console.log('field: ', field);
                },
                values: values
              })
          }
          break
        /*case 2:
           fields = [
             {
               type: "checkbox",
               label: "Check for report with specific Promotion Code",
               model: "withCode",
               default: true
             },
             {
               type: "input",
               inputType: "text",
               label: "Code",
               model: "code",
               visible(model) {
                 return model.withCode;
               },
               required(model) {
                 return model.withCode;
               },
               maxlength: 50,
               placeholder: "Promotion Code",
               validator: VueFormGenerator.validators.string
             }
           ]
           break*/
      }
      if (Array.isArray(fields) && fields.length > 0) {
        groups.groups.push({
          legend: "Advanced",
          fields: fields
        })
      }
      return groups
    },
  },
  methods: {
    ...mapActions('orders', ['loadStatusCount']),
    ...mapActions('item', ['loadItemsList']),
    ...mapActions(['handleSubmit', 'fetchBranches']),
    notAuthorAdmin(index) {
      const userRole = decrypt(localStorage.getItem('userRole'))
      return userRole > 2 && index !== this.tabs.indexOf('financial');
    },
    updateModel(newVal, schema) {
      this.$emit("model-updated", newVal, schema);
    },
    formatDateTime(date, withDay = false) {
      if (isNaN(Date.parse(date.replace(/-/g, '/')))) {
        return null
      }
      let options = {weekday: 'short', year: '2-digit', month: 'short', day: 'numeric'};
      let today = new Date(date.replace(/-/g, '/'));
      let o = new Intl.DateTimeFormat("en", {timeStyle: "short", dateStyle: "short", hour12: false});
      return withDay ? today.toLocaleDateString(this.$i18n.locale === 'en' ? "en-US" : 'ar-EG', options) :
        o.format(today)
    },
    getFormatNum(num, digits) {
      let Num = Number(num)
      return Num.toFixed(digits)
    },
    initData(data) {
      let order = {
        id: '',
        status: ''
      }
      if (data) {
        order = data
      }
      this.modalData.isNewModel = true
      this.order = order
    },
    formatParams(params) {
      return "?" + Object
        .keys(params)
        .map(function (key) {
          return key + "=" + encodeURIComponent(params[key])
        })
        .join("&")
    },
    onFormSubmit: async function () {
      let {isLoad, model, tabIndex} = this
      isLoad = true
      let params = {}
      model.date_from !== '' ? params.date_from = model.date_from : null;
      model.date_to !== '' ? params.date_to = model.date_to : null;
      let url = 'reports/export-excel'
      switch (tabIndex) {
        case 2:
          if (model.byProduct) {
            url += '/users-info-by-product'
            params.item_id = model.item.id;
          } else {
            url += '/users-info'
          }
          break
        case 0:
          url += '/get-orders-financial'
          if (model.byBranch) {
            params.branch_id = model.branch.id;
          }
          break
        case 1:
          url += '/get-orders'
          if (model.byBranch) {
            params.branch_id = model.branch.id;
          }
          break
      }
      if (Date.parse(this.model.date_to) < Date.parse(this.model.date_from)) {
        //start is less or equal than End
        this.$notify("error", 'To Date Error', '<em><strong>From</strong></em> date grater than <em><strong>To</strong></em> to date will be <strong>Reset</strong>', {duration: 7000, permanent: false});
        params.date_to = ''
        this.model.date_to = ''
        return null;
      }
      return await axios.get(url, {params, responseType: 'blob'})
        .then(response => {
          if (response.data instanceof Blob && response.data.type !== 'application/json') {
            const blob = new Blob([response.data], {type: response.data.type})
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = response.headers["content-disposition"].split(
              "filename="
            )[1];
            link.click()
            setTimeout(function () {
              URL.revokeObjectURL(link.href)
            }, 1500);
          } else {
            let self = this
            let fr = new FileReader();
            let res = ''
            fr.onload = function () {
              // console.log(JSON.parse(this.result))
              res = JSON.parse(this.result)
              self.$notify("info", res.message, 'Export file', {duration: 7000, permanent: false});
            };
            fr.readAsText(response.data);

          }
          isLoad = false
        }).catch(console.error)
    }
  },
  async mounted() {
    await this.loadItemsList()
    await this.fetchBranches()
  },
  watch: {
    'model.date_to': {
      handler: function (date_to) {
        if (Date.parse(this.model.date_to) < Date.parse(this.model.date_from)) {
          //start is less or equal than End
          this.$notify("error", 'To Date Error', '<em><strong>From</strong></em> date grater than <em><strong>To</strong></em> ', {duration: 7000, permanent: false});
          params.date_to = ''
          this.model.date_to = ''
        }
      },
      deep: true,
      immediate: true
    },
  }
};
</script>
<style scoped>
/deep/ .nav-tabs
.nav-link.active::before,
.nav-tabs .nav-item.show .nav-link::before {
  left: unset;
  width: 5px;
  height: 100%;
  right: 0;
}

/deep/ .xx-small {
  font-size: xx-small !important;
}

/deep/ .top-right-button-container {
  display: none;
}
</style>
