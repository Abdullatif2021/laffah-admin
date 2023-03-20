<template xmlns="http://www.w3.org/1999/html">
  <div>
    <b-row v-if="order">
      <invoice-modal
        v-show="false"
        :showVat="showVat"
        v-if="order.order_details !== null"
        :order="order"
      />
      <b-colxx xxs="12" md="5">
        <h1 class="text-capitalize font-weight-bold">{{ title }}</h1>
        <piaf-breadcrumb />
        <b-button @click="print(order)" variant="outline-primary"
          ><i class="simple-icon-printer"></i
        ></b-button>
      </b-colxx>
      <b-colxx
        xxs="12"
        md="7"
        class="d-flex justify-content-center align-items-center justify-content-md-between"
      >
        <div>
          {{ $t("forms.branch") }} :
          <b-badge
            class="mx-2"
            v-if="order.hasOwnProperty('branch_id')"
            variant="outline-primary"
            >{{ order.branch_name }}
          </b-badge>
        </div>
        <div>
          {{ $t("pages.due") }}:
          <kbd
            >{{ formatDateTime(order.delivery_time, true) }}
            <span v-if="order.delivery_period"
              >({{ deliveryPeriod(order.delivery_period) }})</span
            ></kbd
          >
        </div>
      </b-colxx>
      <b-colxx xxs="12" md="5">
        <b-card-group columns>
          <b-card
            header-tag="header"
            :title="order.order_key"
            footer-tag="footer"
          >
            <template #header>
              <div class="d-flex justify-content-between">
                <h6 class="mb-0 text-muted">
                  <span class="iconsminds-financial" />
                  {{ $t("pages.payment-details") }}
                </h6>
                <b-button
                  :disabled="parseInt(order.status) === 0"
                  v-if="statuses !== null"
                  size="xs"
                  @click.prevent="updateFormModel(order)"
                  class="d-flex justify-content-between align-items-center"
                >
                  <small
                    >{{
                      ((statuses || {})[initState] || "_").replace("_", " ")
                    }}&nbsp;</small
                  >
                  <b-icon
                    icon="gear-fill"
                    font-scale="1"
                    aria-hidden="true"
                    :animation="loading ? 'spin' : ''"
                  />
                </b-button>
              </div>
            </template>
            <template #footer>
              <h5 class="d-flex justify-content-between">
                Total: <b>{{ $t("pages.aed") }} {{ order.total }}</b>
              </h5>
            </template>
            <b-card-text
              v-if="order.payment_method !== null"
              class="list-item-heading mb-1 text-nowrap d-flex justify-content-between align-items-center"
            >
              {{
                parseInt(order.payment_method) === 1
                  ? "💰 " + $t("pages.cash-on-delivery")
                  : "💳 " + $t("pages.payment-gateway")
              }}
              <div v-if="order.is_pickup !== null">
                <b-badge variant="muted"
                  >{{
                    parseInt(order.is_pickup) === 1
                      ? $t(`pages.pickup`)
                      : $t("pages.delivery")
                  }}
                </b-badge>
              </div>
            </b-card-text>
            <!--            <b-card-text class="mb-1 text-nowrap ">
              <b-form-group
                v-if="order.status==='-1'"
                id="fieldset-1"
                description="Field to handle Request for Quotation"
                label="Reference Number:"
                label-for="input-1"
                valid-feedback="Thank you! submit to Update">
                <b-input-group>
                  <b-form-input
                    id="input-1"
                    type="number"
                    :autofocus="rnEditable"
                    :readonly="!rnEditable"
                    :disabled="!rnEditable"
                    placeholder="Enter Bank Reference Number"
                    v-model="order.payment_reference"/>
                  <b-input-group-append>
                    <b-button variant="outline-primary">
                      <b-icon
                        v-if="!rnIcon"
                        icon="pencil"
                        @click="rnEditable=!rnEditable"/>
                      <b-icon
                        v-else
                        icon="check2"
                        @click="handleRequests"/>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
              Reference Number:<br/>
              {{ order.payment_reference }}
            </b-card-text>-->
            <b-card-text
              v-if="order.qty !== null"
              class="list-item-heading mb-1 truncate d-flex justify-content-between"
              >{{ $t("pages.qty") }}:
              <kbd>#{{ order.qty }}</kbd>
            </b-card-text>
            <br />
            <b-card-text
              v-if="order.subtotal !== null"
              class="list-item-heading mb-1 truncate d-flex justify-content-between"
              >{{ $t("pages.subTotal") }}: <b> {{ order.total_before_vat }}</b>
            </b-card-text>
            <b-card-text
              v-if="order.discount_value !== null"
              class="list-item-heading mb-1 truncate d-flex justify-content-between"
              >{{ $t("pages.discount_value") }}:
              <b> {{ order.discount_value }}</b>
            </b-card-text>
            <b-card-text
              v-if="order.vat_value !== null"
              class="list-item-heading mb-1 truncate d-flex justify-content-between"
              >{{ $t("pages.vat") }}: <b> {{ order.vat_value }}</b>
            </b-card-text>
            <br />
            <b-card-text
              v-if="order.delivery_cost !== null"
              class="list-item-heading mb-1 text-nowrap"
            >
              <b-form-group
                v-if="order.status === '-1'"
                id="delivery-cost"
                description="Field to update the Delivery Cast."
                :label="$t('pages.delivery_cost') + ':'"
                label-for="delivery-cost-input"
                valid-feedback="Thank you! Submit The Change"
              >
                <b-input-group>
                  <b-form-input
                    type="number"
                    id="delivery-cost-input"
                    :autofocus="dcEditable"
                    :readonly="!dcEditable"
                    :disabled="!dcEditable"
                    placeholder="Enter Bank Reference Number"
                    v-model="order.delivery_cost"
                  />
                  <b-input-group-append>
                    <b-button variant="outline-primary">
                      <b-icon
                        v-if="!dcIcon"
                        icon="pencil"
                        @click="dcEditable = !dcEditable"
                      />
                      <b-icon v-else icon="check2" @click="handleRequests" />
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
              <div class="d-flex justify-content-between">
                {{ $t("pages.delivery_cost") }}:
                <b> {{ order.delivery_cost }}</b>
              </div>
              <small class="text-muted font-weight-lighter">{{
                order.salik_fee !== null ? $t("pages.salik") : ""
              }}</small>
            </b-card-text>
          </b-card>
          <!--          payment-->
          <b-card header-tag="header" :title="order.contact_name">
            <template #header>
              <h6 class="mb-0 text-muted">
                <span class="simple-icon-user" /> {{ $t("pages.contact-info") }}
              </h6>
            </template>
            <b-card-text class="text-nowrap">
              ✉ {{ order.contact_email }}
            </b-card-text>
            <b-card-text> 📞 {{ order.contact_phone_number }} </b-card-text>
          </b-card>
          <!--          contact-->
          <b-card
            v-if="!$_.isEmpty((order || {}).address || {})"
            header-tag="header"
          >
            <template #header>
              <h6 class="mb-0 text-muted">
                <strong class="iconsminds-scooter" />
                {{ $t("pages.delivery-address") }}
              </h6>
            </template>
            <b-card-title>
              {{
                (
                  ((((order || {}).address || {}).country || {}).locales || {})[
                    $i18n.locale
                  ] || {}
                ).name || ""
              }},
              <span>
                {{
                  (
                    ((((order || {}).address || {}).city || {}).locales || {})[
                      $i18n.locale
                    ] || {}
                  ).name || ""
                }},
              </span>
              <span v-if="false"> {{ order.address.region }}, </span>
              <span>{{ order.address.street }}, </span>
              <span>{{ order.address.building }}, </span>
              <span>{{ order.address.floor }} </span>
            </b-card-title>
            <b-button
              v-if="
                order.address.latitude !== null &&
                order.address.longitude !== null
              "
              target="_blank"
              :href="`https://www.google.com/maps/place/${order.address.latitude},${order.address.longitude}/${order.address.latitude}@,${order.address.longitude},17z`"
              variant="outline-primary"
              >{{ $t("pages.view-map") }}
            </b-button>
          </b-card>
          <!-- delivery guy -->
          <b-card
            v-if="order.status === 3 || order.status === 2"
            header-tag="header"
            body-class="guy_body_class"
          >
            <template #header>
              <h6 class="mb-0 text-muted">
                <span class="simple-icon-user" /> Delivery Guy
              </h6>
            </template>
            <b-form-group
              :label="
                order.delivery === '' ? 'Choose Delivery' : 'Change Delivery'
              "
            >
              <v-select
                label="fullName"
                @input="searchOption"
                v-model="selectedOption"
                :options="delivery_options"
              />
            </b-form-group>
            <b-button
              @click="updateDeliveryGuy(selectedOption, order)"
              target="_blank"
              variant="outline-primary"
              >Save
            </b-button>
          </b-card>
          <!-- Rating -->
          <b-card
            v-if="order.status === 6"
            header-tag="header"
            body-class="body_class"
          >
            <template #header>
              <h6 class="mb-0 text-muted">
                <span class="simple-icon-star" /> Rating
              </h6>
            </template>
            <rating :value="order.rate ? order.rate.rate : 0"></rating>
          </b-card>
          <!-- Discount -->
          <b-card
            v-if="order.status === 6"
            header-tag="header"
            body-class="body_class"
          >
            <template #header>
              <h6 class="mb-0 text-muted">
                <span class="iconsminds-gift-box" /> Discount
              </h6>
            </template>

            <discount
              :value="order.discount_value ? order.discount_value : 0"
            />
          </b-card>
          <!--          delivery address-->
          <b-card
            v-if="order.promotion && Object.keys(order.promotion).length > 0"
            header-tag="header"
            :title="order.promotion.code"
          >
            <template #header>
              <div class="d-flex justify-content-between">
                <h6 class="mb-0">{{ $t("pages.promotion") }}</h6>
                <b-badge variant="outline-primary">
                  {{ order.promotion.discount_rate * 100 }}%
                </b-badge>
              </div>
            </template>
            <b-card-text
              v-if="order.payment_method !== null"
              class="list-item-heading mb-1 truncate d-flex justify-content-between"
            >
              Used:
              <b>{{ order.promotion.used }}-{{ order.promotion.max_use }}</b>
            </b-card-text>
            <b-card-text
              v-if="order.qty !== null"
              class="list-item-heading mb-1 truncate small text-center"
              >{{ order.promotion.from_date }}
            </b-card-text>
            <b-card-text class="m-0 text-center">{{
              $t("pages.to")
            }}</b-card-text>
            <b-card-text
              v-if="order.subtotal !== null"
              class="list-item-heading mb-1 truncate small text-center"
              >{{ order.promotion.to_date }}
            </b-card-text>
            <b-card-text
              v-if="order.promotion.user_id !== null"
              class="list-item-heading mb-1 truncate"
            >
              <b-icon-person />
              <kbd>{{
                $_.isEmpty(order.promotion.user_id)
                  ? $t("pages.public")
                  : (((order || {}).promotion || {}).user_id || {}).name ||
                    "NaN"
              }}</kbd>
            </b-card-text>
          </b-card>
          <!--          promotion-->
          <b-card
            header-tag="header"
            :title="order.note"
            border-variant="warning"
            bg-variant="warning"
          >
            <template #header>
              <div class="d-flex justify-content-between">
                <h6 class="mb-0">
                  <strong class="iconsminds-quill-3" />{{ $t("pages.note") }}
                </h6>
              </div>
            </template>
          </b-card>
          <b-card
            v-if="!$_.isEmpty(order.refund_requests)"
            header-tag="header"
            :title="$t('pages.refund')"
          >
            <template #header>
              <div class="d-flex justify-content-between">
                <h6 class="mb-0">{{ $t("pages.request") }}</h6>
                <b-badge variant="muted">
                  {{ order.refund_requests.created_at }}
                </b-badge>
              </div>
            </template>
            <b-card-sub-title
              class="list-item-heading mb-1 d-flex justify-content-between"
            >
              {{ order.refund_requests.note }}
            </b-card-sub-title>
            <br />
            <template #footer>
              <b-form-group
                v-if="order.refund_requests.status"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-radio-group
                  id="btn-radios-2"
                  v-model="order.refund_requests.status"
                  :aria-describedby="ariaDescribedby"
                  name="radio-btn-outline"
                  @input="handleStatusRequests"
                  buttons
                >
                  <b-form-radio
                    v-for="option in noteStatusesOptions"
                    :key="option.text"
                    :value="option.value"
                    :button-variant="option.variant"
                  >
                    {{ option.text }}
                  </b-form-radio>
                </b-form-radio-group>
              </b-form-group>
            </template>
          </b-card>
        </b-card-group>
      </b-colxx>
      <b-colxx xxs="12" md="7">
        <b-card :title="`List Of Item`">
          <vue-perfect-scrollbar
            class="scroll dashboard-list-with-thumbs"
            :settings="{ suppressScrollX: true, wheelPropagation: false }"
          >
            <b-table
              striped
              small
              :fields="fields"
              :items="order.order_details"
            >
              <!-- <template #cell(status)="row">
                      <b-badge :class="row.item.status"><b>{{ row.item.status }}</b></b-badge>
                     </template> -->
              <template #cell(item.image)="row">
                <div>
                  <router-link
                    :id="`item-${row.item.item_id}-img`"
                    :to="`/app/items/item-form/${row.item.item_id}`"
                  >
                    <thumbnail-image
                      small
                      rounded
                      :src="row.item.item.image"
                      class-name="h-25"
                      :alt="
                        (
                          ((((row || {}).item || {}).item || {}).locales || {})[
                            $i18n.locale
                          ] || {}
                        ).name || ''
                      "
                    />
                    <b-tooltip
                      :target="`item-${row.item.item_id}-img`"
                      triggers="hover"
                    >
                      Go to item <b>page</b> content!
                    </b-tooltip>
                  </router-link>
                </div>
              </template>
              <template #cell(discount_value)="row">
                <div>
                  <b-link
                    :id="`item-${row.item.item_id}-offer`"
                    @click="row.toggleDetails"
                    class="w-20"
                  >
                    <div
                      class="d-flex align-items-center"
                      @click="isOffer = true"
                    >
                      <b-badge variant="outline-primary"
                        >-
                        {{
                          row.item.discount_value !== null
                            ? row.item.discount_value
                            : 0
                        }}
                      </b-badge>
                      <b-icon-caret-down-fill
                        v-if="row.item._showDetails && isOffer"
                      />
                      <b-icon-caret-right-fill v-else />
                    </div>
                    <b-tooltip
                      :target="`item-${row.item.item_id}-offer`"
                      triggers="hover"
                    >
                      Show item <b>offer</b> details!
                    </b-tooltip>
                  </b-link>
                </div>
              </template>
              <template #cell(order_details_customization)="row">
                <div>
                  <b-link
                    v-if="row.item.order_details_customization.length > 0"
                    :id="`item-${row.item.item_id}-details`"
                    @click="row.toggleDetails"
                    class="w-20 d-flex align-items-center"
                  >
                    <div @click="isOffer = false">
                      {{ row.value }}
                      <b-icon-caret-down-fill
                        v-if="row.item._showDetails && !isOffer"
                      />
                      <b-icon-three-dots v-else />
                    </div>
                    <b-tooltip
                      :target="`item-${row.item.item_id}-details`"
                      triggers="hover"
                    >
                      Show item <b>customization</b> details!
                    </b-tooltip>
                  </b-link>
                  <span
                    v-else
                    class="d-flex justify-content-center list-item-heading"
                    >-</span
                  >
                </div>
              </template>
              <template #cell(item.locales)="row">
                <div>
                  <router-link
                    :id="`item-${row.item.item_id}-name`"
                    :to="`/app/items/item-form/${row.item.item_id}`"
                    class="w-20 text-justify"
                  >
                    {{
                      (
                        ((((row || {}).item || {}).item || {}).locales || {})[
                          $i18n.locale
                        ] || {}
                      ).name || ""
                    }}
                    <b-tooltip
                      :target="`item-${row.item.item_id}-name`"
                      triggers="hover"
                    >
                      Go to item <b>page</b> content!
                    </b-tooltip>
                  </router-link>
                </div>
              </template>
              <template #row-details="row">
                <b-card>
                  <section v-if="isOffer">
                    <b-row align-h="between">
                      <b-card-title>
                        {{
                          (
                            ((((row || {}).item || {}).offer || {}).locales ||
                              {})[$i18n.locale] || {}
                          ).title || "There is No Offer"
                        }}
                      </b-card-title>
                      <b-link :to="`/app/items/offers/${row.item.item_id}`">
                        go to item's offers
                        <b-icon-arrow-right-circle-fill />
                      </b-link>
                    </b-row>
                    <div v-if="row.item.offer.item_id">
                      <b-card-sub-title>
                        {{
                          (
                            ((((row || {}).item || {}).offer || {}).locales ||
                              {})[$i18n.locale] || {}
                          ).description || undefined
                        }}
                      </b-card-sub-title>
                      <b-card-text class="d-flex justify-content-between">
                        {{
                          (((row || {}).item || {}).offer || {}).from_date ||
                          undefined
                        }}<b>></b>
                        {{
                          (((row || {}).item || {}).offer || {}).to_date ||
                          undefined
                        }}

                        <b-badge variant="outline-primary">
                          {{
                            (((row || {}).item || {}).offer || {})
                              .discount_percentage * 100 || undefined
                          }}%
                        </b-badge>
                      </b-card-text>
                    </div>
                  </section>
                  <section v-else>
                    <b-row align-h="between">
                      <b-card-title>
                        {{ $t("pages.customization") }}
                      </b-card-title>
                      <b-link :to="`/app/items/customizations`">
                        {{ $t("pages.go-to-customizations") }}
                        <b-icon-arrow-right-circle-fill />
                      </b-link>
                    </b-row>
                    <div v-if="row.item.order_details_customization.length > 0">
                      <b-card-text
                        class="d-flex justify-content-between"
                        v-for="(e, i) in row.item.order_details_customization"
                      >
                        <b>{{
                          (
                            (((e || {}).customization || {}).locales || {})[
                              $i18n.locale
                            ] || {}
                          ).title || "NaN"
                        }}</b>

                        <b-badge variant="outline-primary">
                          {{ $t("pages.aed") }}
                          {{ (e || {}).added_value || "NaN" }}
                        </b-badge>
                      </b-card-text>
                    </div>
                  </section>
                  <template #footer v-if="!isOffer">
                    <b-row align-h="between" class="mx-2">
                      {{ $t("pages.total") }}:<em
                        >{{ $t("pages.aed") }}
                        {{
                          (
                            ((row || {}).item || {})
                              .order_details_customization || []
                          )
                            .map((x) => (x || {}).added_value || 0)
                            .reduce((a, b) => Number(a) + Number(b), 0)
                        }}</em
                      >
                    </b-row>
                  </template>
                </b-card>
              </template>
            </b-table>

            <!--    <template v-if="Array.isArray(rorders) && rorders.length > 0">-->
            <!--      <recent-order-item-->
            <!--        v-for="(order,index) in rorders"-->
            <!--        :order="order"-->
            <!--        :detail-path="`${adminRoot}/orders/order-details/details/${order.id}`"-->
            <!--        :key="index"-->
            <!--        :styleItem="{background:colorRecent.includes(order.id)?'#ffeded':''}"-->
            <!--      />-->
            <!--    </template>-->
          </vue-perfect-scrollbar>
        </b-card>
      </b-colxx>
    </b-row>

    <div v-else-if="order == null && isLoad"></div>
    <div v-else class="loading"></div>
    <update-status
      :key="initState"
      v-if="order"
      ref="modal"
      :data="order"
      :action="onValidateFormSubmit"
    />
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import _ from "lodash";
import { apiUrl } from "@/constants/config";
import { mapActions, mapGetters } from "vuex";
import ThumbnailImage from "@/components/Cards/ThumbnailImage";
import rating from "../../../components/Listing/rating.vue";
import discount from "../../../components/Listing/discount.vue";
import {
  BIcon,
  BIconArrowRepeat,
  BIconArrowRightCircleFill,
  BIconCaretDownFill,
  BIconCaretRightFill,
  BIconCheck2,
  BIconPencil,
  BIconPerson,
  BIconThreeDots,
  BootstrapVueIcons,
} from "bootstrap-vue";
import { printInvoice } from "@/utils";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// import note from "@/store/modules/note";
// import VueFormGenerator from "vue-form-generator";

