<template>
  <div>
    <b-modal
      :no-close-on-backdrop="toggleState"
      :no-close-on-esc="toggleState"
      :cancel-disabled="toggleState"
      :ok-disabled="toggleState"
      :hide-header-close="toggleState"
      :busy="toggleState"
      :id="`status-${data.id}`"
      :ref="`status-${data.id}`"
      :modal-class="`modal-right ${brightness}`"
      size="sm"
      :title-html="`Update Order Status <br> ${data.order_key}`">
      <form @submit.prevent="action(data)">
        <b-form-group
          class="font-weight-bold"
          label="Status Type:">
          <b-form-radio-group
            v-if="statuses"
            stacked
            v-model="data.status">
            <b-form-radio
              required
              v-for="(s, index) in Object.keys(statuses).filter(x=>parseInt(x)<8 && parseInt(x)>parseInt(initStatus)&&![3,4,5].includes(parseInt(x)))"
              :key="index"
              :value="s"
              class="text-lowercase text-capitalize">{{ statuses[s].replace('_', ' ') }}
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group
          v-if="data.status==7"
          label="Rejection Reason"
          label-for="rejection-note"
          invalid-feedback="Rejection Reason is required"
          :state="msgState"
        >
          <b-form-textarea
            id="rejection-note"
            v-model="data.rejection_reason"
            :state="msgState"
            required
          ></b-form-textarea>
        </b-form-group>
        <button :disabled="toggleState" id="submitStatus" type="submit" class="d-none"></button>
      </form>
      <template v-if="toggleState">
        <div class="loading"></div>
      </template>
      <template slot="modal-footer">
        <label class="btn btn-primary" for="submitStatus">{{ $t("update-status") }}</label>
      </template>
    </b-modal>
  </div>

</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  props: ['data', 'action'],
  data() {
    return {
      initStatus: this.data.status,
      toggleState: false,
      brightness: "",
      msgState: null
      //  isLoad: false,
    }
  },
  computed: {
    ...mapGetters({
      statuses: 'orders/getStatuses',
    })
  },
  methods: {
    ...mapActions({
      loadOrderStatuses: 'orders/loadStatuses',
      // loadNoteStatuses: 'note/loadStatuses',
    }),
    hideModal(refname) {
      this.$refs[refname].hide()
    },
  }
}
</script>

<style>
.brightness {
  animation: brightness 0.5s ease-in-out;
  filter: brightness(0.7)
}

@keyframes brightness {
  from {
    filter: brightness(1)
  }

  to {
    filter: brightness(0.7)
  }
}
</style>
