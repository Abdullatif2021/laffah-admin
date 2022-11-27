<template>
 <div>
  <b-row>
   <b-colxx xxs="12">
    <piaf-breadcrumb :heading="$t('menu.categories')" />
    <div class="separator mb-5"></div>
   </b-colxx>
  </b-row>
  <b-row>
   <b-colxx
    sm="12"
    md="12"
    class="mb-4">
    <CategoryForm
     :apiBase="apiBase"
     :itemid="$route.params.id"></CategoryForm>
   </b-colxx>
  </b-row>
 </div>
</template>

<script>
import CategoryForm from "../../../../containers/category/CategoryForm";
export default {
 name: "create-category",
 components: {
  CategoryForm,
 },
 data() {
  return {
   apiBase: "categories"
  }
 }
}
</script>

<style scoped>

</style>
