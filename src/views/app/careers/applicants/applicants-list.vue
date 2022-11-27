<template>
    <div>
        <grid-body
            :fieldsNames="fields"
            :perPage="perPage"
            :search="search"
            :apiBase="apiBase"
            :addRow="addRow"
            :title="title"
            :addNew="addNew"
            :addEdit="addEdit"
            :type="type"
            :addMeta="false"
        ></grid-body>
    </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../../components/Common/VuetablePaginationBootstrap";
import GridBody from "../../../../containers/Grid/GridBody";

export default {
    components: {
        GridBody,
        vuetable: Vuetable,
        "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
        "grid-body": GridBody
    },
    data() {
        return {
            isLoad: false,
            apiBase: 'applications',
            sort: "",
            page: 1,
            perPage: 10,
            search: "",
            from: 0,
            to: 0,
            total: 0,
            lastPage: 0,
            data: [],
            selectedItems: [],
            addRow: "careers-form",
            title: this.$t('menu.applicants'),
            addNew: false,
            addEdit: false,
            type: `?career_id=${this.$route.params.id}`,
            fields: [
                {
                    name: "name",
                    title: "Name",
                    titleClass: "",
                    dataClass: "list-item-heading",
                    width: "10%"
                },

                {
                    name: "email",
                    title: "Email",
                    titleClass: "",
                    dataClass: "list-item-heading",
                    width: "10%"
                },
                {
                    name: "phone",
                    title: "Phone",
                    titleClass: "",
                    dataClass: "list-item-heading",
                    width: "15%"
                },
                // {
                //     name: "status",
                //     title: "Status",
                //     titleClass: "",
                //     dataClass: "list-item-heading",
                //     width: "15%"
                // },
                {
                    name: "__slot:cv",
                    title: "",
                    titleClass: "center aligned text-right",
                    dataClass: "center aligned text-right",
                    width: "20%"
                },
                {
                    name: "__slot:actions",
                    title: "",
                    titleClass: "center aligned text-right",
                    dataClass: "center aligned text-right",
                    width: "20%"
                }
            ]
        };
    },
    methods: {
        changePageSize(perPage) {
            this.perPage = perPage;
            this.$refs.vuetable.refresh();
        },

        searchChange(val) {
            this.search = val;
        },

        selectAll(isToggle) {
            if (this.selectedItems.length >= this.items.length) {
                if (isToggle) this.selectedItems = [];
            } else {
                this.selectedItems = this.items.map(x => x.id);
            }
        },
        keymap(event) {
            switch (event.srcKey) {
                case "select":
                    this.selectAll(false);
                    break;
                case "undo":
                    this.selectedItems = [];
                    break;
            }
        }
    },
};
</script>
