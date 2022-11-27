<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.attribute-groups')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <sortable-statictics-row></sortable-statictics-row>
    <b-row>
      <b-colxx sm="12" md="6" class="mb-4">
        <attribute-group-form></attribute-group-form>
      </b-colxx>
      <b-colxx sm="12" md="6" class="mb-4">
        <product-categories-polar-area></product-categories-polar-area>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
    import ProductCategoriesPolarArea from "../../../../containers/dashboards/ProductCategoriesPolarArea";
    import SortableStaticticsRow from "../../../../containers/dashboards/SortableStaticticsRow";
    import AttributeGroupForm from "../../../../containers/attribute-group/AttributeGroupForm";

    export default {
        name: "create-attribute-group",
        components: {
            "attribute-group-form": AttributeGroupForm,
            "sortable-statictics-row": SortableStaticticsRow,
            "product-categories-polar-area": ProductCategoriesPolarArea
        }
    }
</script>

<style scoped>

</style>
