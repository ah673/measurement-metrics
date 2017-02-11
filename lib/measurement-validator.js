'use strict';
var MeasurementValidator = (function () {

    function validateMeasurement (measurement) {
        if (!measurement.timestamp) {
            return false;
        }
        for (let key of Object.keys(measurement)){
            if (key === 'timestamp') {
                continue;
            }
            if (typeof measurement[key] !== 'number' || isNaN(measurement[key])){
                return false;
            }
        }
        return true;
    }
    return {
        validateMeasurement: validateMeasurement
    }
})();

module.exports = MeasurementValidator;
