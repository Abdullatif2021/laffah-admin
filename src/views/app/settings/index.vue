<template>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb heading="Settings List" />
      <div class="separator mb-5"></div>
    </b-colxx>
    <template v-if="!isLoadSettings">
      <b-colxx xxs="6" v-for="item in settings_list" :key="item.id">
        <b-card
          class="mb-4 auction_card"
          :title="
            item.key == 'OrderCreated'
              ? 'when order created then earns points'
              : item.key
          "
        >
          <b-form>
            <b-row>
              <b-colxx xxs="12">
                <b-form-input
                  @change="process(item.id, item.key, item.value)"
                  v-model="item.value"
                  type="text"
                ></b-form-input>
              </b-colxx>
            </b-row>
          </b-form>
        </b-card>
      </b-colxx>
      <b-colxx xxs="12">
        <b-card v-if="!isLoadSettings" class="mb-4 auction_card">
          <b-form>
            <b-row>
              <b-colxx
                xxs="12"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <!-- <h3>{{ items.length }}</h3> -->
                <b-button
                  :disabled="!items"
                  @click="save()"
                  class="mb-2"
                  size="lg"
                  variant="primary"
                  >Save {{ items.length }} Changes</b-button
                >
              </b-colxx>
            </b-row>
          </b-form>
        </b-card>
      </b-colxx>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
  </b-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      items: [],
      settings_list: null,
    };
  },
  methods: {
    ...mapActions(["getSettings", "updateSettings"]),
    process(id, key, value) {
      this.items.push({
        id: id,
        key: key,
        value: value,
      });
    },
    save() {
      this.items.forEach((item) => {
        this.updateSettings(item);
      });
    },
  },
  created() {
    this.getSettings();
  },
  computed: {
    ...mapGetters(["settings", "isLoadSettings", "updatedSuccessfuly"]),
  },
  watch: {
    settings: function (val) {
      this.settings_list = val.map((el) => {
        return {
          key: el.key == 20 ? "Every 20 points equals: " : el.key,
          value: el.value,
          id: el.id,
        };
      });
      console.log("reerrerereer", this.settings_list);
    },
    updatedSuccessfuly() {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Settings have been updated successfully",
        { duration: 3000, permanent: false }
      );
    },
  },
  destroyed() {},
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
</style>
