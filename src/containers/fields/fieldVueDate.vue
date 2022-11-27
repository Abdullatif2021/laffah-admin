<template>
  <date-picker
    :readonly="schema.readonly"
    :disabled="disabled"
    class="flex-grow-1 d-inline-flex"
    :bootstrap-styling="true"
    :disabledDates="schema.disabledDates"
    v-model.trim="value"
    :clear-button="schema.clearButton"
    :dir="direction"
    :format="schema.format?schema.format:'yyyy-MM-dd'"
  />
</template>
<script>
import "vue-slider-component/theme/antd.css";
import {abstractField} from "vue-form-generator";
import VueSlider from "vue-slider-component";
import {getDirection} from "@/utils";
import Datepicker from "vuejs-datepicker";

export default {
  mixins: [abstractField],
  components: {
    "date-picker": Datepicker,
  },
  data() {
    return {
      direction: getDirection().direction
    };
  },
};
</script>
<style scoped>
/deep/ .input-group {
  display: contents;
}
</style>
