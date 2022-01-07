<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon :class="[recordIconColor(record.type), 'lighten-1 white--text']">
        {{ recordIcon(record.type) }}
      </v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ record.description }}</v-list-item-title>
      <v-list-item-subtitle
        >{{ record.category.description }} |
        {{ record.account.description }}</v-list-item-subtitle
      >
    </v-list-item-content>

    <v-list-item-action>
      <span :class="amountColor(record.amount)">{{
        formatCurrency(record.amount)
      }}</span>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import formatCurrentMixin from "./../../../../../mixins/format-currency";
export default {
  name: "RecordsListItem",
  mixins: [formatCurrentMixin],
  props: {
    record: Object,
  },
  methods: {
    amountColor(amount) {
      return amount < 0
        ? "error--text text--lighten-1"
        : "primary--text text--lighten-1";
    },
    recordIcon(type) {
      return type === "CREDIT" ? "arrow_upward" : "arrow_downward";
    },
    recordIconColor(type) {
      return type === "CREDIT" ? "primary" : "red accent-2";
    },
  },
};
</script>
