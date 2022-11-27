<template>
  <b-card no-body>
    <div :id="'attribute-row'+data.id" class="pl-2 d-flex flex-grow-1 min-width-zero">
      <div
        class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.locales.en.title">{{data.locales.en.title}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.attribute_group">
          {{data.attribute_group.locales.en.name}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.default_value">{{data.default_value}}</p>
        <div class="w-15 w-sm-100">
          <b-badge pill :variant="data.statusColor">{{data.status }}</b-badge>
        </div>
      </div>

      <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
        <a :href="'update-attribute/' + data.id" class="custom-control-icon">
          <i class="simple-icon-pencil"></i>
        </a>
        <a v-on:click="deleteAttribute(data.id)" style="padding: 0" class="custom-control-icon">
          <i class="simple-icon-trash"></i>
        </a>
      </div>
    </div>
  </b-card>
</template>

<script>
    import axios from "axios";
    import {apiUrl} from "../../../constants/config";

    export default {
        name: "DataListAttribute",
        data() {
            return {
                isLoad: false,
                apiBase: apiUrl + "attributes",
            }
        },
        props: ['data', 'selectedItems'],
        methods: {
            toggleItem(event, itemId) {
                this.$emit('toggle-item', event, itemId)
            },
            deleteAttribute(id) {
                if (confirm("Do you really want to delete?")) {
                    axios.delete(this.apiBase + '/' + id)
                        .then(resp => {
                            document.getElementById('attribute-row' + id).remove();
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            },
        }
    }
</script>

<style scoped>

</style>
