'use strict';

// Load modules
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const index = require('./routes/index');
const users = require('./routes/users');
const courses = require('./routes/courses');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Create the Express app
const app = express();

// Enable All CORS Requests
app.use(cors());

// Setup json parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Add routes
app.use('/', index)
app.use('/api', users);
app.use('/api', courses);

// IIFE to confirm connection to database
(async () => {
  // Test the connection to the database
  await sequelize.authenticate();
  console.log('Connection to the database successful!');
})();

// Send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set our port
app.set('port', process.env.PORT || 5000);

// Start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports = app;