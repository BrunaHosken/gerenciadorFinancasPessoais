const errorHandler = (err, vm, info) => {
  const jwtErrors = [
    "jwt malformed",
    "jwt expired",
    "jwt not active",
    "invalid token",
  ];
  if (jwtErrors.some((jwtError) => err.message.includes(jwtError))) {
    vm.$router.push({
      path: "/login",
      query: {
        redirect: vm.$route.path,
      },
    });
  }
};

const formatError = (message) => {
  const messageSpit = message.split(":");
  return messageSpit[messageSpit.length - 1].trim();
};

const currencyFormatter = (
  { locale, currency } = { locale: "pt-BR", currency: "BRL" }
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
};

const groupBy = (array, key, makeCurrentKey) => {
  return array.reduce((accumulated, item) => {
    const currentKey = makeCurrentKey(item, key);
    return {
      ...accumulated,
      [currentKey]: [...(accumulated[currentKey] || []), item],
    };
  }, {});
};

const registerVuexModule = (rootStore, moduleName, store) => {
  if (!(moduleName in rootStore._modules.root._children)) {
    rootStore.registerModule(moduleName, store);
  }
};

const idx = (object, keyPath) => {
  const keys = keyPath.split(".");
  return keys.reduce(
    (obj, current) => (obj && obj[current] !== undefined ? obj[current] : null),

    object
  );
};

const generateChartOptions = (type) => {
  const scales = {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  };
  return {
    scales,
  };
};

const generateChartData = ({
  items,
  keyToGroup,
  keyOfValue,
  aliases,
  type,
  backgroundColors,
}) => {
  const grouped = groupBy(items, keyToGroup, idx);
  const response = {};

  for (const key in grouped) {
    response[(aliases && aliases[key]) || key] = grouped[key].reduce(
      (acc, item) => acc + item[keyOfValue],
      0
    );
  }
  const labels = Object.keys(response);

  switch (type) {
    case "bar":
      return {
        datasets: labels.map((label, index) => ({
          label: `${label}: ${currencyFormatter().format(response[label])}`,
          data: [response[label]],
          backgroundColor: backgroundColors[index],
          borderWidth: 0,
        })),
      };
  }
};

const generateChartConfigs = (opts) => {
  const { type } = opts;
  const options = generateChartOptions(type);
  const data = generateChartData(opts);
  return {
    type,
    data,
    options,
  };
};

export {
  registerVuexModule,
  groupBy,
  currencyFormatter,
  errorHandler,
  formatError,
  generateChartConfigs,
};
