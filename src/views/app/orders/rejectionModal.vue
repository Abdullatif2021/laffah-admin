<template>
  <b-modal
    id="modal-prevent-closing"
    ref="rejection-modal"
    :title="$t('modal.rejection-reason')"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form ref="form" @submit.stop.prevent="handleReject">
      <b-form-group
        :label="$t('modal.msg')"
        label-for="msg-input"
        :invalid-feedback="$t('modal.reason-required')"
        :state="rejectionState"
      >
        <b-form-textarea
          id="msg-input"
          v-model="rejectionMsg"
          :state="rejectionState"
          @input="()=>$emit('input',rejectionMsg)"
          required
        ></b-form-textarea>
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
export default {
  name: "rejectionModal",
  props: ['orderId', 'changeStatus', 'updateQueue', 'value'],
  data() {
    return {
      rejectionMsg: this.value,
      rejectionState: null,
    }
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.rejectionState = valid
      return valid
    },
    resetModal() {
      console.log(this)
      this.rejectionMsg = ''
      this.rejectionState = null
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleReject()
    },
    handleReject() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // apply change state to get rejection done
      this.changeStatus({id: this.orderId}, 7).then(res => {
          // Hide the modal manually
          if (res.status === 200) {
            this.$refs['rejection-modal'].hide()
            this.updateQueue({id: this.orderId}, true)
          }
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
