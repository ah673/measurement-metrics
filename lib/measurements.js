"use strict";
function Measurements () {
    let sortedArray = [];

    function insert (timestamp, value) {
        if (!timestamp) {
            throw new Error(`key ${timestamp} is invalid`);
        }
        const index = indexOf(timestamp);
        const valueToInsert = {
            key: timestamp,
            value: value
        };

        sortedArray.splice(index, 0, valueToInsert);
    }

    function indexOf (key) {
        let low = 0;
        let high = sortedArray.length - 1;

        while (low <= high) {
            const middle = low + Math.floor((high - low)/2);
            const middleElement = sortedArray[middle];
            if (middleElement.key === key) {
                return middle;
            }
            if (middleElement.key > key) {
                high = middle - 1;
            } else {
                low = middle + 1;
            }
        }
        return low;
    }

    function getValue (key) {
        const index = indexOf(key);
        const itemOfInterest = sortedArray[index];
        if (itemOfInterest && itemOfInterest.key === key) {
            return itemOfInterest.value;
        }
        return null;
    }

    function getValuesInRange (startDay, endDay) {
        let relevantValues = [];
        let index = indexOf(startDay);


        while (index < sortedArray.length) {
            const valueAtIndex = sortedArray[index];
            if (valueAtIndex.key >= startDay && valueAtIndex.key < endDay) {
                relevantValues.push(valueAtIndex.value);
                index++;
            } else {
                break;
            }
        }
        return relevantValues;
    }

    function remove (key) {
        const index = indexOf(key);
        const itemOfInterest = sortedArray[index];

        if (itemOfInterest && itemOfInterest.key === key) {
            sortedArray.splice(index, 1);
            return sortedArray.length;
        }
        return null;
    }

    function replace (timestamp, value) {
        const index = indexOf(timestamp);
        const itemOfInterest = sortedArray[index];

        if (itemOfInterest && itemOfInterest.key === timestamp) {
            sortedArray[index] = {
                key: timestamp,
                value: value
            };
            return value;
        }
        return null;
    }

    function update (timestamp, value) {
        const index = indexOf(timestamp);
        const itemOfInterest = sortedArray[index];

        if (itemOfInterest && itemOfInterest.key === timestamp) {
            for (let key of Object.keys(value)) {
                itemOfInterest.value[key] = value[key];
            }
            return this.getValue(timestamp);
        }
        return null;
    }

    function getStatistics (metrics, stats, from, to) {
        const measurementsInRange = this.getValuesInRange(from, to);
        if (!Array.isArray(metrics)) {
            metrics = [metrics];
        }

        if (!Array.isArray(stats)) {
            stats = [stats];
        }

        let statisticsForMetrics = [];

        for (let metric of metrics) {
            for (let stat of stats) {
                let value = calculateStatForMetric(stat, metric, measurementsInRange);

                if (value) {
                    statisticsForMetrics.push({
                        metric: metric,
                        stat: stat,
                        value: value
                    });
                }
            }
        }
        return statisticsForMetrics;
    }

    function calculateStatForMetric (stat, metric, measurements) {
        let value;
        switch (stat.toLowerCase()) {
            case 'min':
                measurements.forEach( (measurement) => {
                    if (measurement[metric]) {
                        if (!value) {
                            value = measurement[metric];
                        }
                        value = Math.min(value, measurement[metric]);
                    }
                });
                break;
            case 'max':
                measurements.forEach( (measurement) => {
                    if (measurement[metric]) {
                        if (!value) {
                            value = measurement[metric];
                        }
                        value = Math.max(value, measurement[metric]);
                    }
                });
                break;
            case 'average':
                value = findAverageForMetric(measurements, metric);
                break;
            default:
                throw new Error('metric not supported');
        }
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
        return isNaN(average) ? undefined : average;
    }

    function clearAll () {
        sortedArray.length = 0;
    }

    function getValues () {
        return sortedArray.map(element => element.value);
    }

    return {
        insert: insert,
        getValue: getValue,
        getValuesInRange: getValuesInRange,
        remove: remove,
        replace: replace,
        update: update,
        getStatistics: getStatistics,
        clearAll: clearAll,
        getValues: getValues
    }
}

module.exports = Measurements;