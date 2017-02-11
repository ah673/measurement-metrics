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

    function putMeasurement (req, res) {
        const timestamp = req.params.timestamp;
        const measurement = req.body;
        if (!timestamp) {
            res.status(404);
            res.end();
            return;
        }

        if (timestamp !== measurement.timestamp) {
            res.status(409);
            res.end();
            return;
        }
        if (!MeasurementValidator.validateMeasurement(measurement)) {
            res.status(400);
            res.end();
            return;
        }
        const updated = measurements.replace(timestamp, req.body);
        if (updated === null) {
            res.status(404);
            res.end();
            return;
        }
        res.status(204);
        res.end();
    }

    function patchMeasurement (req, res) {
        const measurement = req.body;
        if (!MeasurementValidator.validateMeasurement(measurement)) {
            res.status(400);
            res.end();
            return;
        }

        if (req.params.timestamp !== measurement.timestamp) {
            res.status(409);
            res.end();
            return;
        }
        const updated = measurements.update(req.params.timestamp, measurement);
        if (updated === null) {
            res.status(404);
            res.end();
            return;
        }

        res.status(204);
        res.end();
    }

    function deleteMeasurement (req, res) {
        const key = req.params.timestamp;
        const newLength = measurements.remove(key);
        if (newLength === null){
            res.status(404);
            res.end();
            return;
        }
        res.status(204);
        res.end();
    }

    function insertMeasurement (measurement) {
        measurements.insert(measurement.timestamp, measurement);
    }

    /**
     * Figure out how to shut down and spin up server
     * @param req
     * @param res
     */
    function clearAll (req, res) {
        measurements.clearAll();
        res.status(200);
        res.end();
    }

    return {
        postMeasurement: postMeasurement,
        getMeasurement: getMeasurement,
        putMeasurement: putMeasurement,
        patchMeasurement: patchMeasurement,
        deleteMeasurement: deleteMeasurement,
        clearAll: clearAll
    }
})();

module.exports = MeasurementRoutes;