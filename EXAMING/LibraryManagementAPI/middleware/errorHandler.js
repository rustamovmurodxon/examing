const logger = require('../services/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ message: 'Server xatosi', error: err.message });
};

module.exports = errorHandler;