<template>
     <vuetable
        ref="batch_vuetable"
        class="table-divided order-with-arrow"
        :api-mode="false"
        childRow="true"
        :reactive-api-url="true"
        :fields="batchBranchFields"
        pagination-path
        @vuetable:row-clicked="rowClicked"
    >
        <template v-slot:child_row="props">
            <div><b>First name:</b> eerrereer</div>
            <div><b>Last name:</b> {{props}}</div>
        </template>
        <template slot="actions" slot-scope="props">
            <b-dropdown id="ddown2" size="xs" html=" " split split-class="p-0" class="" variant="secondary">              
                <template #button-content>
                    <div class="py-0">
                        <b-link id="edit" class="d-flex align-items-center  text-white px-2">
                            <i style="font-size:20px" class='iconsminds-gear-2 d-flex'></i>
                        </b-link>
                    </div>
                </template>
                <b-dropdown-item v-b-modal="`modalright_related`" @click="getAssighedBranch(props.rowData,'related')">
                    <b-icon-link45deg class="h5 m-0" variant="primary" scale="1" />
                    <span class="mx-1">Apply other branches</span>
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item title="Delete Item" class="" v-b-modal="`delete${props.rowData.id}`" scale="1.1">
                    <i class="simple-icon-trash" /> 
                    <span class="mx-1">{{ $t('delete') }}</span>
                </b-dropdown-item>
            </b-dropdown>           
            <b-modal :id="`delete${props.rowData.id}`" ref="modallg" size="sm" hide-header>
                    <h3>{{ $t("are-you-sure-delete") }}</h3>
                    <template slot="modal-footer">
                        <b-button size="xs" variant="danger" @click="$emit('deleteBatch', props.rowData.id)" class="mr-1">{{ $t("delete") }}</b-button>
                        <b-button size="xs" variant="light" @click="hideModal('modallg')">{{ $t("cancel") }}</b-button>
                    </template>
            </b-modal>
            <b-modal
                id="modalright_related"
                ref="modalright_related"
                title="Apply other branches"
                modal-class="modal-right"
            >
                <b-form class="av-tooltip tooltip-label-bottom">    
                    <b-form-group label="Branches">
                        <b-form-checkbox-group 
                            v-model="selected_branches"
                            :options="checkboxOptions"
                            class="mb-3"
                            value-field="item"
                            text-field="name"
                            disabled-field="selected"
                            stacked
                        >
                        </b-form-checkbox-group>
                    </b-form-group>
                </b-form>
                <template slot="modal-footer">
                <b-button variant="outline-secondary" @click="hideModal('modalright_related')">{{
                    $t("survey.cancel")
                }}</b-button>
                <b-button
                    variant="primary"
                    @click="submitBatchList()"
                    class="mr-1"
                    >{{ $t("survey.submit") }}</b-button
                >
                </template>
            </b-modal>
        </template>
    </vuetable>
</template>
<script>
export default {
    props: ['data', ],
    data(){

    },
    created() {

    },
    methods: {
        hideModal(refname) {
            this.$refs[refname].hide();
        },
    }
}
</script>