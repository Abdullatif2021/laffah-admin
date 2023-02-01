<template>
  <!-- <b-colxx
      md="12"
      class="mb-4">
      <b-card :title="$t('dashboards.sales')">
       <div
        class="dashboard-line-chart"
        v-if="showChart">
        <line-chart
         :data="lineChartData"
         shadow />
       </div>
      </b-card>
     </b-colxx> -->
 <div>
  <b-row>
   <b-colxx xxs="12">
    <piaf-breadcrumb :heading="$t('Laffah restaurants')" />
    <div class="separator mb-5"></div>
   </b-colxx>
  </b-row>
  <b-row>
   <b-colxx
    xl="6"
    lg="12">
    
      <icon-cards-carousel
       :pending="pendengOrders"
       :completed="completedOrders"
       :accepted="acceptedOrders"></icon-cards-carousel>
   
    
     <b-row>
     <b-colxx
      md="12"
      class="mb-4">
      <b-card :title="$t('dashboards.sales')">
       <div
        class="dashboard-line-chart"
        v-if="showChart">
        <line-chart
         :data="lineChartData"
         shadow />
       </div>
      </b-card>
     </b-colxx>
    </b-row>
    <!-- <b-row>
     <b-colxx md="6" class="mb-4">
      
     </b-colxx>
     <b-colxx md="6" class="mb-4">
      <product-categories-doughnut></product-categories-doughnut>
     </b-colxx>
    </b-row> -->
   </b-colxx>
   <b-colxx
    lg="12"
    xl="6"
    class="mb-4"
    v-if="Array.isArray(recentOrders) && recentOrders.length> 0">
    <recent-orders
     :rorders="recentOrders"
     :colorRecent="diffArray"
     v-if="showData"
     :isLoad="isLoad"
     @refreshRecent="fetchRecentOrders()"></recent-orders>
   </b-colxx>
  </b-row>

  <b-row>
   <b-colxx
    xl="7"
    lg="12"
    class="mb-4">
    <best-sellers
     :title="$t('dashboards.best-sellers')"
     :bestData="bestsellers"
     :isLoad="isLoad"></best-sellers>
   </b-colxx>
   <b-colxx
    xl="5"
    lg="12"
    class="mb-4">
    <b-row>
      <b-colxx class="mb-4"><tickets :topSellingItems="topSellingItems"></tickets></b-colxx>
    </b-row>
    <b-row>
      <b-colxx class="mb-4"><product-categories-doughnut :title="`Orders Rating`" :data="doughnut_data"></product-categories-doughnut></b-colxx>
    </b-row>
    <!--        <top-rated-items :topSellingItems="topSellingItems" ></top-rated-items>-->
   </b-colxx>

  </b-row>
  <!--    <b-row>-->
  <!--      <b-colxx
       sm="12"
       md="6"
       class="mb-4">-->
  <!--        <website-visit-chart-card></website-visit-chart-card>-->
  <!--      </b-colxx>-->
  <!--      <b-colxx
       sm="12"
       md="6"
       class="mb-4">-->
  <!--        <converconversion-rates-chart-card></converconversion-rates-chart-card>-->
  <!--      </b-colxx>-->
  <!--    </b-row>-->

 </div>
</template>

<script>
import BestSellers from "@/containers/dashboards/BestSellers";
import IconCardsCarousel from "@/containers/dashboards/IconCardsCarousel";
import RecentOrders from "@/containers/dashboards/RecentOrders";
import SalesChartCard from "@/containers/dashboards/SalesChartCard";
import TopRatedItems from "@/containers/dashboards/TopRatedItems";
import LineChart from "@/components/Charts/Line";
import Tickets from "@/containers/dashboards/Tickets";
import ProductCategoriesDoughnut from "../../../containers/dashboards/ProductCategoriesDoughnut";

//import {lineChartData} from "@/data/charts";
import axios from "axios";
import { ThemeColors } from '@/utils'
import { mapActions } from "vuex";

