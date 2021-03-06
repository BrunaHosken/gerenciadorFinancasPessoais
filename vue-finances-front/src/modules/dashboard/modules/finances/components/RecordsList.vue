<template>
  <div>
    <TotalBalance class="mb-2" />
    <ToolbarByMonth
      class="mt-5 mb-3"
      format="MM-YYYY"
      @month="changeMonth"
      :color="toolbarColor"
      :month="month || $route.query.month"
      :showSlot="true"
    >
      <RecordsFilter @filter="filter" />
    </ToolbarByMonth>
    <v-card>
      <v-card-text v-if="mappedRecordsLenght === 0" class="text-center">
        <v-icon size="100" color="grey">assignment</v-icon>
        <p class="font-weight-light subheading grey--text">
          Nenhum lançamento no período
        </p>
      </v-card-text>

      <v-list v-else two-line>
        <template v-for="(records, date, index) in mappedRecords">
          <v-subheader :key="date">{{ date }}</v-subheader>
          <RecordsListItem
            v-for="record in records"
            :key="record.id"
            :record="record"
          />
          <v-divider
            v-if="showDivider(index, mappedRecords)"
            :key="`${date}-${index}`"
          >
          </v-divider>
        </template>
      </v-list>

      <v-footer class="pa-2">
        <v-flex text-right>
          <h3 class="font-weight-light">
            <span>Saldo do mês:</span>
            <strong class="ml-5" :class="amountColor(totalAmount)">
              {{ formatCurrency(totalAmount) }}
            </strong>
          </h3>
        </v-flex>
      </v-footer>
    </v-card>
  </div>
</template>

<script>
import moment from "moment";
import RecordsListItem from "./RecordsListItem.vue";
import ToolbarByMonth from "./ToolbarByMonth.vue";
import RecordsService from "./../services/records-service";
import TotalBalance from "./TotalBalance.vue";
import RecordsFilter from "./RecordsFilter.vue";
import { groupBy } from "./../../../../../utils";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import amountColorMixin from "./../mixins/amount-color";
import { Subject } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { createNamespacedHelpers } from "vuex";

const { mapState, mapActions } = createNamespacedHelpers("finances");

export default {
  name: "RecordsList",
  components: {
    RecordsListItem,
    RecordsFilter,
    ToolbarByMonth,
    TotalBalance,
  },
  mixins: [formatCurrentMixin, amountColorMixin],
  data: () => ({
    records: [],
    filtersSubject$: new Subject(),
    subscriptions: [],
  }),
  computed: {
    ...mapState(["filters", "month"]),
    toolbarColor() {
      return this.totalAmount < 0 ? "red accent-2" : "primary";
    },
    mappedRecords() {
      return groupBy(this.records, "date", (record, dateKey) => {
        return moment(record[dateKey].substr(0, 10)).format("DD/MM/YYYY");
      });
    },
    mappedRecordsLenght() {
      return Object.keys(this.mappedRecords).length;
    },
    totalAmount() {
      return this.records.reduce((sum, record) => sum + record.amount, 0);
    },
  },
  created() {
    this.setRecords();
  },
  destroyed() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  },
  methods: {
    ...mapActions(["setMonth"]),
    showDivider(index, object) {
      return index < Object.keys(object).length - 1;
    },
    changeMonth(month) {
      this.$router
        .push({
          path: this.$route.path,
          query: { month },
        })
        .catch(() => {});
      this.setMonth({ month });
      this.filter();
    },
    filter() {
      this.filtersSubject$.next({ month: this.month, ...this.filters });
    },
    setRecords(month) {
      this.subscriptions.push(
        this.filtersSubject$
          .pipe(mergeMap((variables) => RecordsService.records(variables)))
          .subscribe((records) => (this.records = records))
      );
      RecordsService.records({ month });
    },
  },
};
</script>
