'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const measurementRoutes = require('./routes/measurement.routes');
const statRoutes = require('./routes/statistics.routes');
const clearAllRoute = require('./routes/clear-all.routes');


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
app.post('/clearAll', clearAllRoute.clearAll);
app.post('/measurements', measurementRoutes.postMeasurement);
app.route('/measurements/:timestamp')
    .get(measurementRoutes.getMeasurement)
    .put(measurementRoutes.putMeasurement)
    .patch(measurementRoutes.patchMeasurement)
    .delete(measurementRoutes.deleteMeasurement);
app.get('/stats', statRoutes.getStatistics);

module.exports = app;