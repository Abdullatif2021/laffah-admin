<template>
  <vue-slider
    ref="sliderSingle"
    v-model="sliderValue"
    :tooltip-dir="['bottom']"
    :min="schema.min"
    :max="schema.max"
    :interval="schema.interval ? schema.interval : 1"
    :step="schema.step ? schema.step : 1"
    :disabled="disabled"
    :direction="direction"
    :marks="schema.marks?schema.marks:undefined"
    :readonly="schema.readonly"
    :enable-cross="false"
  ></vue-slider>
</template>
<script>
import "vue-slider-component/theme/antd.css";
import { abstractField } from "vue-form-generator";
import VueSlider from "vue-slider-component";
import { getDirection } from "../../utils";

export default {
  mixins: [abstractField],
  components: {
    "vue-slider": VueSlider
  },
  data() {
    return {
      rate: this.schema.toRate,
      sliderValue: this.value * 100,
      tooltipDir:
        this.schema.tooltipDir !== undefined
          ? this.schema.tooltipDir
          : "bottom",
      direction: getDirection().direction
    };
  },
  watch: {
    value(val) {
      if (this.rate) {
        this.sliderValue = val * 100;
      } else {
        this.sliderValue = val;
      }
    },
    sliderValue(val) {
      if (this.rate && val > 1) {
        this.value = val / 100;
      } else {
        this.value = val;
      }
    }
  }
};
</script>
<style scoped>
/deep/.vue-slider-rail {
  height: 1px !important;
}
.vue-slider {
  width: 100% !important;
}
/deep/.vue-slider-mark{
  width: 1px !important;
}
</style>
