<template>
  <div
    class="d-flex flex-row mb-3"
    :style="styleItem"
    v-if="Object.keys(order).length != 0 && order.constructor === Object">
    <template >
      <div v-if="order.order_details[0] != null && order.order_details[0].item !== null">
        <router-link
          tag="a"
          :to="`order-details/details/${order.id}`"
          class="d-block position-relative recent-link">
          <img :src="order.order_details[0].item.image" :alt="order.title" class="list-thumbnail border-0" />
        <b-badge
            :variant="order.statusColor"
            pill
            class="position-absolute badge-top-right">{{order.status}}</b-badge>
        </router-link>
        <div class="pl-3 pt-2 pr-2 pb-2">
          <router-link
            tag="a"
            :to="detailPath">
            <p
              class="list-item-heading"
              v-if="order.order_details[0].item.locales[$i18n.locale] != undefined">{{ order.order_details[0].item.locales[$i18n.locale].name}}</p>
            <div class="pr-4">
              <p class="text-muted mb-1 text-small">{{ order.description }}</p>
            </div>
            <div class="text-primary text-small font-weight-medium d-none d-sm-block">{{ order.entry_date }}</div>
          </router-link>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
export default {
  props: ['order', 'detailPath', 'styleItem']
}
</script>
