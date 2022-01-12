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

export default {
  name: "ReportsHome",
  components: { ToolbarByMonth },
  data: () => ({
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
    setCharts() {
      const ctx = this.$refs.chartIncomesExpenses[0].getContext("2d");
      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          datasets: [
            {
              data: [500],
              label: "Receitas",
              backgroundColor: ["#2196F3"],
            },
            {
              data: [350],
              label: "Despesas",
              backgroundColor: ["#FF5252"],
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
      console.log(myChart);
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
