<template>
  <div>
    <h4>Stats Component</h4>
    <p>There are currently {{ countLinks }} links</p>
    <button v-on:click="removeAllLinks">Remove all links</button>
    <p>{{ msg }}</p>
  </div>
</template>

<style lang="postcss" scoped>
div {
  background-color: lightblue;
}
</style>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "Stats",
  data() {
    return {
      msg: ""
    };
  },
  computed: { ...mapGetters(["countLinks"]) },
  methods: {
    ...mapMutations(["REMOVE_ALL"]),
    ...mapActions(["removeAll"]),
    removeAllLinks() {
      this.removeAll().then(() => {
        this.msg = "They have been removed";
      });
    }
  }
};
</script>
