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

let server = app.listen((process.env.PORT || 3000), function () {
    var port = server.address().port;
    console.log('Example app listening at port %s', port);
});



/**
 * Routes
 */
app.get('/clearAll', measurementRoutes.clearAll);
app.post('/measurements', measurementRoutes.postMeasurement);
app.route('/measurements/:timestamp')
    .get(measurementRoutes.getMeasurement)
    .put(measurementRoutes.putMeasurement)
    .patch(measurementRoutes.patchMeasurement);

module.exports = app;