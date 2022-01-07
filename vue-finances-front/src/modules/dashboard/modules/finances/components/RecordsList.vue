<template>
  <v-list two-line>
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
      ></v-divider>
    </template>
  </v-list>
</template>

<script>
import moment from "moment";
import RecordsListItem from "./RecordsListItem.vue";
import RecordsService from "./../services/records-service";
import { groupBy } from "./../../../../../utils";

export default {
  name: "RecordsList",
  components: {
    RecordsListItem,
  },
  data: () => ({
    records: [],
  }),
  computed: {
    mappedRecords() {
      return groupBy(this.records, "date", (record, dateKey) => {
        return moment(record[dateKey]).format("DD/MM/YYYY");
      });
    },
  },
  async created() {
    this.records = await RecordsService.records();
  },
  methods: {
    showDivider(index, object) {
      return index < Object.keys(object).length - 1;
    },
  },
};
</script>
