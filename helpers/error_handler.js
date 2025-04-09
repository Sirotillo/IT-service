const logger = require("../services/logger");

const errorHandler = (error, res) => {
  logger.log(error);
  console.log(error);
  res.status(400).send({ error: error.message });
};

module.exports = {
  errorHandler,
};
