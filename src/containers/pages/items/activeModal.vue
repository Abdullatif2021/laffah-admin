<template>
  <b-modal
    hide-footer
    id="modalright_branches"
    ref="modalright"
    :title="$t('pages.branches-availability')"
    modal-class="modal-right"
  >
    <b-form
      @submit.prevent="onValidateCategoryFormFormSubmit"
      class="av-tooltip tooltip-label-bottom"
    >
      <b-form-group
        v-if="batches"
        v-for="(city,index) in cities"
        :label="`${city.locales[$i18n.locale].name} >> Branches:`" v-slot="{ ariaDescribedby }">
        <b-form-checkbox-group
          id="checkbox-group"
          v-model="selected"
          :aria-describedby="ariaDescribedby"
          :name="`active-${index}`"
          switches
        >
          <b-form-checkbox
            v-for="(batch,i) in batches.filter(x=>x.branch.city.id===city.id)"
            :value="batch.branch.id"
            :key="batch.branch.id"
            @change="changeActiveState(batch.branch_id)"
            :name="'checkbox'+batch.branch.id"
          >
            {{ batch.branch.locales[$i18n.locale].name }}
          </b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

    </b-form>

  </b-modal>
</template>

<script>
import "vue-select/dist/vue-select.css";
import {BFormGroup} from 'bootstrap-vue'
import {mapGetters} from 'vuex';
import {apiUrl} from "@/constants/config";
import axios from 'axios'
import {decrypt} from '../../../utils';


export default {
  components: {
    "b-from-group": BFormGroup,
  },
  props: ["attributes",],
  data() {
    return {
      visibleState: "visible",
      disableSubmit: false,
      required: null,
      editable: false,
      toggleState: true,
      toggleShadow: "",
      label: `locales.${this.$i18n.locale}.title`,
      selected: [],
    };
  },
  mounted() {
    this.$store.dispatch('fetchCities')
  },
  computed: {
    ...mapGetters({
      cities: 'getCities',
    }),
    ...mapGetters('item', {
      batches: 'getItemBatchBranches',
      item: 'getItem'
    }),
  },
  methods: {
    async changeActiveState(id) {
      let active = 0
      active = this.selected.indexOf(id) > -1 ? 1 : 0
      console.log(active)
      await axios
        .put(`${apiUrl}item_batch_branches/${this.item.id}/${id}/${active}`)
        .then(response => {
          console.log(response.data)
          return response.data
        })
        .catch(error => console.log(error))
    }
  },
  onValidateCategoryFormFormSubmit: function () {
    console.log('form submit')
  },
  hideModal(refname) {
    this.$refs[refname].hide();
  },
  watch: {
    'batches':
      {
        handler: function (batches) {
          this.selected = batches.map((batch, index) => {
            if (batch.active === 1) {
              console.log(batch.active)
              return batch.branch_id
            }
          })
        }
        ,
        deep: true,
        immediate: true
      },
  }
}
;
</script>
