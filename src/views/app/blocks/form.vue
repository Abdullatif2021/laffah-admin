<template>
    <div>
        <b-row>
            <b-colxx xxs="12">
                <piaf-breadcrumb :heading="$route.params.slug" />
                <div class="separator mb-5"></div>
            </b-colxx>
        </b-row>
        <b-row>
            <b-colxx
                sm="12"
                md="12"
                class="mb-4">
                <BlockForm
                    :apiBase="apiBase"
                    :itemid="$route.params.id"
                    :slug="$route.params.slug"></BlockForm>
            </b-colxx>
        </b-row>
    </div>
</template>

<script>
import BlockForm from "../../../containers/blocks/BlockForm";
export default {
    name: "block-form",
    components: {
      BlockForm
    },
    data() {
        return {
            apiBase: "blocks"
        }
    }

}
</script>

<style scoped>

</style>
