<template>
  <date-time-picker
    :readonly="schema.readonly"
    :disabled="disabled"
    class="flex-grow-1 d-flex justify-content-center"
    v-model.trim="value"
    :clear-button="schema.clearButton"
    :dir="direction"
    :no-toggle-time-picker="true"
    :disabled-dates="schema.disabledDates"
    :format="schema.format?schema.format:'D hh:mm'"
  />
</template>
<script>
import "vue-vanilla-datetime-picker/dist/DateTimePicker.css";
import Vue from "vue";
import {abstractField} from "vue-form-generator";
import {getDirection} from "@/utils";
import DateTimePicker from 'vue-vanilla-datetime-picker';

Vue.component('date-time-picker', DateTimePicker);
export default {
  mixins: [abstractField],
  data() {
    return {
      direction: getDirection().direction
    };
  },
};
</script>
<style scoped>
/deep/ button.datetime-picker__button {
  flex-grow: 1;
}
</style>
