'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  PORT: typeof PORT === 'string' ? parseInt(PORT, 10) : PORT,
  NODE_ENV,
};
