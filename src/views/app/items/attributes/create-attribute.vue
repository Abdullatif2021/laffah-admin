<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.attributes')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx sm="12" md="6" class="mb-4">
        <attribute-form></attribute-form>
      </b-colxx>

    </b-row>
  </div>
</template>

<script>
    import AttributeForm from "../../../../containers/attributes/AttributeForm";

    export default {
        name: "create-attribute",
        components: {
            "attribute-form": AttributeForm,
        }
    }
</script>

<style scoped>

</style>
