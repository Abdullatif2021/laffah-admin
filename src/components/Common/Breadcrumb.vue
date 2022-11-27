<template>
 <span>
  <h1
   class="text-uppercase font-weight-bold color-theme-1"
   v-if="heading && heading.length>0">{{ heading.toString().replaceAll('-',' ') }}</h1>
  <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
   <b-breadcrumb :items="items" />
  </b-nav>
 </span>
</template>

<script>
import { adminRoot } from "../../constants/config";
export default {
 props: ["heading"],
 data() {
  return {
   items: []
  };
 },
 methods: {
  getUrl(path, sub, index) {
   var a = '';
   if (index == 2 && sub == 'additional-info') {
    a = "/" + path.split(sub)[0] + sub + '/list/' + this.$route.params['item_id'];
   } else if (sub == 'seo') {
    a = "/" + path.split(sub)[0] + sub + '/list/' + this.$route.params.slug + '/' + this.$route.params.id
   } else if (index == 1 && this.$route.params.hasOwnProperty('slug')) {
    a = "/" + path.split(sub)[0] + sub + '/' + this.$route.params.slug + '/list'
   } else if (index == 2 && sub == 'attachments') {
    a = "/" + path.split(sub)[0] + sub + '/attachment-list/' + this.$route.params['id'];
   } else {
    a = "/" + path.split(sub)[0] + sub
   }
   return a
  }
 },
 mounted() {
  let path = this.$route.path.substr(1);
  let rawPaths = path.split("/");
  for (var pName in this.$route.params) {
   if (rawPaths.includes(this.$route.params[pName])) {
    rawPaths = rawPaths.filter(x => x !== this.$route.params[pName]);
   }
  }
  console.log("path : " + JSON.stringify(rawPaths))
  console.log("path params : " + JSON.stringify(this.$route.params))

  rawPaths.map((sub, index) => {
   if (path.includes('attachments') && index == 1) {
    return
   } else {
    this.items.push({
     text: "/" + sub !== adminRoot ?
      this.$t("menu." + sub) : this.$t("menu.home"),
     to: this.getUrl(path, sub, index)
    });
   }
  });
  console.log(" items : " + JSON.stringify(this.items))

 }
};
</script>
