'use strict';

const measurements = require('../lib/measurements');

var ClearAllRoute = (function () {

    /**
     * Method to clear the data store.
     *
     */
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