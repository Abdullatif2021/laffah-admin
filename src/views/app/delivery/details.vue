<template>
    <b-row>
      <b-colxx xxs="4">
        <b-card class="mb-4" title="Branches">
          <b-form>
            <template v-if="branches.length > 0"> 
              <b-form-group label-cols="2" horizontal>
                <b-form-checkbox-group
                  stacked
                  switches
                  button-variant="primary"
                  class="mb-3 font-weight-bold "
                  v-model="usersForm.branch"
                  :options="branches"
                  value-field="code"
                  text-field="label">
                </b-form-checkbox-group>            
              </b-form-group>
              <b-button @click="changeBranches" variant="primary" class="mt-4">Save</b-button>
            </template>
            <template v-else>
              <div class="loading"></div>
            </template>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>
  </template>
  <script>
  import { mapGetters, mapActions } from "vuex";
  export default {
    data() {
      return {
        delivery_id: null,
        usersForm: {
            branch: [],
        },
        newBranches: [],
      };
    },
    created(){
        this.getDeliveryData({user_id: this.$route.params.id});
        this.getDeliveryOrders({user_id: this.$route.params.id, status_id: 6})
        this.fetchBranches();
    },
    methods: {
      ...mapActions(['getDeliveryData', 'getDeliveryOrders', 'fetchBranches', 'updateDeliveryBranches']),
      changeBranches(){
        this.updateDeliveryBranches({branches: this.usersForm.branch, user_id: this.delivery_id})
      }
    },

    computed: {
      ...mapGetters(["getBranches", "_delivery", "_updateDeliveryBranches"]),
      branches() {
        try {
          this.newBranches = this.getBranches.map(x => {
            return {
              label: x.locales[this.$i18n.locale].name,
              code: x.id,
            };
          });
          return this.newBranches
        } catch (err) {
          return this.newBranches
        }
      },
    },
    watch: {
        _delivery: function(val){
          this.delivery_id = val.id;
            this.usersForm.branch = val.branches.map(x => {
                return x.branch_id
              });
        },
        _updateDeliveryBranches: function(val){
          this.$notify("success", "Delivery Branches has been Updated Successfully", null, { duration: 5000, permanent: false });
        }
    }
  };
  </script>
  