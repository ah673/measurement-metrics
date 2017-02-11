'use strict';

const measurements = require('../lib/measurements');

var ClearAllRoute = (function () {

    function clearAll (req, res) {
        measurements.clearAll();
        res.status(204);
        res.end();
    }


    return {
        clearAll: clearAll
    }
})();

module.exports = ClearAllRoute;