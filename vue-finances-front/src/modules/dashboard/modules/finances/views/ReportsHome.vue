<template>
  <h1>Relatorios</h1>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ReportsHome",
  created() {
    this.setTitle({ title: "Relatórios" });
  },
  methods: {
    ...mapActions(["setTitle"]),
  },
};
</script>
