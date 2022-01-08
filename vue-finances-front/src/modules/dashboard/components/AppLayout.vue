<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />

    <v-container grid-list-md>
      <v-layout>
        <v-flex xs12>
          <slot />
        </v-flex>
      </v-layout>
    </v-container>
    <AppFloatingButton />
  </div>
</template>

<script>
import AppMenu from "./AppMenu.vue";
import AppToolbar from "./AppToolbar.vue";
import AppFloatingButton from "./../modules/finances/components/AppFloatingButton.vue";

export default {
  name: "AppLayout",
  components: {
    AppToolbar,
    AppMenu,
    AppFloatingButton,
  },
  data: () => ({
    drawer: false,
  }),
};
</script>
