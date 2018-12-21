import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: "Hello From Vuex",
    links: ["link1", "link2", "link3"],
    flavor: ""
  },
  mutations: {
    change: (state, flavor) => {
      state.flavor = flavor;
    },
    ADD_LINK: (state, link) => {
      state.links.push(link);
    },
    REMOVE_LINK: (state, link) => {
      state.links.splice(link, 1);
    },
    REMOVE_ALL: state => {
      state.links = [];
    }
  },
  actions: {
    removeLink: (context, link) => {
      context.commit("REMOVE_LINK", link);
    },
    removeAll({
      commit
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit("REMOVE_ALL");
          resolve();
        }, 1500);
      });
    }
  },
  getters: {
    flavor: state => state.flavor,
    countLinks: state => state.links.length
  }
});
