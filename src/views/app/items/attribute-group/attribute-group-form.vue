<template>
    <div>
        <b-row>
            <b-colxx xxs="12">
                <piaf-breadcrumb :heading="$t('menu.attribute-group-form')" />
                <div class="separator mb-5"></div>
            </b-colxx>
        </b-row>
        <b-row>
            <b-colxx
                sm="12"
                md="12"
                class="mb-4">
                <AttributeGroupForm
                    :apiBase="apiBase"
                    :itemid="$route.params.id"></AttributeGroupForm>
            </b-colxx>

        </b-row>
    </div>
</template>

<script>
import AttributeGroupForm from "../../../../containers/attribute-group/AttributeGroupForm"
export default {
    name: "attribute-group-form",
    components: {
        AttributeGroupForm
    },
    data() {
        return {
            apiBase: "attributes/groups"
        }
    }

}
</script>

<style scoped>

</style>
