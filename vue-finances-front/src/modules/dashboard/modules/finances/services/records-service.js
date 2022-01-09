import apollo from "./../../../../../plugins/apollo";
import moment from "moment";

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

const records = async (variables) => {
  const response = await apollo.query({
    query: RecordsQuery,
    variables,
  });
  return response.data.records;
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
