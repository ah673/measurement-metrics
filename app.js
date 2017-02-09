'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const measurementRoutes = require('./routes/measurement.routes');


/**
 * Setup Application
 */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json'}));
const portToUse = process.env.PORT || 3000;
app.listen(portToUse, function () {
    console.log('application listening on port', portToUse);
});


/**
 * Routes
 */
app.post('/measurements', measurementRoutes.postMeasurement);
app.route('/measurements/:timestamp')
    .get(measurementRoutes.getMeasurement);


module.exports = app;