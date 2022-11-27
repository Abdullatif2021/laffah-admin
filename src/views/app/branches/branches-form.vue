<template>
    <div>
        <b-row>
            <b-colxx xxs="12">
                <piaf-breadcrumb :heading="$t('menu.branches')" />
                <div class="separator mb-5"></div>
            </b-colxx>
        </b-row>
        <b-row>
            <b-colxx
                sm="12"
                md="12"
                class="mb-4">
                <BranchesForm
                    :apiBase="apiBase"
                    :itemid="$route.params.id"></BranchesForm>
            </b-colxx>

        </b-row>
    </div>
</template>

<script>
import BranchesForm from "../../../containers/branches/BranchesForm"
export default {
    name: "branches-form",
    components: {
        BranchesForm
    },
    data() {
        return {
            apiBase: "branches"
        }
    }

}
</script>

<style scoped>

</style>
