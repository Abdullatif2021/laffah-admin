<template>
  <div class="icon-cards-row">
    <glide-component
      :settings="glideIconsOption"
      id="card-icon">
      <router-link to="../orders/list">
        <icon-card
          :title="$t('dashboards.pending-orders')"
          icon="iconsminds-clock"
          :value="pending"/>
      </router-link>
      <router-link to="../orders/list">
        <icon-card
          :title="$t('dashboards.accepted-orders')"
          icon="iconsminds-arrow-refresh"
          :value="accepted"/>
      </router-link>
      <router-link to="../orders/list">
        <icon-card
          :title="$t('dashboards.completed-orders')"
          icon="iconsminds-basket-coins"
          :value="completed"/>
      </router-link>
    </glide-component>
  </div>
</template>

<script>
import GlideComponent from "../../components/Carousel/GlideComponent";
import IconCard from "../../components/Cards/IconCard";
import router from '../../router';

export default {
  components: {
    "glide-component": GlideComponent,
    "icon-card": IconCard
  },
  props: ["pending", "accepted", "completed"],
  data() {
    return {
      glideIconsOption: {
        gap: 5,
        perView: 4,
        type: "carousel",
        breakpoints: {
          320: {
            perView: 1
          },
          576: {
            perView: 2
          },
          1600: {
            perView: 3
          },
          1800: {
            perView: 4
          }
        },
        hideNav: true
      }
    };
  }
};
</script>