const colors = ThemeColors()
export default {
 components: {
  "best-sellers": BestSellers,
  "line-chart": LineChart,
  "icon-cards-carousel": IconCardsCarousel,
  "recent-orders": RecentOrders,
  "sales-chart-card": SalesChartCard,
  "top-rated-items": TopRatedItems,
  tickets: Tickets,
  "product-categories-doughnut": ProductCategoriesDoughnut,
 },
 data() {
  return {
   isLoad: true,
   lineChartData: {
    
    labels: [],
    datasets: [{
     label: '',
     borderColor: colors.themeColor1,
     pointBackgroundColor: colors.foregroundColor,
     pointBorderColor: colors.themeColor1,
     pointHoverBackgroundColor: colors.themeColor1,
     pointHoverBorderColor: colors.foregroundColor,
     pointRadius: 6,
     pointBorderWidth: 2,
     pointHoverRadius: 8,
     fill: false
    }]
   },
   pendengOrders: null,
   completedOrders: null,
   acceptedOrders: null,
   orders: null,
   recentOrders: [],
   allStatus: ['pending', 'ready', 'on_the_way'],
   timer: null,
   showChart: false,
   showData: false,
   bestsellers: [],
   topSellingItems: [],
   canvas: null,
   tempArray: [],
   diffArray: [],
   doughnut_data: {
    labels: ['1-2', '3-4', '4-5'],
    datasets: [
      {
        label: '',
        borderColor: [colors.themeColor3, colors.themeColor2, colors.themeColor1],
        backgroundColor: [
          colors.themeColor3_10,
          colors.themeColor2_10,
          colors.themeColor1_10
        ],
        borderWidth: 2,
        data: [],
        pointStyle: 'star',
        usePointStyle: true
      }
    ]
  },
   doughnut_fields: [],

  }
 },
 created() {
  this.fetchRecentOrders();
  this.fetchTopSelling();
  this.fetchOrders();
  this.getRatingInfo();


  // this.timer = setInterval(this.fetchOrders, 300000000)
 },
 methods: {
  ...mapActions({
   loadStatuses: "orders/loadStatuses"
  }),
  getRatingInfo(){
    return axios.get('https://api2.laffahrestaurants.com/api/orders/rating-count').then(res => {
      console.log({res})
      this.doughnut_data.datasets[0]['data'].push(res.data.data.rating_one_tow)
      this.doughnut_data.datasets[0]['data'].push(res.data.data.rating_three_four)
      this.doughnut_data.datasets[0]['data'].push(res.data.data.rating_four_five)
    })
    .catch(error =>{
      console.log(error)
    })
  },
  async fetchTopSelling() {
   const self = this
   await axios
    .get(`items`, {
     params: {
      most_selling: true
     }
    })
    .then(response => {
     console.log(response, 'fetchTopSelling')
     // this.pendengOrders = response.data.data
     self.topSellingItems = response.data.data
    }).catch(error => {
     console.log(error);
    })
  },
  fetchRecentOrders() {
   this.getRecentOrders()
  },
  getRecentOrders() {
   this.isLoad = false
   axios
    .get(`orders`, {
     params: {
      offset: 0,
      limit: 10
     }
    })
    .then(response => {
     this.isLoad = true
     console.log(response.data.data, 'recentOrders')
     let newDataIDS = response.data.data.map(i => i.id)
     let currentDataIDS = [];
     if (localStorage.getItem('recentorders') != undefined) {
      currentDataIDS = localStorage.getItem('recentorders');
     }
     this.diffArray = newDataIDS.filter(x => !currentDataIDS.includes(x));
     // console.log(newDataIDS,this.diffArray,'IDs')
     if (this.diffArray.length > 0) {
      this.$notify("primary", "New Order Added", null, { duration: 5000, permanent: false });
      localStorage.setItem('recentorders', response.data.data.map(i => i.id));
     }
     this.recentOrders = response.data.data
     this.showData = true

     this.timer = setTimeout(() => {
      this.fetchRecentOrders();
     }, 60000);

    }).catch(error => {
     this.isLoad = true

     console.log(error);
    })
  },
  async fetchOrders() {
   const self = this
   await axios
    .get(`orders/order-count`, {
     params: {
      status_id: 1
     }
    })
    .then(response => {
     console.log(response, 'datap')
     this.pendengOrders = response.data.data
    }).catch(error => {
     console.log(error);
    })
   await axios
    .get(`orders/order-count`, {
     params: {
      status_id: 2
     }
    })
    .then(response => {
     console.log(response.data.data, 'datap')
     this.acceptedOrders = response.data.data
    }).catch(error => {
     console.log(error);
    })
   await axios
    .get(`orders/order-count`, {
     params: {
      status_id: 6
     }
    })
    .then(response => {
     console.log(response.data.data, 'datap')
     this.completedOrders = response.data.data
    }).catch(error => {
     console.log(error);
    })

   await axios
    .get(`orders/order-sales`)
    .then(response => {
     console.log(response.data.data, 'result')
     const result = response.data.data

     if (Array.isArray(result)) {
      let unique = result.reduce((acc, x) =>
       acc.concat(acc.find(y => y.created_at === x.created_at) ? [] : [x]), [])
      console.log(unique)
      self.lineChartData.datasets[0].data = unique.map(i => parseFloat(i.total))
      self.lineChartData.labels = unique.map(i => i.created_at)
      self.showChart = true

     }
    })
    .catch(error => {
     console.log(error);
    })
   await axios
    .get(`orders/order-top-users`)
    .then(response => {
     console.log(response.data.data, 'result best')
     const result = response.data.data
     const self = this
     if (Array.isArray(result)) {
      self.bestsellers = result

     }
    })
    .catch(error => {
     console.log(error);
    })

  },
  cancelAutoUpdate() {
   clearInterval(this.timer)
  }

 },
 beforeDestroy() {
  clearTimeout(this.timer);
 },
 mounted() {
  this.loadStatuses()
 }
};
</script>
