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

export { currencyFormatter, errorHandler, formatError };