Object.defineProperty(Vue.prototype, "$_", { value: _ });
Vue.use(BootstrapVueIcons);
export default {
  name: "OrderDetails",
  components: {
    "invoice-modal": () => import("@/containers/orders/invoice"),
    "update-status": () => import("./UpdateOrderStatus"),
    "thumbnail-image": ThumbnailImage,
    "b-icon": BIcon,
    rating: rating,
    discount: discount,
    "b-icon-pencil": BIconPencil,
    "b-icon-person": BIconPerson,
    "v-select": vSelect,
    "b-icon-check2": BIconCheck2,
    "b-icon-arrow-repeat": BIconArrowRepeat,
    "b-icon-arrow-right-circle-fill": BIconArrowRightCircleFill,
    "b-icon-caret-down-fill": BIconCaretDownFill,
    "b-icon-caret-right-fill": BIconCaretRightFill,
    "b-icon-three-dots": BIconThreeDots,
  },
  data() {
    return {
      isLoad: false,
      loading: false,
      title: this.$t("menu.order-details"),
      initState: null,
      submitDisabled: ((this.order || {}).refund_requests || {}).status !== "0",
      submitting: false,
      orderId: null,
      order: null,
      assigned_delivery: null,
      delivery_options: [],
      selectedOption: null,
      rnEditable: false,
      rnIcon: false,
      dcEditable: false,
      dcIcon: false,
      isOffer: false,
      fields: [
        {
          key: "item.image",
          label: "",
          class: "",
        },
        {
          key: `item.locales`,
          label: this.$t("tables.name"),
          class: "align-middle",
        },
        {
          key: `order_details_customization`,
          label: this.$t("tables.details"),
          class: "w-15 align-middle",
          formatter: (value, key, item) => {
            let list = value.map(
              (x) =>
                (
                  (((x || {}).customization || {}).locales || {})[
                    this.$i18n.locale
                  ] || {}
                ).title || "NaN"
            );
            return list.slice(0, 3).toString().replace(",", "\n");
          },
        },
        {
          key: "qty",
          label: this.$t("tables.qty"),
          class: "align-middle",
        },
        {
          key: "batch_price",
          label: this.$t("tables.price"),
          class: "align-middle",
        },
        {
          key: "vat_value",
          label: this.$t("tables.vat"),
          class: "align-middle",
        },
        // {
        //   key: "discount_value",
        //   label: this.$t('tables.discount'),
        //   class: 'align-middle',
        // },
        {
          key: "total",
          label: this.$t("tables.total"),
          class: "align-middle text-nowrap",
          formatter: (value, key, item) => {
            return this.$t("tables.aed") + " " + value;
          },
        },
        {
          key: "actions",
          label: "",
          class: "align-middlestu",
        },
      ],
    };
  },
  methods: {
    ...mapActions([
      "fetchBranches",
      "getDeliveries",
      "changeDelivery",
      "changeOrderStatus",
      "assignToDelivery",
    ]),
    ...mapActions({
      loadOrderStatuses: "orders/loadStatuses",
      // loadNoteStatuses: 'note/loadStatuses',
    }),
    ...mapActions(["handleSubmit"]),
    print(order) {
      printInvoice(order);
    },
    branchName() {
      if (!_.isEmpty(this.getBranches)) {
        let branch = this.getBranches.find((x) => x.id == this.order.branch_id);
        return branch ? branch.locales[this.$i18n.locale].name : "-";
      }
    },
    onValidateFormSubmit: function (data) {
      let { loading } = this;
      let url = "orders/updatestatus";
      let options = {
        params: {
          _method: "put",
        },
      };
      if (data.id) {
        /*let formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('status', data.status);*/
        this.handleSubmit({
          url: `${url}/${data.id}`,
          obj: data,
          options: options,
        })
          .then((response) => {
            loading = true;
            this.getOrder(data.id);
          })
          .catch((err) => {
            loading = false;
            this.getOrder(data.id);
          });
      }
      this.modalData.title = undefined;
      this.$bvModal.hide("modalright");
    },
    updateDeliveryGuy(val, order) {
      console.log("updateDeliveryGuy", val, order);
      if (order.delivery === "") {
        this.assignToDelivery({ order_id: order.id, user_id: val._id });
      } else {
        this.changeDelivery({ order_id: order.id, user_id: val._id });
      }
    },
    updateFormModel(rawData) {
      let data = rawData;
      this.activateModal = true;
      this.modalData.title = `${data.order_key} Update Status`;
      this.modalData.isNewModel = true;
      this.$bvModal.show(`status-${data.id}`);
    },
    formatDateTime(date) {
      let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      let today = new Date(date.replace(/-/g, "/"));
      return today.toLocaleDateString(
        this.$i18n.locale === "en" ? "en-US" : "ar-EG",
        options
      );
    },
    expandDetails(row, bool) {
      this.isOffer = bool;
      row.toggleDetails;
    },
    handleRequests(event) {
      let { rnEditable, dcEditable, rnIcon, dcIcon, order, orderId } = this;
      let formData = new FormData();
      formData.append("_method", "PUT");
      let url = "";
      if (rnEditable && rnIcon) {
        url = "payments/edit-reference-number";
        formData.append("payment_reference", order.payment_reference);
      }
      if (dcEditable && dcIcon) {
        url = "orders";
        formData.append("delivery_cost ", order.delivery_cost);
      }
      this.handleSubmit({
        url: `${url}/${orderId}`,
        obj: formData,
      }).then((res) => {
        if (rnIcon) {
          rnIcon = !rnIcon;
          rnEditable = !rnIcon;
        }
        if (dcIcon) {
          dcIcon = !dcIcon;
          dcEditable = !dcIcon;
        }
      });
    },
    searchOption(search, loading) {
      console.log("here from search input", search);
      setTimeout(() => {
        this.delivery_options = this.delivery_options.filter((option) =>
          option.name.toLowerCase().includes(search.toLowerCase())
        );
      }, 1000);
    },
    handleStatusRequests(status) {
      let { submitDisabled, order } = this;
      let formData = new FormData();
      formData.append("_method", "PUT");
      let url = "notes";
      formData.append("status", parseInt(status));
      this.handleSubmit({
        url: `${url}/${order.refund_requests.id}`,
        obj: formData,
      }).then((res) => {
        if (res && res.status !== 200) {
          order.refund_requests.status = "0";
        }
        this.submitDisabled = true;
      });
    },
    deliveryPeriod(value) {
      switch (value) {
        case "noon":
          return "🌃 " + this.$t("tables.noon");
        case "evening":
          return "☀ " + this.$t("tables.evening");
        case "morning":
          return "🌅 " + this.$t("tables.morning");
        default:
          return value === null ? this.$t("pages.12hours") : value;
      }
    },
    getOrder(id) {
      axios
        .get(`${apiUrl}orders/${id}`)
        .then((res) => {
          this.order = res.data.data;
          this.initState = this.order.status;
          this.getDeliveries({ branch_id: res.data.data.branch_id });
          this.assigned_delivery = res.data.data.delivery;
        })
        .catch((error) => {
          console.log(error);
          this.isLoad = true;
          if (error.response.data.status == 404) {
            this.$notify("error", "This Order Not Found", null, null, {
              duration: 5000,
              permanent: false,
            });
          } else {
            this.$notify("error", "NetWork Error", null, null, {
              duration: 5000,
              permanent: false,
            });
          }
        });
    },
  },
  computed: {
    showVat() {
      if (parseInt(this.order.vat_value) == 0) {
        this.fields = this.fields.filter((x) => x.key != "vat_value");
        return false;
      } else return true;
    },
    ...mapGetters({
      statuses: "orders/getStatuses",
      // noteStatuses: 'note/getStatuses'
    }),
    ...mapGetters([
      "getBranches",
      "_deliveries",
      "_change",
      "_assigned",
      "not_assigned",
    ]),
    modalData: ({ schema, initData, modalTitle, onValidateFormSubmit }) => {
      return {
        schema: schema,
        title: modalTitle,
        action: onValidateFormSubmit,
        initData: initData,
        isNewModel: false,
      };
    },
    /*schema: function ({statuses, tabIndex}) {
      let values = []
      if (statuses !== null) {
        values = Object.keys(statuses)
          .map((s, i) => ({name: statuses[s], value: String(s)})).filter((x, i) => i < 8)
      }
      let fields = []
      if (tabIndex === 0) {
        fields = [
          {
            type: "input",
            inputType: "number",
            label: "Bank Transfer",
            model: "payment_reference",
            required: true,
            placeholder: "Transaction Reference Number",
            validator: VueFormGenerator.validators.number
          }
        ]
      } else {
        fields = [
          {
            type: "radios",
            label: "Update Status",
            model: "status",
            values: values
          }
        ]
      }
      return {
        fields: fields
      };
    },*/
    noteStatusesOptions({ noteStatuses }) {
      if (noteStatuses !== null) {
        return Object.keys(noteStatuses)
          .filter((x) => x > 0)
          .map((x) => ({
            text: noteStatuses[x],
            value: x,
            variant: x === "1" ? "outline-primary" : "outline-danger",
          }));
      }
      return noteStatuses;
    },
  },
  watch: {
    _assigned: function (val) {
      console.log("_assign", val);
      this.$notify("success", "Delivery has been assigned successfuly", null, {
        duration: 5000,
        permanent: false,
      });
      this.changeOrderStatus({
        order_id: this.order.id,
        status: 3,
      });
      this.$router.push(`/app/orders`);
    },
    not_assigned: function (val) {
      console.log("not_assign", val);
      this.$notify(
        "warning",
        "Delivery didn't assigned, Please try again ",
        null,
        { duration: 5000, permanent: false }
      );
    },
    "$route.params.id": {
      handler: function (id) {
        this.orderId = id;
        this.getOrder(id);
      },
      deep: true,
      immediate: true,
    },
    "order.payment_reference": {
      handler: function (after, before) {
        if (after !== null && before !== null) {
          this.rnIcon = after !== before && this.rnEditable;
        }
      },
      deep: true,
      immediate: true,
    },
    "order.delivery_cost": {
      handler: function (after, before) {
        if (after !== null && before !== null) {
          this.dcIcon = after !== before && this.dcEditable;
        }
      },
      deep: true,
      immediate: true,
    },
    assigned_delivery: function (val) {
      console.log(val);
      setTimeout(() => {
        this.selectedOption = this.delivery_options.find((i) => {
          return (i.id = val.id);
        });
        console.log("this.selectedOption", this.selectedOption);
      }, 2000);
    },
    _deliveries: function (data) {
      console.log("from watcher deliveries", data);
      data.forEach((el) => {
        console.log("ellllllll", el);
        this.delivery_options.push(
          new Object({
            _id: el.id,
            name: el.first_name,
            fullName: `${el.first_name} ${el.last_name}`,
          })
        );
      });
    },
    _change: function (val) {
      this.$notify(
        "success",
        "Delivery Guy has been Updated Successfully",
        null,
        { duration: 5000, permanent: false }
      );
    },
  },
  mounted() {
    this.loadOrderStatuses();
    // this.loadNoteStatuses()
  },
};
</script>

<style scoped>
.full_width {
  width: 100%;
}
.card-columns {
  -webkit-column-count: 2;
  -moz-column-count: 2;
  column-count: 2;
}

.list-thumbnail {
  width: 90px !important;
  height: 90px !important;
}

.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
.body_padding {
  padding: 0.75rem;
}
.body_class {
  background-color: #fff;
  text-align: center;
  padding: 9px;
}
.guy_body_class {
  background: white;
  padding: 10px 6px;
}
</style>
