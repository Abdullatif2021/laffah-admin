<template>
    <div>
        <b-row>
            <b-colxx xxs="12">
                <piaf-breadcrumb :heading="$t('menu.pages')" />
                <div class="separator mb-5"></div>
            </b-colxx>
        </b-row>
        <b-row>
            <b-colxx
                sm="12"
                md="12"
                class="mb-4">
                <PagesForm
                    :apiBase="apiBase"
                    :itemid="$route.params.id"></PagesForm>
            </b-colxx>

        </b-row>
    </div>
</template>

<script>
import PagesForm from "../../../containers/pages/PagesForm";
export default {
    name: "pages-form",
    components: {
        PagesForm
    },
    data() {
        return {
            apiBase: "pages"
        }
    }

}
</script>

<style scoped>

</style>
