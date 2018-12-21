<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/images/logo.png">
    <Form/>
    <Display/>
  </div>
</template>

<script>
// @ is an alias to /src
import Form from "@/components/Form.vue";
import Display from "@/components/Display.vue";

export default {
  name: "home",
  components: {
    Form,
    Display
  }
};
</script>
