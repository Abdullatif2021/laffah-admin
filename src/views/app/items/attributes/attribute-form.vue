<template>
    <div>
        <b-row>
            <b-colxx xxs="12">
                <piaf-breadcrumb :heading="$t('menu.attribute-form')" />
                <div class="separator mb-5"></div>
            </b-colxx>
        </b-row>
        <b-row>
            <b-colxx
                sm="12"
                md="12"
                class="mb-4">
                <AttributeForm
                    :apiBase="apiBase"
                    :itemid="$route.params.id"></AttributeForm>
            </b-colxx>

        </b-row>
    </div>
</template>

<script>
import AttributeForm from "../../../../containers/attributes/AttributeForm"
export default {
    name: "attribute-form",
    components: {
        AttributeForm
    },
    data() {
        return {
            apiBase: "attributes"
        }
    }

}
</script>

<style scoped>

</style>
