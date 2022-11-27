<template>
  <section :ref="`invoice-${order.id}`" :id="`invoice-${order.id}`">
    <b-card
      dir="rtl"
      bg-variant="light"
      body-class="text-center"
      class="bg-transparent text-center"
      footer-class="bg-transparent border-0"
      no-body
    >
      <template #header>
        <div class="mt-5 justify-content-center justify-content-md-around">
          <span class="logo-single position-absolute align-self-end" style="left: 1.5rem;"></span>
          <p style="text-align: start;">سلسلة مطاعم لفاح<br>
            فرع {{ (((branch || {}).locales || {}).ar || {}).name || '' }}<br>
            الجوال {{ (branch || {}).mobile || '' }}<br>
            <span>{{ (((branch || {}).locales || {}).ar || {}).address }}</span></p>
        </div>
      </template>
      <b-card-title class="d-flex flex-column align-items-center justify-content-center text-dark text-center">
        <b-card-text class="mb-0">فاتورة رقم.</b-card-text>
        <b-card-text dir="ltr" class="mb-0">Invoice No.</b-card-text>
        <b-card-text class="mb-0 text-muted">{{ order.order_key }}</b-card-text>
      </b-card-title>
      <b-card-sub-title class="d-flex flex-column align-items-center mb-1">
        <b-card-text class="mb-0">التاريخ</b-card-text>
        <b-card-text class="mb-0">Date</b-card-text>
        <b-card-text class="mb-0 text-dark">{{ formatDateTime(order.entry_date, true) }}</b-card-text>
      </b-card-sub-title>
<!--      <b-card-sub-title class="d-flex flex-column align-items-center mb-1">
        <b-card-text class="mb-0">المستلم</b-card-text>
        <b-card-text dir="ltr" class="mb-0">Receiver</b-card-text>
        <b-card-text class="mb-0 text-dark">{{ order.contact_name }}</b-card-text>
      </b-card-sub-title>-->
      <b-card-sub-title class="d-flex flex-column align-items-center mb-1">
        <b-card-text class="mb-0">رقم التواصل</b-card-text>
        <b-card-text dir="ltr" class="mb-0">Contact Number</b-card-text>
        <b-card-text class="mb-0 text-dark">{{ order.contact_phone_number }}</b-card-text>
      </b-card-sub-title>
      <b-card-sub-title v-if="parseInt(order.is_pickup)===0" class="d-flex flex-column align-items-center mb-1">
        <b-card-text class="mb-0">العنوان</b-card-text>
        <b-card-text dir="ltr" class="mb-0">Address</b-card-text>
        <b-card-text class="mb-0">
          <b-card-text class="text-dark">
            {{ (((((order || {}).address || {}).country || {}).locales || {})[$i18n.locale] || {}).name || '' }},
            {{ (((((order || {}).address || {}).city || {}).locales || {})[$i18n.locale] || {}).name || '' }},
            {{ ((order || {}).address || {}).region }},
            {{ ((order || {}).address || {}).street }},
            {{ ((order || {}).address || {}).building }}
            {{ ((order || {}).address || {}).floor }}
          </b-card-text>
        </b-card-text>
      </b-card-sub-title>
      <b-card-sub-title v-if="parseInt(order.is_pickup)===1" class="d-flex flex-column mb-0">
        <b-card-text class="mb-0">وقت اﻻستلام</b-card-text>
        <b-card-text dir="ltr" class="mb-0">Pickup Time</b-card-text>
        <b-card-text class="mb-0">
          <b-card-text>
            {{ order.delivery_time }}
          </b-card-text>
        </b-card-text>
      </b-card-sub-title>
      <b-card-body body-class="pt-3 text-center">
        <!--        <b-table
                  :fields="fields"
                  :items="products"
                  tbody-tr-class="text-muted"
                  class="px-3 justify-self-center bg-transparent"
                  foot-clone
                >
                  <template #cell(item.locales)="row">
                    <div>
                      {{ (((((row || {}).item || {}).item || {}).locales || {})['ar'] || {}).name || '' }}
                    </div>
                  </template>
                  <template #foot(item.locales)="data">
                    <span class="text-semi-muted">السعر</span>
                  </template>
                  <template #foot(order_details_customization)="data">
                    <span class="text-muted">{{ order.total_before_vat }}</span>
                  </template>
                  <template #foot(qty)="data">
                    <span class="text-muted">+ الضريبة</span>
                  </template>
                  <template #foot(batch_price)="data">
                    <span class="text-muted">{{ order.vat_value }}</span>
                  </template>
                  <template #foot(discount_percentage)="data">
                    <span class="text-danger">اﻹجمالي (د.إ)</span>
                  </template>
                  <template #foot(total)="data">
                    <span class="text-danger "><span class="text-danger">اﻹجمالي</span>&nbsp;:&nbsp;{{
                        order.total
                      }}(د.إ)</span>
                  </template>
                </b-table>-->
        <b-card
          no-body
        >
          <b-row no-gutters>
            <b-colxx xxs="8">
              <b-card-body>
                <b-card-title class="mb-2">
                  المنتج
                </b-card-title>
              </b-card-body>
            </b-colxx>
            <b-colxx xxs="4">
              <b-card-body>
                <b-card-title class="d-flex align-items-center m-0 p-0">السعر
                </b-card-title>
              </b-card-body>
            </b-colxx>
          </b-row>
        </b-card>
        <b-card
          v-for="item in products"
          no-body
        >
          <b-row no-gutters>
            <b-colxx xxs="8">
              <b-card-body>
                <b-card-title class="mb-2">{{ ((((item || {}).item || {}).locales || {})['ar'] || {}).name || '' }}
                </b-card-title>
                <div
                  v-if="Array.isArray(item.order_details_customization)&& !$_.isEmpty(item.order_details_customization)"
                >
                  <b-card-sub-title>الإضافات</b-card-sub-title>
                  <b-list-group
                    flush
                  >
                    <b-list-group-item
                      v-for="custom in item.order_details_customization"
                    >
                      {{ ((((custom || {}).customization || {}).locales || {})['ar'] || {}).title || '-' }}
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-around">
                      <span>الكمية:</span>
                      <span>{{ item.qty }}</span>
                    </b-list-group-item>
                  </b-list-group>
                </div>
              </b-card-body>

              <b-card-footer class="d-flex justify-content-around bg-white">
                <span>سعر المفرد:</span>
                <span>{{ item.batch_price }}</span>
              </b-card-footer>
            </b-colxx>
            <b-colxx xxs="4">
              <b-card-body body-class="h-100 d-flex justify-content-center align-items-center">
                <b-card-title class="d-flex align-items-center m-0 p-0">{{ (item || {}).total }}
                </b-card-title>
              </b-card-body>
            </b-colxx>
          </b-row>
        </b-card>
        <b-card
          no-body
        >
          <b-row no-gutters>
            <b-colxx xxs="8">
              <b-card-body>
                <b-card-title class="mb-2">
                  سعر الاجمالي:
                </b-card-title>
              </b-card-body>

              <b-card-footer class="d-flex justify-content-around bg-white">
                <span>الضريبة:</span>
                <span>{{ order.vat_value }}</span>
              </b-card-footer>
            </b-colxx>
            <b-colxx xxs="4">
              <b-card-body>
                <b-card-title class="d-flex justify-content-center m-0 p-0">{{ (order || {}).total }}
                </b-card-title>
              </b-card-body>
            </b-colxx>
          </b-row>
        </b-card>
      </b-card-body>
      <template #footer>
        <b-row class="mx-1 align-items-center justify-content-between">
          <colxx xxs="6" class="">
            <p style="text-align: start;">المحاسب<br>Accountant<br></p>
          </colxx>
          <colxx xxs="6" class="d-flex flex-column justify-content-end">
            <p style="text-align: end;">المستلم<br>Receiver</p>
          </colxx>
        </b-row>
        <b-row class="mx-1 mb-5 justify-content-between">
          <colxx xxs="6" class="d-flex align-items-end">
            <colxx xxs="6" class="p-0 text-muted">
              <hr class="mb-0">
            </colxx>
          </colxx>
          <colxx xxs="6" class="d-flex align-items-center justify-content-end">
            <b-card-text><u>{{ order.contact_name }}</u></b-card-text>
          </colxx>
        </b-row>
      </template>
    </b-card>
  </section>
