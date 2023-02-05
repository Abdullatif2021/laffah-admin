<template>
  <b-card class="scale">
    <h5 v-if="title" class="card-title">{{ title }} <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span></h5>
    <h5 v-if="!title" class="card-title">{{ $t('dashboards.product-categories') }}</h5>
    <div class="dashboard-donut-chart">
      <doughnut-chart :data="data ? data : doughnutChartData" shadow />
    </div>
  </b-card>
</template>
<script>
import DoughnutChart from "../../components/Charts/Doughnut";
import { doughnutChartData } from "../../data/charts";

export default {
  props: ['title', 'data'],
  components: {
    "doughnut-chart": DoughnutChart
  },
  data() {
    return {
      doughnutChartData
    };
  },
  watch: {
    data: function(val){
      console.log(val)
    }
  }
};
</script>
<style scoped>
.star {
  color: #ffcc00;
  font-size: 22px;
  margin: 4px;
}

</style>