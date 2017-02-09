"use strict";
const Measurements = require('../lib/measurements');
const MeasurementValidator = require('../lib/measurement-validator');

var MeasurementRoutes = ( () => {
    const measurements = new Measurements();

    function postMeasurement (req, res) {
        if (req.body){
            try {
                saveMeasurements(req.body);
                res.status(201);
                res.json(measurements.getValue(req.body.timestamp));
            } catch (e) {
                res.status(400);
                res.end();
            }
        } else {
            // nothing to save
            res.status(400);
            res.end();
        }
    }

    function saveMeasurements (measurements) {
        if (!Array.isArray(measurements)) {
            measurements = [measurements];
        }
        if (!measurements.every(MeasurementValidator.validateMeasurement)){
            throw new Error('Invalid measurement');
        }
        measurements.forEach(insertMeasurement)
    }

    function getMeasurement (req, res) {
        if (!req.params.timestamp) {
            res.status(404);
            res.end();
        }
        const retrievedValue = measurements.getValue(req.params.timestamp);
        if (retrievedValue){
            res.status(200);
            res.json(retrievedValue);
        } else {
            res.status(404);
            res.end();
        }
    }

    function updateMeasurement(req, res) {
        const timestamp = req.params.timestamp;
        if (!timestamp) {
            res.status(404);
            res.end();
        }
        measurements.update(timestamp, req.body);
        res.status(204);
        res.end();
    }

    function insertMeasurement (measurement) {
        measurements.insert(measurement.timestamp, measurement);
    }

    return {
        postMeasurement: postMeasurement,
        getMeasurement: getMeasurement,
        updateMeasurement: updateMeasurement
    }
})();

module.exports = MeasurementRoutes;