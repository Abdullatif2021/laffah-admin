<template>
  <section
    :ref="`invoice-${order.id}`"
    :id="`invoice-${order.id}`"
  >
    <div class="invoice-box">
      <table cellpadding="0" cellspacing="0">
        <tr class="top">
          <td colspan="3">
            <table width="100%">
              <tr>
                <td align="left" class="title">
                  <img src="/assets/logos/logo.png" style="width: 70px; max-width: 150px" width="70"/>
                  <!--                  <span class="logo-single"></span>-->
                </td>

                <td dir="rtl" align="right">
                  سلسلة مطاعم لفاح<br/>
                  فرع {{ (((branch || {}).locales || {}).ar || {}).name || '' }}<br/>
                  الجوال {{ (branch || {}).mobile || '' }}<br/>
                  {{ (((branch || {}).locales || {}).ar || {}).address }}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="3" align="center">
            ...
          </td>
        </tr>
        <tr class="information">
          <td colspan="3" dir="rtl" align="right">
            فاتورة#: {{ order.order_key }}<br/>
            طُلب: {{ formatDateTime(order.entry_date, true) }}<br/>
            تسليم: {{ order.delivery_time }}<br/>
            الزبون: {{ order.contact_name }}<br/>
            الهاتف: {{ order.contact_phone_number }}<br/>
            <span v-if="parseInt(order.is_pickup) !== 1">
            العنوان:
            {{ (((((order || {}).address || {}).country || {}).locales || {})[$i18n.locale] || {}).name || '' }},
            {{
                (((((order || {}).address || {}).city || {}).locales || {})[$i18n.locale] || {}).name || ''
              }},
            {{ ((order || {}).address || {}).region }},
            {{ ((order || {}).address || {}).street }},
            {{ ((order || {}).address || {}).building }}
            {{ ((order || {}).address || {}).floor }}
              </span>
          </td>

        </tr>
        <tr>
          <td colspan="3" align="center">
            ...
          </td>
        </tr>
        <tr class="heading" bgcolor="#d3d3d3">
          <td align="left" colspan="2">طريقة الدفع</td>

          <td align="right">نوع الطلب</td>
        </tr>

        <tr class="details">
          <td colspan="2" align="left">{{
              parseInt(order.payment_method) === 1 ? $t("pages.cash-on-delivery") :
                $t("pages.payment-gateway")
            }}
          </td>

          <td align="right">{{
              parseInt(order.is_pickup) === 1 ? $t(`pages.pickup`) : $t('pages.delivery')
            }}
          </td>
        </tr>
        <tr>
          <td colspan="3" align="center">
            ...
          </td>
        </tr>
        <tr class="heading" bgcolor="#d3d3d3">
          <td colspan="2" align="left">
            <table width="100%">
              <tr>
                <td align="left">السعر</td>
                <td dir="rtl" align="right">
                  العدد
                </td>
              </tr>
            </table>
          </td>

          <td align="right">المنتج</td>
        </tr>

        <tr
          class="item"
          v-for="item in products"
        >
          <!--        <td>{{ item.qty }} X {{ item.batch_price }}</td>-->
          <td colspan="2" align="left">
            <table width="100%">
              <tr>
                <td align="left">{{ (item || {}).total }}</td>
                <td align="right">
                  {{ (item || {}).qty }}
                </td>
              </tr>
            </table>
          </td>

          <td align="right"><big>{{ ((((item || {}).item || {}).locales || {})['ar'] || {}).name || '' }}</big><br/>
            <small
              v-if="Array.isArray(item.order_details_customization)&& !$_.isEmpty(item.order_details_customization)"
              v-for="custom in item.order_details_customization"
            >
              {{ ((((custom || {}).customization || {}).locales || {})['ar'] || {}).title || '-' }}<br/>
            </small>
          </td>
        </tr>

        <tr>
          <td colspan="3" align="center">
            <hr>
          </td>
        </tr>

        <tr class="total">
          <td align="left">{{ (order || {}).delivery_cost }}</td>

          <td dir="rtl" align="center">التوصيل :</td>
          <td></td>
        </tr>

        <tr class="total">
          <td align="left">د.إ {{ (order || {}).total }}</td>

          <td dir="rtl" align="center">الإجمالي :</td>
          <td></td>
        </tr>
      </table>
    </div>
  </section>
</template>
<style src="./invoice.css" scoped/>
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
      date = date ? date.replace(/-/g, '/') : date
      if (isNaN(Date.parse(date))) {
        return null
      }
      let options = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
      let today = new Date(date);
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
