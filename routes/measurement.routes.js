'use strict';
const measurements = require('../lib/measurements');
const MeasurementValidator = require('../lib/measurement-validator');
const moment = require('moment');

var MeasurementRoutes = ( () => {
    function postMeasurement (req, res) {
        function done (err, result) {
            if (err) {
                res.status(400).send(err);
                res.end();
            } else {
                res.status(201);
                res.end();
            }
        }

        if (req.body){
            saveMeasurements(req.body, done);
        } else {
            res.status(400);
            res.end();
        }
    }

    function saveMeasurements (measurements, done) {
        if (!Array.isArray(measurements)) {
            measurements = [measurements];
        }
        if (!measurements.every(MeasurementValidator.validateMeasurement)){
            return done('invalid measurement');
        }
        measurements.forEach(insertMeasurement);
        return done(null)
    }

    function getMeasurement (req, res) {
        const timestamp = req.params.timestamp;
        if (!timestamp) {
            res.status(404);
            res.end();
        }

        const isDay = moment(timestamp, 'YYYY-MM-DD', true).isValid();

        let retrievedValues;
        if (isDay) {
            const measurementsForDay = getMeasurementsForDay(timestamp);
            if (Array.isArray(measurementsForDay) && measurementsForDay.length > 0) {
                retrievedValues = measurementsForDay;
            }
            else {
                retrievedValues = null;
            }

        } else {
            retrievedValues = measurements.getValue(timestamp);
        }

        if (retrievedValues){
            res.status(200);
            res.json(retrievedValues);
        } else {
            res.status(404);
            res.end();
        }
    }

    function getMeasurementsForDay (day) {
        const startDateAsMomentDate = moment(day, 'YYYY-MM-DD').utc();
        const endDate = startDateAsMomentDate.add(1, 'days').startOf('day').toDate().toISOString();
        return measurements.getValuesInRange(day,  endDate);
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

    return {
        postMeasurement: postMeasurement,
        getMeasurement: getMeasurement,
        putMeasurement: putMeasurement,
        patchMeasurement: patchMeasurement,
        deleteMeasurement: deleteMeasurement,
    }
})();

module.exports = MeasurementRoutes;