import apollo from "./../../../../../plugins/apollo";
import moment from "moment";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import RecordsQuery from "./../graphql/Records.gql";
import RecordsCreateMutation from "./../graphql/RecordsCreate.gql";
import TotalBalanceQuery from "./../graphql/TotalBalance.gql";

const createRecord = async (variables) => {
  const response = await apollo.mutate({
    mutation: RecordsCreateMutation,
    variables,
  });
  return response.data.createRecord;
};

const records = (variables) => {
  const queryRef = apollo.watchQuery({
    query: RecordsQuery,
    variables,
  });
  return from(queryRef).pipe(map((res) => res.data.records));
};

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalBalanceQuery,
    variables: {
      date: moment().format("YYYY-MM-DD"),
    },
  });
  return response.data.totalBalance;
};

export default {
  createRecord,
  records,
  totalBalance,
};
