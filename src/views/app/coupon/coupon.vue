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
        <b-row>
          <b-colxx xxs="6">
            <b-card class="mb-4 auction_card" title="TYPE">
              <b-form>
                <b-row>
                  <b-colxx v-if="coupon_id" class="code_container" sm="12">
                    <h3 class="code">{{ code }}</h3>
                  </b-colxx>
                  <b-colxx class="flex" sm="12">
                    <b-form-group label="Coupon Type" class="error-l-150">
                      <b-form-checkbox-group
                        v-model.trim="$v.couponType.$model"
                      >
                        <b-form-checkbox value="percent"
                          >Percentage</b-form-checkbox
                        >
                        <b-form-checkbox value="fixprice"
                          >Discount</b-form-checkbox
                        >
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
          </b-colxx>
          <b-colxx xxs="6">
            <b-card class="mb-4 auction_card" title="DATE">
              <b-form>
                <b-row style="height: 155px">
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
                          'd-block':
                            $v.end_date.$error && !$v.end_date.required,
                        }"
                      >
                        End Date is required
                      </div>
                    </b-form-group>
                  </b-colxx>
                </b-row>
              </b-form>
            </b-card>
          </b-colxx>
        </b-row>
        <b-row>
          <b-colxx xxs="8">
            <b-card class="mb-4 auction_card" title="USAGE">
              <b-form>
                <b-row>
                  <b-colxx sm="12">
                    <b-row>
                      <b-colxx class="flex" sm="12">
                        <b-form-group
                          label="Couponable Type(not required)"
                          class="error-l-150"
                        >
                          <b-form-checkbox-group
                            v-model.trim="$v.couponableType.$model"
                          >
                            <b-form-checkbox value="item">Item</b-form-checkbox>
                            <b-form-checkbox value="category"
                              >Category</b-form-checkbox
                            >
                          </b-form-checkbox-group>
                          <!-- <b-form-invalid-feedback
                            class="d-block"
                            v-if="
                              !$v.couponableType.required &&
                              $v.couponableType.$dirty
                            "
                            >Please select Type!</b-form-invalid-feedback
                          > -->
                        </b-form-group>
                      </b-colxx>

                      <b-colxx sm="12">
                        <b-form-group
                          class="form-group-label"
                          :label="
                            couponableType === 'category'
                              ? 'Choose Category'
                              : 'Choose Item'
                          "
                        >
                          <v-select
                            label="name"
                            :filterable="false"
                            :options="couponableOptions"
                            @search="fetchcouponableOptions"
                            v-model="couponable"
                          >
                            <template slot="no-options">{{
                              couponableType === "category"
                                ? "type to search Category List..y"
                                : "type to search Item List.."
                            }}</template>

                            <template
                              slot="selected-option"
                              slot-scope="option"
                            >
                              <div class="selected d-center">
                                Name:
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
                  </b-colxx>

                  <b-colxx sm="12">
                    <b-form-group class="form-group-label" label="Usages Left">
                      <b-form-input
                        type="number"
                        v-model.trim="$v.usages_left.$model"
                      />
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="12">
                    <b-form-group class="form-group-label" label="Choose user">
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
                            Name: {{ option.first_name }}
                            {{ option.last_name }}, Email: {{ option.email }},
                            phone number: {{ option.phone_number }}
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
          </b-colxx>
          <b-colxx xxs="4">
            <b-card class="mb-4 auction_card" title="USER">
              <template v-if="user">
                <b-form>
                  <b-row>
                    <b-colxx sm="6">
                      <h3
                        style="
                          color: #303030;
                          font-size: 18px;
                          line-height: 1.6;
                          font-weight: 500;
                        "
                      >
                        Full name
                      </h3>
                      <p
                        style="
                          background-color: #f1f1f1;
                          padding: 8px 15px;
                          border-radius: 50px;
                          display: inline-block;
                          margin-bottom: 20px;
                          font-size: 14px;
                          line-height: 1.4;
                          font-family: Courier New, Courier, monospace;
                          margin-top: 0;
                        "
                      >
                        {{ user.first_name }} {{ user.last_name }}
                      </p>
                    </b-colxx>
                    <b-colxx sm="6">
                      <h3
                        style="
                          color: #303030;
                          font-size: 18px;
                          line-height: 1.6;
                          font-weight: 500;
                        "
                      >
                        Phone Number
                      </h3>
                      <p
                        style="
                          background-color: #f1f1f1;
                          padding: 8px 15px;
                          border-radius: 50px;
                          display: inline-block;
                          margin-bottom: 20px;
                          font-size: 14px;
                          line-height: 1.4;
                          font-family: Courier New, Courier, monospace;
                          margin-top: 0;
                        "
                      >
                        {{ user.phone_number }}
                      </p>
                    </b-colxx>
                  </b-row>
                  <b-row>
                    <b-colxx sm="12">
                      <h3
                        style="
                          color: #303030;
                          font-size: 18px;
                          line-height: 1.6;
                          font-weight: 500;
                        "
                      >
                        Email
                      </h3>
                      <p
                        style="
                          background-color: #f1f1f1;
                          padding: 8px 15px;
                          border-radius: 50px;
                          display: inline-block;
                          margin-bottom: 20px;
                          font-size: 14px;
                          line-height: 1.4;
                          font-family: Courier New, Courier, monospace;
                          margin-top: 0;
                        "
                      >
                        {{ user.email }}
                      </p>
                    </b-colxx>
                  </b-row>
                </b-form>
              </template>
              <template v-else>
                <div class="spinner-border text-primary" v-show="spinner"></div>
              </template>
            </b-card>
          </b-colxx>
        </b-row>

        <b-card class="auction_card">
          <b-card-body class="justify-content-center d-flex">
            <b-button
              @click="onValitadeFormSubmit"
              type="submit"
              :disabled="enable_submit"
              variant="primary"
              class=""
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
import category from "../../../store/modules/category";

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
      couponableOptions: [],
      vueSelectForm: {
        single: "",
        multiple: [],
      },
      user: null,
      isActive: false,
      leftText: "Item",
      rightText: "Category",
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
      code: null,
      enablevalidateForm1: false,
      discount: "",
      select: "",
      selected_user: "",
      start_date: null,
      end_date: null,
      coupon_id: null,
      max_discount: null,
      enable_submit: false,
      show_user: true,
      detail: "",
      customRadio: "",
      usages_left: "",
      couponType: "percent",
      couponableType: "item",
      couponable: null,
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
    couponableType: {},
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
    this.coupon_id ? this.getCoupon({ coupon_id: this.$route.query.id }) : "";
  },
  methods: {
    ...mapActions([
      "getUserList",
      "createCoupon",
      "getCoupon",
      "updateCoupon",
      "getCategories",
    ]),
    onValitadeFormSubmit() {
      this.$v.$touch();
      this.date_check();
      if (this.enablevalidateForm1) {
        if (this.coupon_id) {
          if (this.start_date < new Date()) {
            this.$notify(
              "error",
              "You Cannot update this coupon anymore",
              "because it has started working",
              { duration: 4000, permanent: false }
            );
          } else {
            this.updateCoupon({
              coupon_id: this.coupon_id,
              discount: this.discount,
              max_discount: this.max_discount,
              user_id: this.user?.id,
              couponable_type:
                this.couponableType === "item"
                  ? `App\\Models\\Item`
                  : `App\\Models\\Category`,
              couponable_id: this.couponable?.id,
              usages_left: this.usages_left,
              type: this.couponType,
              expire_date: this.end_date,
              start_date: this.start_date,
            });
          }
        } else {
          this.createCoupon({
            discount: this.discount,
            max_discount: this.max_discount,
            user_id: this.user?.id,
            usages_left: this.usages_left,
            type: this.couponType,
            couponable_type:
              this.couponableType === "item"
                ? `App\\Models\\Item`
                : `App\\Models\\Category`,
            couponable_id: this.couponable?.id,
            expire_date: this.end_date,
            start_date: this.start_date,
          });
        }
      }
    },
    toggle() {
      this.isActive = !this.isActive;
      // Perform active action here
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
      const today = new Date();
      today.setHours(0, 0, 0, 0); // set the time to midnight
      return date < today; // return true if the date is earlier than today, false otherwise
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
      console.log("Loading", loading);
      loading(true);
      this.enable_submit = true;
      this.show_user = false;
      setTimeout(() => {
        return Axios.get(
          `https://api-v2.laffahrestaurants.com/public/api/users?role=user&keyword=${search}`
        ).then((res) => {
          console.log(res);
          this.user = res.data.data[0];
          this.enable_submit = false;
          this.vueSelectOptions = res.data.data.map((x) => {
            return {
              name: `${x.first_name} ${x.last_name} `,
              email: x.email,
              phone_number: x.phone_number,
              id: x.id,
            };
          });

          loading(false);
        });
      }, 1000);
    },
    fetchcouponableOptions(search, loading) {
      console.log("Loading", loading);
      loading(true);
      this.enable_submit = true;
      setTimeout(() => {
        if (this.couponableType === "item") {
          return Axios.get(
            `https://api-v2.laffahrestaurants.com/public/api/items?orderBy[]=created_at&orderBy[]=desc&name=${search}`
          ).then((res) => {
            console.log(res);
            this.couponableOptions = [];
            this.enable_submit = false;
            this.couponableOptions = res.data.data.map((x) => {
              return {
                name: x.locales[this.$i18n.locale].name,
                id: x.id,
              };
            });

            loading(false);
          });
        } else {
          return Axios.get(
            `https://api-v2.laffahrestaurants.com/public/api/categories?sort=id&offset=0&limit=4&title=${search}`
          ).then((res) => {
            console.log(res);
            this.couponableOptions = [];
            this.enable_submit = false;
            this.couponableOptions = res.data.data.map((x) => {
              return {
                name: x.locales[this.$i18n.locale].title,

                id: x.id,
              };
            });

            loading(false);
          });
        }
      }, 1000);
    },
  },
  computed: {
    ...mapGetters([
      "_users",
      "_createCoupon",
      "_updateCoupon",
      "_cannotupdate",
      "_coupon",
      "_categories",
    ]),
  },
  watch: {
    couponType: function (val) {
      console.log(val);
    },
    couponableType: function (val) {
      if (val === "category") {
        this.fetchOptions();
        // this.getCategories();
        // this.couponableOptions = _categories.map((x) => {
        //   return {
        //     name: x.locales[this.$i18n.locale].title,
        //     id: x.id,
        //   };
        // });
      }
    },
    _coupon: function (val) {
      // assign start date ........
      const start_date = new Date(val.start_date);
      const start_dateStr = start_date.toISOString().slice(0, 10);
      const start_timeStr = start_date.toISOString().slice(11, 19);
      this.start_date = `${start_dateStr} ${start_timeStr}`;
      // assign end date ........
      const date = new Date(val.expired_at);
      const dateStr = date.toISOString().slice(0, 10);
      const timeStr = date.toISOString().slice(11, 19);
      this.end_date = `${dateStr} ${timeStr}`;
      // rest ..........
      this.discount = val.details.discount;
      console.log(this.discount);
      this.max_discount = val.details.max_discount;
      this.usages_left = val.usages_left;
      this.couponType = val.type;
      this.couponableType = val.couponable_type
        ? val.couponable_type === "App\\Models\\Item"
          ? "item"
          : "category"
        : null;
      this.couponable =
        val.couponable_type === "App\\Models\\Item"
          ? { name: val.item.locales[this.$i18n.locale].name, id: val.item.id }
          : {
              name: val.category.locales[this.$i18n.locale].title,
              id: val.category.id,
            };
      this.code = val.code;
      this.user = val.user;
    },
    _createCoupon: function (val) {
      this.$router.push(`${adminRoot}/coupon`);
      this.$notify("success", "Coupon has been Created Successfully", "", {
        duration: 4000,
        permanent: false,
      });
    },
    _updateCoupon: function (val) {
      this.$router.push(`${adminRoot}/coupon`);
      this.$notify("success", "Coupon has been Updated Successfully", "", {
        duration: 4000,
        permanent: false,
      });
    },
    _cannotupdate: function (val) {
      this.$router.push(`${adminRoot}/coupon`);
      this.$notify(
        "error",
        "You cannot update the coupon ",
        "because it has started working",
        {
          duration: 5000,
          permanent: false,
        }
      );
    },
    _users: function (val) {
      //   this.users_array = val.map((el) => {
      //     name : `${el.first_name} ${el.last_name}`,
      //     id :
      //     ;
      //   });
      //   console.losg(this.users_array);
    },
    user: function (val) {
      console.log(val, "userrrrrrrrrrrrrrrrrrrrrrrrrrr");
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
.switch-toggle {
  position: relative;
  width: 100px;
  height: 30px;
  background-color: #ccc;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.switch-toggle.active {
  background-color: #3f51b5;
}

.left-text,
.right-text {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

.switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 46px;
  max-width: 60%;
  height: 26px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  transition: left 0.2s ease;
}

.switch-knob span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.switch-toggle.active .switch-knob {
  left: 52px;
}

.switch-toggle.active .left-text {
  opacity: 0;
}

.switch-toggle.active .right-text {
  opacity: 1;
}
.code_container {
  position: absolute;
  top: -40px;
  left: 331px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.code {
  background: white;
  padding: 19px;
  border-radius: 34px;
  border: 1px solid #a0a1a4;
}
</style>
