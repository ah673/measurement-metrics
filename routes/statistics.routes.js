'use strict';

const measurements = require('../lib/measurements');

var StatisticRoutes = (function () {
    /**
     * Given a fromDateTime and a toDateTime, provides statistics on specified metric.
     * Supported statistics : min, max, average
     * @param req : request
     * @param res : response
     */
    function getStatistics (req, res) {
        const startDate = req.query.fromDateTime;
        const endDate = req.query.toDateTime;
        const metric = req.query.metric;
        const stat = req.query.stat;

        if (!startDate || !endDate || !metric || !stat) {
            res.status(500)
                .send('fromDateTime, toDateTime, metric, and stat are required');
            res.end();
            return;
        }

        function done (err, statistics) {
            if (err) {
                res.status(500).send(err);
                res.end();
            } else {
                res.status(200);
                res.json(statistics);
                res.end();
            }
        }

        measurements.getStatistics(
            metric, stat, startDate
            , endDate, done);

    }

    return {
        getStatistics: getStatistics
    }
})();

module.exports = StatisticRoutes;