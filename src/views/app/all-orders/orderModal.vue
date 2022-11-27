<template>
  <b-modal v-if="orderDetails!==null" id="orderrightmodal" ref="orderrightmodal" :title="orderDetails.order_key"
           modal-class="modal-right" hide-footer>
    <div class="modal-details">
      <div class="cards-view">
        <div class="d-flex flex-column justify-content-start align-items-start mb-2 " v-if="orderDetails.is_pickup ==0">
          <h3 class="text-bold">{{ $t('pages.delivery-address') }}</h3>
          <span>Area : {{
              (((((orderDetails || {}).address || {}).area || {}).locales || {})[$i18n.locale] || {}).name || ''
            }}</span>
          <span>Street : {{ ((orderDetails || {}).address || {}).street || '' }}</span>
          <span>building : {{ ((orderDetails || {}).address || {}).building || '' }}</span>
          <span>floor : {{ ((orderDetails || {}).address || {}).floor || '' }}</span>
          <span>phone : {{ ((orderDetails || {}).address || {}).telephone || '' }}</span>
        </div>
        <div v-else class="mb-2">
          <span>{{ $t('pages.branch') }} : {{ orderDetails.branch_name }}</span>
        </div>
        <b-card
          v-for="(data,index) in orderDetails.order_details" :key="data.id"
          class="col-12"
          header-tag="header"
          header-class="p-1"
          no-body
        >
          <template #header>
            <div class="d-flex justify-content-between align-items-center">
              <div class="w-20">
                <thumbnail-image rounded small :src="data.item.image"
                                 :alt="'Order-details-item-'+index + data.item.slug"/>
              </div>
              <div class="mb-0 d-flex flex-column align-items-end red-text">
                {{ data.item.locales[$i18n.locale].name }}
                <div class="text-small text-muted">
                  <span>{{ $t('pages.qty') }}: {{ data.qty }} | </span>
                  <span>{{ $t('pages.price') }}: {{ data.batch_price }} | </span>
                  <span>{{ $t('pages.subTotal') }}: {{ data.subtotal_with_customization }}</span>
                </div>
              </div>
            </div>
          </template>
          <template
            v-if="Array.isArray(data.order_details_customization) && data.order_details_customization.length > 0">
            <div class="py-1 text-muted"
                 v-for="item in data.order_details_customization">
              <div v-if="item.customization!==null" class="d-flex justify-content-between">
                <span>{{ ((((item || {}).customization || {}).locales || {})[$i18n.locale] || {}).title || '' }}</span>
                <span>{{ $t('pages.aed') }} {{ (item || {}).added_value || '' }}</span>
              </div>
            </div>
          </template>
        </b-card>
        <div
          class=" d-flex flex-column flex-lg-row justify-content-between pb-1 pt-3">
          <div class="d-flex align-items-center justify-content-between">
            <span>{{ $t('pages.subTotal') }}: </span>
            <span>{{ orderDetails.subtotal }}</span>
          </div>
          |
          <div class="d-flex align-items-center justify-content-between">
            <span>{{ $t('pages.vat') }}: </span>
            <span>{{ orderDetails.vat_value }}</span>
          </div>
          |
          <div class="d-flex align-items-center justify-content-between">
            <span>{{ $t('pages.total') }}: </span>
            <span>{{ orderDetails.total }}</span>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import ThumbnailImage from "@/components/Cards/ThumbnailImage";

export default {
  name: 'OrderModal',
  components: {ThumbnailImage},
  props: ['orderDetails'],
}
</script>
<style scoped>
.list-thumbnail {
  width: 60px !important;
  height: 60px !important;
}
</style>
