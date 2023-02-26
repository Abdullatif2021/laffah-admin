<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb
          :heading="coupon_id ? 'Edit Coupon' : 'Create Coupon'"
        />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 auction_card" title="Type">
          <b-form>
            <b-row>
              <b-colxx class="flex" sm="12">
                <b-form-group label="Coupon Type" class="error-l-150">
                  <b-form-checkbox-group v-model.trim="$v.couponType.$model">
                    <b-form-checkbox value="percent"
                      >Percentage</b-form-checkbox
                    >
                    <b-form-checkbox value="fixprice">Discount</b-form-checkbox>
                  </b-form-checkbox-group>
                  <b-form-invalid-feedback
                    class="d-block"
                    v-if="!$v.couponType.required && $v.couponType.$dirty"
                    >Please select Type!</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group class="form-group-label" label="Type Value">
                  <b-input-group
                    class="mb-3"
                    :append="couponType == 'fixprice' ? '$' : '%'"
                  >
                    <b-form-input
                      type="number"
                      v-model.trim="$v.discount.$model"
                      :state="!$v.discount.$error"
                    />
                    <b-form-invalid-feedback
                      >Please enter the value!</b-form-invalid-feedback
                    >
                  </b-input-group>
                </b-form-group>
              </b-colxx>

              <b-colxx v-if="couponType == 'percent'" sm="6">
                <b-form-group class="form-group-label" label="Max Discount">
                  <b-form-input
                    type="number"
                    v-model.trim="$v.max_discount.$model"
                  />
                </b-form-group>
              </b-colxx>
            </b-row> </b-form
        ></b-card>
        <b-card class="mb-4 auction_card" title="Date">
          <b-form>
            <b-row>
              <b-colxx sm="6">
                <b-form-group class="form-group-label" label="Start Date">
                  <datepicker
                    style="width: 100%"
                    type="datetime"
                    :disabled-date="disableDate"
                    value-type="YYYY-MM-DD HH:mm:ss"
                    v-model="$v.start_date.$model"
                    @change="selectedDate('start')"
                  ></datepicker>

                  <div
                    :class="{
                      'invalid-feedback': true,
                      'd-block':
                        $v.start_date.$error && !$v.start_date.required,
                    }"
                  >
                    Start Date is required
                  </div>
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group class="form-group-label" label="Expired Date">
                  <datepicker
                    style="width: 100%"
                    type="datetime"
                    :disabled-date="disableDate"
                    value-type="YYYY-MM-DD HH:mm:ss"
                    v-model="$v.end_date.$model"
                    @change="selectedDate('end')"
                  >
                  </datepicker>
                  <div
                    :class="{
                      'invalid-feedback': true,
                      'd-block': $v.end_date.$error && !$v.end_date.required,
                    }"
                  >
                    End Date is required
                  </div>
                </b-form-group>
              </b-colxx>
            </b-row>
          </b-form>
        </b-card>
        <b-card class="mb-4 auction_card" title="Usage">
          <b-form>
            <b-row>
              <b-colxx sm="12">
                <b-form-group class="form-group-label" label="Usages Left">
                  <b-form-input
                    type="number"
                    v-model.trim="$v.usages_left.$model"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx sm="12">
                <b-form-group class="form-group-label" label="User">
                  <v-select
                    label="name"
                    :filterable="false"
                    :options="vueSelectOptions"
                    @search="fetchOptions"
                    v-model="user"
                  >
                    <template slot="no-options"
                      >type to search users List..</template
                    >

                    <template slot="selected-option" slot-scope="option">
                      <div class="selected d-center">
                        {{ option.name }}
                      </div>
                    </template>
                    <template slot="spinner" slot-scope="spinner">
                      <div
                        class="spinner-border text-primary"
                        v-show="spinner"
                      ></div>
                    </template>
                  </v-select>
                </b-form-group>
              </b-colxx>
            </b-row>
          </b-form>
        </b-card>
        <b-card class="mb-4 auction_card">
          <b-card-body class="justify-content-center d-flex">
            <b-button
              @click="onValitadeFormSubmit"
              type="submit"
              variant="primary"
              class="mt-4"
              >{{ $t("forms.submit") }}</b-button
            >
          </b-card-body>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { mapActions, mapGetters } from "vuex";
