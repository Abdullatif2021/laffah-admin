<template>
    <div>
        <b-row>
            <b-colxx xxs="12">
                <piaf-breadcrumb :heading="$t('menu.attachments')" />
                <div class="separator mb-5"></div>
            </b-colxx>
        </b-row>
        <b-row>
            <b-colxx
                sm="12"
                md="12"
                class="mb-4">
                <AttachmentForm
                    :apiBase="apiBase"
                    :itemtype="$route.params.attach_type"
                    :itemid="$route.params.attach_id"
                    :block_id="$route.params.id"></AttachmentForm>
            </b-colxx>

        </b-row>
    </div>
</template>

<script>
import AttachmentForm from "../../../../containers/blocks/AttachmentForm";
export default {
    name: "attachment-form",
    components: {
        AttachmentForm
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
