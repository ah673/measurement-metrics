'use strict';

const measurements = require('../lib/measurements');

var StatisticRoutes = (function () {
    function getStatistics (req, res) {
        const statistics = measurements.getStatistics(
            req.query.metric, req.query.stat,
            req.query.fromDateTime, req.query.toDateTime);

        res.status(200);
        res.json(statistics);
        res.end();
    }

    return {
        getStatistics: getStatistics
    }
})();

module.exports = StatisticRoutes;