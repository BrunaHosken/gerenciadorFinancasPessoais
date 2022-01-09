<template>
  <v-container text-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg3 mr-10>
        <NumericDisplay :color="color" v-model="$v.record.amount.$model" />
      </v-flex>

      <v-flex xs12 sm6 md8 lg8>
        <v-card>
          <v-card-text>
            <v-form>
              <v-dialog
                ref="dateDialog"
                :return-value.sync="record.date"
                v-model="showDateDialog"
                persistent
                lazy
                width="290px"
                fullwidth
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    name="date"
                    label="Vencimento"
                    prepend-icon="event"
                    type="text"
                    readonly
                    :value="formattedDate"
                    v-on="on"
                  ></v-text-field>
                </template>

                <v-date-picker
                  :color="color"
                  locale="pt-br"
                  scrollable
                  v-model="dateDialogValue"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :color="color" @click="cancelDateDialog">
                    Cancelar
                  </v-btn>
                  <v-btn
                    text
                    :color="color"
                    @click="$refs.dateDialog.save(dateDialogValue)"
                  >
                    Ok
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-select
                name="account"
                label="Conta"
                prepend-icon="account_balance"
                :items="accounts"
                item-text="description"
                item-value="id"
                v-model="$v.record.accountId.$model"
              >
                <v-list-item slot="prepend-item" ripple @click="add('account')">
                  <v-list-item-action>
                    <v-icon>add</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Nova Conta</v-list-item-title>
                </v-list-item>
                <v-divider slot="prepend-item" class="mt-2"></v-divider>
              </v-select>

              <v-select
                name="category"
                label="Categoria"
                prepend-icon="class"
                :items="categories"
                item-text="description"
                item-value="id"
                v-model="$v.record.categoryId.$model"
              >
                <v-list-item
                  slot="prepend-item"
                  ripple
                  @click="add('category')"
                >
                  <v-list-item-action>
                    <v-icon>add</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Nova Categoria</v-list-item-title>
                </v-list-item>
                <v-divider slot="prepend-item" class="mt-2"></v-divider>
              </v-select>

              <v-text-field
                name="description"
                label="Descrição"
                prepend-icon="description"
                type="text"
                v-model.trim="$v.record.description.$model"
              ></v-text-field>

              <v-text-field
                v-show="showTagsInput"
                name="tags"
                label="Tags (separadas por vírgula)"
                prepend-icon="label"
                type="text"
                v-model.trim="record.tags"
              ></v-text-field>

              <v-text-field
                v-show="showNotesInput"
                name="notes"
                label="Observação"
                prepend-icon="note"
                type="text"
                v-model.trim="record.notes"
              ></v-text-field>
            </v-form>

            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn icon small class="mr-3" v-on="on">
                  <v-icon
                    :color="color"
                    @click="showTagsInput = !showTagsInput"
                  >
                    label
                  </v-icon>
                </v-btn>
              </template>
              <span> {{ titleTags }} </span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on">
                  <v-icon
                    :color="color"
                    @click="showNotesInput = !showNotesInput"
                  >
                    note
                  </v-icon>
                </v-btn>
              </template>
              <span> {{ titleNotes }} </span>
            </v-tooltip>
          </v-card-text>
        </v-card>

        <v-btn
          color="secondary"
          large
          fab
          class="mt-4 mr-5"
          title="Cancelar"
          @click="$router.push('/dashboard')"
        >
          <v-icon>close</v-icon>
        </v-btn>

        <v-btn
          color="orange darken-3"
          large
          fab
          class="mt-4 mr-5"
          title="Limpar"
          @click="clean"
        >
          <v-icon>auto_delete</v-icon>
        </v-btn>

        <v-btn
          :color="color"
          large
          fab
          class="mt-4"
          title="Cadastrar"
          :disabled="$v.$invalid"
          @click="submit"
        >
          <v-icon>check</v-icon>
        </v-btn>

        <v-dialog
          v-model="showAccountCategoryDialog"
          max-width="350px"
          persistent
        >
          <AccountCategoryAdd
            v-if="showAccountCategoryDialog"
            :entity="entity"
            @close="showAccountCategoryDialog = false"
            @saved="accountCategorySaved"
          />
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";
import { required, decimal, minLength } from "vuelidate/lib/validators";
import AccountsService from "./../services/accounts-service";
import CategoriesService from "./../services/categories-service";
import RecordsService from "./../services/records-service";
import NumericDisplay from "./../components/NumericDisplay.vue";
import AccountCategoryAdd from "./../components/AccountCategoryAdd.vue";
import { Subject } from "rxjs";
import { mergeMap, distinctUntilChanged } from "rxjs/operators";

export default {
  name: "RecordsAdd",
  components: {
    NumericDisplay,
    AccountCategoryAdd,
  },
  data() {
    return {
      accounts: [],
      categories: [],
      dateDialogValue: moment().format("YYYY-MM-DD"),
      entity: "",
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
      showDateDialog: false,
      showNotesInput: false,
      showTagsInput: false,
      showAccountCategoryDialog: false,
      operationSubject$: new Subject(),
    };
  },
  validations: {
    record: {
      type: { required },
      amount: { required, decimal, different: (value) => value !== 0 },
      date: { required },
      accountId: { required },
      categoryId: { required },
      description: { required, minLength: minLength(3) },
    },
  },
  computed: {
    titleTags() {
      return this.showTagsInput ? "Remover tags" : "Adicionar tags";
    },
    titleNotes() {
      return this.showNotesInput
        ? "Remover observação"
        : "Adicionar observação";
    },
    formattedDate() {
      return moment(this.record.date).format("DD/MM/YYYY");
    },
    color() {
      switch (this.record.type) {
        case "CREDIT":
          return "primary";

        case "DEBIT":
          return "red accent-2";

        default:
          return "primary";
      }
    },
  },
  async created() {
    this.changeTitle(this.$route.query.type);
    AccountsService.accounts().subscribe(
      (accounts) => (this.accounts = accounts)
    );
    this.operationSubject$
      .pipe(
        distinctUntilChanged(),
        mergeMap((operation) => CategoriesService.categories({ operation }))
      )
      .subscribe((categories) => (this.categories = categories));
    this.operationSubject$.next(this.$route.query.type);
  },

  async beforeRouteUpdate(to, from, next) {
    const { type } = to.query;
    this.changeTitle(type);
    this.record.type = type.toUpperCase();
    this.record.categoryId = "";
    this.operationSubject$.next(type);
    next();
  },

  methods: {
    ...mapActions(["setTitle"]),
    accountCategorySaved(item) {
      this.showAccountCategoryDialog = false;
      this.record[`${this.entity}Id`] = item.id;
    },
    add(entity) {
      this.showAccountCategoryDialog = true;
      this.entity = entity;
    },
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
    cancelDateDialog() {
      this.showDateDialog = false;
      this.dateDialogValue = this.record.date;
    },
    async submit() {
      try {
        await RecordsService.createRecord(this.record);
        this.$router.push("/dashboard/records");
      } catch (e) {
        console.log(e);
      }
    },
    clean() {
      this.record = {
        type: this.$route.query.type.toUpperCase(),
        amount: 0,
        date: moment().format("YYYY-MM-DD"),
        accountId: "",
        categoryId: "",
        description: "",
        tags: "",
        notes: "",
      };
    },
  },
};
</script>
