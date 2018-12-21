import Vue from "vue";
import App from "@/App";
import router from "@/router";
import store from "@/store";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

function init() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
};
