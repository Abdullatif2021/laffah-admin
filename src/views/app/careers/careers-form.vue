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
                <CareerForm
                    :apiBase="apiBase"
                    :itemid="$route.params.id"></CareerForm>
            </b-colxx>

        </b-row>
    </div>
</template>

<script>
import CareerForm from "../../../containers/careers/CareerForm";
export default {
    name: "careers-form",
    components: {
        CareerForm
    },
    data() {
        return {
            apiBase: "careers"
        }
    }

}
</script>

<style scoped>

</style>
