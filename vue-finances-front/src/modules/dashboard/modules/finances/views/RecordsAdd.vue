<template>
  <v-container text-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg4>
        <p>Amount</p>
      </v-flex>
      <v-flex xs12 sm6 md8 lg8>
        <p>Formulário</p>
      </v-flex>
      <button @click="teste">teste</button>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";
import { required, decimal, minLength } from "vuelidate/lib/validators";

export default {
  name: "RecordsAdd",
  data() {
    return {
      record: {
        type: this.$route.query.type.toUpperCase(),
        amount: 0,
        date: moment().format("YYYY-MM-DD"),
        accountId: "",
        categoryId: "",
        description: "",
        tags: "",
        notes: "",
      },
    };
  },
  validations: {
    record: {
      type: { required },
      ammount: { required, decimal, different: (value) => value !== 0 },
      date: { required },
      accountId: { required },
      categoryId: { required },
      description: { required, minLength: minLength(6) },
    },
  },
  created() {
    this.changeTitle(this.$route.query.type);
  },
  beforeRouteUpdate(to, from, next) {
    const { type } = to.query;
    this.changeTitle(type);
    this.record.type = type.toUpperCase();
    next();
  },
  methods: {
    ...mapActions(["setTitle"]),
    changeTitle(recordType) {
      let title;
      switch (recordType) {
        case "credit":
          title = "Nova Receita";
          break;
        case "debit":
          title = "Nova Despesa";
          break;
        default:
          title = "Novo Lançamento";
      }
      this.setTitle({ title });
    },
    teste() {
      console.log(this.record);
    },
  },
};
</script>
