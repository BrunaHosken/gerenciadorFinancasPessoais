<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    :mini-variant="mini"
    absolute
    temporary
  >
    <v-list>
      <v-list-item v-if="mini" @click.stop="mini = !mini">
        <v-list-item-action>
          <v-icon>chevron_right</v-icon>
        </v-list-item-action>
      </v-list-item>

      <v-list-item tag="div">
        <v-list-item-avatar>
          <v-icon>person</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-list class="pt-0" dense>
        <v-divider light></v-divider>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.url"
          :exact="item.exact"
          @click.stop="$emit('input', false)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import AuthService from "./../../auth/services/auth-service";
export default {
  name: "AppMenu",
  props: {
    value: Boolean,
  },
  data: () => ({
    items: [
      { title: "Home", icon: "dashboard", url: "/dashboard", exact: true },
    ],
    mini: false,
    user: {},
  }),
  async created() {
    this.user = await AuthService.user();
  },
};
</script>
