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

        calculateStatistics(metric, stat, startDate, endDate, done);
    }

    function calculateStatistics (metrics, stats, from, to, done) {
        const measurementsInRange = measurements.getValuesInRange(from, to);
        if (!Array.isArray(metrics)) {
            metrics = [metrics];
        }

        if (!Array.isArray(stats)) {
            stats = [stats];
        }

        let statisticsForMetrics = [];

        for (let metric of metrics) {
            for (let stat of stats) {
                try {
                    let value = calculateStatForMetric(stat, metric, measurementsInRange);

                    if (value) {
                        statisticsForMetrics.push({
                            metric: metric,
                            stat: stat,
                            value: value
                        });
                    }
                } catch (err) {
                    return done(err);
                }
            }
        }
        return done(null, statisticsForMetrics);
    }

    function calculateStatForMetric (stat, metric, measurements) {
        switch (stat.toLowerCase()) {
            case 'min':
                return findMinForMetric(measurements, metric);
            case 'max':
                return findMaxForMetric(measurements, metric);
            case 'average':
                return findAverageForMetric(measurements, metric);

            default:
                throw new Error('metric not supported');
        }
    }

    function findMinForMetric (measurements, metric) {
        let value = null;
        measurements.forEach( (measurement) => {
            if (measurement[metric]) {
                if (!value) {
                    value = measurement[metric];
                }
                value = Math.min(value, measurement[metric]);
            }
        });
        return value;
    }

    function findMaxForMetric (measurements, metric) {
        let value = null;
        measurements.forEach( (measurement) => {
            if (measurement[metric]) {
                if (!value) {
                    value = measurement[metric];
                }
                value = Math.max(value, measurement[metric]);
            }
        });
        return value;
    }

    function findAverageForMetric (measurements, metric) {
        let value = 0;
        let measurementsWithMetric = 0;
        measurements.forEach( (measurement) => {
            if (measurement[metric]) {
                value += measurement[metric];
                measurementsWithMetric++;
            }
        });
        const average = value/measurementsWithMetric;
        return isNaN(average) ? null : average;
    }

    return {
        getStatistics: getStatistics
    }
})();

module.exports = StatisticRoutes;