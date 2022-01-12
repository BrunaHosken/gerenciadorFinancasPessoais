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

const generateChartConfigs = (opts) => {
  const { type } = opts;
  return {
    type,
  };
};

export {
  registerVuexModule,
  groupBy,
  currencyFormatter,
  errorHandler,
  formatError,
};
