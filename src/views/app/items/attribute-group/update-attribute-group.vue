<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.update-attribute-group')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>

    <b-row>
      <b-colxx sm="12" md="12" class="mb-4">
        <attribute-group-update-form></attribute-group-update-form>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
    import AttributeGroupUpdateForm from "../../../../containers/attribute-group/AttributeGroupUpdateForm";

    export default {
        name: "update-attribute-group",

        components: {
            "attribute-group-update-form": AttributeGroupUpdateForm,
        }
    }
</script>

<style scoped>

</style>
