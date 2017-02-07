'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const measurements = require('./routes/measurements');


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
app.post('/measurements', measurements.postMeasurement);


module.exports = app;