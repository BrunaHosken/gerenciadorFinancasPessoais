<template>
  <v-app-bar fixed color="primary" app>
    <v-app-bar-nav-icon @click.stop="$emit('hide', !show)"></v-app-bar-nav-icon>
    <v-toolbar-title>Dashboard</v-toolbar-title>
  </v-app-bar>
</template>
<script>
export default {
  name: "AppToolbar",
  props: {
    show: Boolean,
  },
  model: {
    prop: "show",
    event: "hide",
  },
};
</script>
