<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.branches')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx sm="12" md="6" class="mb-4">
        <BranchesForm :itemid="$route.params.id"></BranchesForm>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
  import BranchesForm from "../../../containers/branches/BranchesForm";
  export default {
    name: "branch-form",
    components:{
      BranchesForm
    }

  }
</script>

<style scoped>

</style>