</template>

<script>
import {BTooltip} from "bootstrap-vue";
import Colxx from "@/components/Common/Colxx";
import axios from "axios";
import Vue from "vue";
import _ from "lodash";

Object.defineProperty(Vue.prototype, '$_', {value: _})
export default {
  name: 'invoice',
  components: {
    'colxx': Colxx,
    'b-tooltip': BTooltip
  },
  props: ['order'],
  data() {
    return {
      output: null,
      products: this.order.order_details,
      branch: {},
      fields: [
        {
          key: `item.locales`,
          label: "المنتج",
          class: 'align-middle text-muted',
        },
        {
          key: `order_details_customization`,
          label: 'الإضافات',
          class: 'w-15 align-middle text-muted',
          formatter: (value, key, item) => {
            if (Array.isArray(value) && value.length > 0) {
              let list = value.map(x => ((((x || {}).customization || {}).locales || {})['ar'] || {}).title || '-')
              return list.toString().replace(",", "\n")
            } else {
              return '-'
            }
          },
        },
        {
          key: 'qty',
          label: 'الكمية',
          class: 'align-middle text-muted'
        },
        {
          key: "batch_price",
          label: 'سعر المفرد',
          class: 'align-middle text-muted',
        },
        // {
        //   key: "discount_percentage",
        //   label: 'الخصم',
        //   class: 'align-middle text-muted',
        //   formatter: (value, key, item) => {
        //     return `%${value * 100}`
        //   }
        // },
        {
          key: "total",
          label: 'المجموع',
          class: 'align-middle text-muted text-nowrap',
          // formatter: (value, key, item) => {
          //   return this.$t('tables.sar') + ' ' + value
          // },
        },
      ],
    }
  },
  methods: {
    formatDateTime(date) {
      if (isNaN(Date.parse(date.replace(/-/g, '/')))) {
        return null
      }
      let options = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
      let today = new Date(date.replace(/-/g, '/'));
      return today.toLocaleDateString('ar-EG', options)
    },
    printInvoice() {
      // Get HTML to print from element
      const prtHtml = document.getElementById('invoice').innerHTML;

// Get all stylesheets HTML
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }

// Open the print window
      const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

      WinPrint.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
  </head>
  <body>
    ${prtHtml}
  </body>
</html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
          console.log('DOM is ready.')
          return true
        }
        return false
      };
      if (WinPrint.document.onreadystatechange) {
        WinPrint.print();
        window.onfocus = function () {
          window.close();
        }
      }

    }
  },
  mounted() {
    axios.get('branches/' + this.order.branch_id).then(res => this.branch = res.data.data)
  }
}
</script>
<style src="./invoice.css" scoped/>
