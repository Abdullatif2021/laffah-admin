<template>
  <div class="rating">
    <span class="points">{{ points ? points.point : coupon.code }}</span>
    <span class="text">{{ points ? "points" : "" }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
    points: {},
    coupon: {},
  },
  data() {
    return {};
  },
  methods: {
    updateValue(value) {
      this.value = value;
    },
  },
};
</script>

<style scoped>
.rating {
  display: inline-block;
}
.points {
  font-size: 23px;
  color: #f7bb07;
  font-weight: bold;
}
.text {
  font-size: 15px;
}
</style>
