<template>
  <div>
    <ToolbarByMonth
      class="mt-5 mb-3"
      format="MM-YYYY"
      @month="changeMonth"
      :color="toolbarColor"
      :month="$route.query.month"
    />
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
import { groupBy } from "./../../../../../utils";
import formatCurrentMixin from "./../../../../../mixins/format-currency";
import amountColorMixin from "./../mixins/amount-color";

export default {
  name: "RecordsList",
  components: {
    RecordsListItem,
    ToolbarByMonth,
  },
  mixins: [formatCurrentMixin, amountColorMixin],
  data: () => ({
    records: [],
  }),
  computed: {
    toolbarColor() {
      return this.totalAmount < 0 ? "red accent-2" : "primary";
    },
    mappedRecords() {
      return groupBy(this.records, "date", (record, dateKey) => {
        return moment(record[dateKey]).format("DD/MM/YYYY");
      });
    },
    mappedRecordsLenght() {
      return Object.keys(this.mappedRecords).length;
    },
    totalAmount() {
      return this.records.reduce((sum, record) => sum + record.amount, 0);
    },
  },

  methods: {
    showDivider(index, object) {
      return index < Object.keys(object).length - 1;
    },
    changeMonth(month) {
      this.$router
        .push({
          path: this.$route.path,
          query: { month },
        })
        .catch(() => {})
        .finally(this.setRecords(month));
    },
    async setRecords(month) {
      this.records = await RecordsService.records({
        month,
      });
    },
  },
};
</script>
