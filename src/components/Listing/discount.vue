<template>
  <div class="rating">
    <span class="points">{{ value }}</span> <span class="text">Point</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
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