import Axios from "axios";
import { adminRoot } from "../../../constants/config";

const { required } = require("vuelidate/lib/validators");
export default {
  components: {
    datepicker: DatePicker,
    "v-select": vSelect,
  },
  data() {
    return {
      selectOptions: [
        "",
        "Option1",
        "Option2",
        "Option3",
        "Option4",
        "Option5",
      ],
      vueSelectOptions: [],
      vueSelectForm: {
        single: "",
        multiple: [],
      },
      user: null,
      users_array: null,
      selectData: [
        "Chocolate",
        "Vanilla",
        "Strawberry",
        "Caramel",
        "Cookies and Cream",
        "Peppermint",
      ],
      name: "",
      endDateSelected: false,
      startDateSelected: false,
      enablevalidateForm1: false,
      discount: "",
      select: "",
      selected_user: "",
      start_date: null,
      end_date: null,
      coupon_id: null,
      max_discount: null,
      detail: "",
      customRadio: "",
      usages_left: "",
      couponType: "percent",
    };
  },
  mixins: [validationMixin],
  validations: {
    name: {
      required,
    },
    discount: {
      required,
    },
    select: {
      required,
    },
    detail: {
      required,
    },
    customRadio: {
      required,
    },
    max_discount: {},
    usages_left: {},
    couponType: {
      required,
    },
    end_date: {
      required,
    },
    start_date: {
      required,
    },
  },
  created() {
    this.getUserList();
    this.coupon_id = this.$route.query.id;
    console.log(this.coupon_id);
  },
  methods: {
    ...mapActions(["getUserList", "createCoupon"]),
    onValitadeFormSubmit() {
      console.log(this.user?.id);
      this.$v.$touch();
      this.date_check();
      console.log(this.start_date, this.end_date);
      if (this.enablevalidateForm1) {
        console.log(this.start_date, this.end_date);
        this.createCoupon({
          discount: this.discount,
          max_discount: this.max_discount,
          user_id: this.user?.id,
          usages_left: this.usages_left,
          type: this.couponType,
          expire_date: this.end_date,
          start_date: this.start_date,
        });
      }
    },

    date_check() {
      this.date1 = new Date(this.start_date);
      this.date2 = new Date(this.end_date);

      if (this.date2.getTime() < this.date1.getTime()) {
        this.start_date = null;
        this.end_date = null;

        this.$notify(
          "error",
          "Something went wrong",
          "the end date must be a date after start date.",
          { duration: 4000, permanent: false }
        );
      } else {
        this.enablevalidateForm1 = true;
      }
    },
    disableDate(date) {
      return date < new Date();
    },
    selectedDate(data) {
      switch (data) {
        case "start":
          this.startDateSelected = true;
          break;
        case "end":
          this.endDateSelected = true;
          break;
        default:
          break;
      }
    },
    fetchOptions(search, loading) {
      loading(true);
      setTimeout(() => {
        return Axios.get(
          `https://api-v2.laffahrestaurants.com/public/api/users?role=user&keyword=${search}`
        ).then((res) => {
          console.log(res);
          this.vueSelectOptions = res.data.data.map((x) => {
            return { name: `${x.first_name} ${x.last_name}`, id: x.id };
          });

          loading(false);
        });
      }, 1000);
    },
  },
  computed: {
    ...mapGetters(["_users", "_createCoupon"]),
  },
  watch: {
    couponType: function (val) {
      console.log(val);
    },
    _createCoupon: function (val) {
      this.$router.push(`${adminRoot}/coupon`);
      this.$notify("success", "Coupon has been Created Successfully", "", {
        duration: 4000,
        permanent: false,
      });
    },
    _users: function (val) {
      //   this.users_array = val.map((el) => {
      //     name : `${el.first_name} ${el.last_name}`,
      //     id :
      //     ;
      //   });
      //   console.log(this.users_array);
    },
    couponType: function (val) {
      this.discount = "";
    },
  },
};
</script>
<style scoped>
.auction_card {
  border-radius: 24px;
  background: linear-gradient(
    109.6deg,
    rgb(255, 255, 255) 30.1%,
    rgb(243, 244, 248) 100.2%
  );
  /* // box-shadow: 3px 3px rgb(79, 78, 78), 3px 3px rgb(84, 84, 84); */
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
