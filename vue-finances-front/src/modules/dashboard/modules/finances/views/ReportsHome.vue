<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth
        class="mt-5 mb-3"
        format="MM-YYYY"
        color="primary"
        :month="month || $route.query.month"
        @month="changeMonth"
      />
    </v-flex>
    <v-flex v-for="chart in charts" :key="chart.title" xs12 sm6 md6 lg6 xl6>
      <v-card>
        <v-card-text>
          <h2 class="font-weight-light mb4">{{ chart.title }}</h2>
          <canvas :ref="chart.refId"></canvas>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Subject } from "rxjs";
import { mergeMap } from "rxjs/operators";
import ToolbarByMonth from "./../components/ToolbarByMonth.vue";
import RecordsService from "./../services/records-service";
import Chart from "chart.js";
import { generateChartConfigs } from "./../../../../../utils";

export default {
  name: "ReportsHome",
  components: { ToolbarByMonth },
  data: () => ({
    chartIncomesExpenses: undefined,
    chartCategoryExpenses: undefined,
    monthSubject$: new Subject(),
    records: [],
    subscriptions: [],
    charts: [
      { title: "Receitas vs Despesas", refId: "chartIncomesExpenses" },
      { title: "Despesas por Categorias", refId: "chartCategoryExpenses" },
    ],
  }),
  computed: {
    ...mapState("finances", ["month"]),
  },
  created() {
    this.setTitle({ title: "Relatórios" });
    this.setRecords();
  },
  destroyed() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  },
  methods: {
    ...mapActions(["setTitle"]),
    ...mapActions("finances", ["setMonth"]),
    changeMonth(month) {
      this.$router
        .push({
          path: this.$route.path,
          query: { month },
        })
        .catch(() => {});
      this.setMonth({ month });
      this.monthSubject$.next(month);
    },
    updateOrCreateChart(chartId, options) {
      if (this[chartId]) {
        this[chartId].data.datasets = options.data.datasets;
        if (options.data.labels) {
          this[chartId].data.labels = options.data.labels;
        }
        this[chartId].update();
        return this[chartId];
      }
      const ref = Array.isArray(this.$refs[chartId])
        ? this.$refs[chartId][0]
        : this.$refs[chartId];
      const ctx = ref.getContext("2d");
      this[chartId] = new Chart(ctx, options);
      return this[chartId];
    },

    setCharts() {
      this.updateOrCreateChart(
        "chartIncomesExpenses",
        generateChartConfigs({
          type: "bar",
          items: this.records,
          keyToGroup: "type",
          keyOfValue: "amount",
          aliases: { DEBIT: "Despesas", CREDIT: "Receitas" },
          backgroundColors: ["#D32F2F", "#2196F3"],
        })
      );

      this.updateOrCreateChart(
        "chartCategoryExpenses",
        generateChartConfigs({
          type: "doughnut",
          items: this.records.filter((r) => r.type === "DEBIT"),
          keyToGroup: "category.description",
          keyOfValue: "amount",
        })
      );
    },

    setRecords() {
      this.subscriptions.push(
        this.monthSubject$
          .pipe(mergeMap((month) => RecordsService.records({ month })))
          .subscribe((records) => {
            this.records = records;
            this.setCharts();
          })
      );
    },
  },
};
</script>
