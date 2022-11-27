<template>
  <b-modal size="lg" id="invoice-modal" title="Invoice">
    <section ref="invoice" id="invoice">
      <b-card dir="rtl" bg-variant="light" body-class="text-center" class="invoice-bg"
              footer-class="bg-transparent border-0" no-body>
        <template #header>
          <b-row class="mx-5 mt-5 justify-content-between">
            <colxx xxs="6" class="">
              <p style="text-align: start;">مؤسسة يوم السمك لبيع اﻷسماك<br>
                س.ت 1010894462<br>
                الجوال 05 58308096<br>
                الهاتف الموحد <span>920008096</span></p>
            </colxx>
            <colxx xxs="6" class="d-flex justify-content-end">
              <span class="logo-single d-block  w-50"></span>
            </colxx>
          </b-row>
        </template>
        <b-card-title class="d-flex flex-column align-items-center justify-content-center text-dark text-center">
          الفاتورة
          <span class="divider"></span>Invoice
        </b-card-title>
        <b-card-sub-title class="d-flex mb-0 mx-5 px-5 justify-content-between">
          <b-card-text class="mb-0">التاريخ</b-card-text>
          <b-card-text class="mb-0">{{ formatDateTime(order.entry_date, true) }}</b-card-text>
          <b-card-text class="mb-0">Date</b-card-text>
        </b-card-sub-title>
        <b-card-sub-title class="d-flex mb-0 mx-5 px-5 justify-content-between">
          <b-card-text class="mb-0">فاتورة رقم.</b-card-text>
          <b-card-text class="mb-0">{{ order.order_key }}</b-card-text>
          <b-card-text dir="ltr" class="mb-0">Invoice No.</b-card-text>
        </b-card-sub-title>
        <b-card-body body-class="pt-3">
          <b-table
            :fields="fields"
            :items="products"
            tbody-tr-class="text-muted"
            class="px-5 justify-self-center"
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
              <span class="text-danger">اﻹجمالي (ر.س)</span>
            </template>
            <template #foot(total)="data">
              <span class="text-danger ">{{ order.total }}</span>
            </template>
          </b-table>
        </b-card-body>
        <template #footer>
          <b-row class="mx-5 align-items-center justify-content-between">
            <colxx xxs="6" class="">
              <p style="text-align: start;">المحاسب<br>Accountant<br></p>
            </colxx>
            <colxx xxs="6" class="d-flex flex-column justify-content-end">
              <p style="text-align: end;">المستلم<br>Receiver</p>
            </colxx>
          </b-row>
          <b-row class="mx-5 mb-5 justify-content-between">
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
    <template #modal-footer>
      <div class="w-100">
        <b-button
          variant="primary"
          @click="printInvoice"
        >
          {{ $t('pages.print') }}
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import {BTooltip} from "bootstrap-vue";
import Colxx from "@/components/Common/Colxx";

export default {
  components: {
    'colxx': Colxx,
    'b-tooltip': BTooltip
  },
  props: ['order'],
  data() {
    return {
      output: null,
      products: this.order.order_details,
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
              let list = value.map(x => ((((x || {}).customization || {}).locales || {})[this.$i18n.locale] || {}).title || '-')
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
        {
          key: "discount_percentage",
          label: 'الخصم',
          class: 'align-middle text-muted',
          formatter: (value, key, item) => {
            return `%${value * 100}`
          }
        },
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
      if(WinPrint.document.onreadystatechange){
        WinPrint.print();
        window.onfocus=function(){ window.close();}
      }

    }
  }
}
</script>
<style src="./invoice.css" scoped/>
