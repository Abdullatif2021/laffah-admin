<template>
  <b-card @click.prevent="toggleItem($event,data.id)"
          :class="{'d-flex flex-row':true,'active' : selectedItems.includes(data.id)}" no-body>
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
      <div
        class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
        <router-link :to="`?p=${data.id}`" class="w-40 w-sm-100" v-if="data.first_name">
          <p class="list-item-heading mb-0 truncate">{{data.first_name}}</p>
        </router-link>

        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.locales.en.title">{{data.locales.en.title}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.locales.en.description">
          {{data.locales.en.description}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.locales.ar.title">{{data.locales.ar.title}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.locales.ar.description">
          {{data.locales.ar.description}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.type">{{data.type}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.category">{{data.category}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100" v-if="data.date">{{data.date}}</p>
        <div class="w-15 w-sm-100">
          <b-badge pill :variant="data.statusColor">{{data.status }}</b-badge>
        </div>
      </div>
      <div class="custom-control pl-1 align-self-center pr-4">
        <router-link :to="`create-category/${data.id}`">
          <b-icon-pencil
            scale="1.1"
          />
        </router-link>
        <router-link :to="`/app/seo/list/categories/${data.id}`">
          <i class="simple-icon-puzzle"></i>
        </router-link>
      </div>
    </div>
  </b-card>
</template>

<script>
  import {BIconPencil} from "bootstrap-vue"
  import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

  export default {
    components: {
      'b-icon-pencil': BIconPencil,
    },
    props: ['data', 'selectedItems'],
    methods: {
      toggleItem(event, itemId) {
        this.$emit('toggle-item', event, itemId)
        this.$store.commit("category/SET_CurrentCategory", itemId)
      }
    }
  }
</script>
