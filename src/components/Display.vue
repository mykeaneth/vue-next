<template>
  <div>
    <p>You chose {{ $store.getters.flavor }}</p>
    <h1>{{ title }}</h1>
    <form @submit.prevent="addLink">
      <input type="text" placeholder="Add a Link" v-model="newLink">
    </form>
    <ul>
      <li v-for="(link, index) in links" v-bind:key="index">
        {{ link }}
        <button v-on:click="removeLinks(index)">Remove</button>
      </li>
    </ul>
    <Stats/>
  </div>
</template>

<style lang="postcss" scoped>
div {
  background-color: coral;
}
</style>

<script>
import Stats from "@/components/Stats.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Display",
  data() {
    return {
      newLink: ""
    };
  },
  components: {
    Stats
  },
  computed: { ...mapState(["title", "links"]) },
  methods: {
    ...mapMutations(["ADD_LINK"]),
    ...mapActions(["removeLink"]),
    addLink: function() {
      this.ADD_LINK(this.newLink);
      this.newLink = "";
    },
    removeLinks: function(link) {
      this.removeLink(link);
    }
  }
};
</script>
