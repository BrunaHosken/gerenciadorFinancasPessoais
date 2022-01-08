<template>
  <v-card :color="color">
    <v-card-title primary-title>
      <div class="text-center ma-auto">
        <p class="subheading">Saldo Atual</p>
        <h1 class="display-2">{{ totalInCurrency }}</h1>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import RecordsService from "./../services/records-service";

export default {
  name: "TotalBalance",
  mixins: [formatCurrentMixin],
  data: () => ({
    total: 0,
  }),
  computed: {
    color() {
      return this.total < 0 ? "red accent-2" : "primary";
    },
    totalInCurrency() {
      return this.formatCurrency(this.total);
    },
  },
  async created() {
    this.total = await RecordsService.totalBalance();
  },
};
</script>
