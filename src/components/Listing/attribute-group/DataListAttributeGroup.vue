<template>
  <b-card no-body>
    <div :id="'row'+data.id" class="pl-2 d-flex flex-grow-1 min-width-zero">
      <div
        class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
        <p class="list-item-heading mb-0 truncate" v-if="data.locales.en.name">{{data.locales.en.name}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.id">{{data.id}}</p>
      </div>

      <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
        <a :href="'update-attribute-group/' + data.id" class="custom-control-icon">
          <i class="simple-icon-pencil"></i>
        </a>
        <a v-on:click="deleteAttributeGroup(data.id)" style="padding: 0" class="custom-control-icon">
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
        name: "DataListAttributeGroup",
        data() {
            return {
                isLoad: false,
                apiBase: apiUrl + "attributes/groups",
            }
        },
        props: ['data'],
        methods: {
            deleteAttributeGroup(id) {
                if (confirm("Do you really want to delete?")) {
                    axios.delete(this.apiBase + '/' + id)
                        .then(resp => {
                            document.getElementById('row' + id).remove();
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
