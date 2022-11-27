<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('forms.update-attribute')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>

    <b-row>
      <b-colxx sm="12" md="12" class="mb-4">
        <attribute-update-form></attribute-update-form>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
    import AttributeUpdateForm from "../../../../containers/attributes/AttributeUpdateForm";

    export default {
        name: "update-attribute",

        components: {
            "attribute-update-form": AttributeUpdateForm,
        }
    }
</script>

<style scoped>

</style>
