<template>
  <v-toolbar fixed color="primary">
    <v-app-bar-nav-icon @click.stop="$emit('hide', !show)"></v-app-bar-nav-icon>
    <v-toolbar-title>Dashboard</v-toolbar-title>
  </v-toolbar>
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
