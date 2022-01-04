const formatError = (message) => {
  const messageSpit = message.split(":");
  return messageSpit[messageSpit.length - 1].trim();
};

export { formatError };
