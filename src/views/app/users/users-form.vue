<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.users')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx sm="12" md="12" class="mb-4">
        <UsersForm
          :apiBase="apiBase"
          :itemid="$route.params.id"
          :user_type="$route.query.type"
        ></UsersForm>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import UsersForm from "../../../containers/users/UsersForm";
export default {
  name: "users-form",
  components: {
    UsersForm,
  },
  data() {
    return {
      apiBase: "users",
    };
  },
  created() {
    console.log(this.$route.params.id);
    console.log(this.$route.query.type);
  },
};
</script>

<style scoped></style>
