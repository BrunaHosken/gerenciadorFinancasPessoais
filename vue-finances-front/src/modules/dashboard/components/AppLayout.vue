<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />
  </div>
</template>

<script>
import AppMenu from "./AppMenu.vue";
import AppToolbar from "./AppToolbar.vue";
export default {
  name: "AppLayout",
  components: {
    AppToolbar,
    AppMenu,
  },
  data: () => ({
    drawer: false,
  }),
};
</script>
