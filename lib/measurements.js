"use strict";
function Measurements () {
    this.sortedArray = [];
}

Measurements.prototype.insert = function (timestamp, value) {
    if (!timestamp) {
        throw new Error(`key ${timestamp} is invalid`);
    }
    const index = this.indexOf(timestamp);
    const valueToInsert = {
        key: timestamp,
        value: value
    };

    this.sortedArray.splice(index, 0, valueToInsert);
};

Measurements.prototype.indexOf = function (key) {
    let low = 0;
    let high = this.sortedArray.length - 1;

    while (low <= high) {
        const middle = low + Math.floor((high - low)/2);
        const middleElement = this.sortedArray[middle];
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
};

Measurements.prototype.getValue = function (key) {
    const index = this.indexOf(key);
    const itemOfInterest = this.sortedArray[index];
    if (itemOfInterest && itemOfInterest.key === key) {
        return itemOfInterest.value;
    }
    return null;
};

Measurements.prototype.getValuesInRange = function (startDay, endDay) {
    let relevantValues = [];
    let index = this.indexOf(startDay);


    while (index < this.sortedArray.length) {
        const valueAtIndex = this.sortedArray[index];
        if (valueAtIndex.key >= startDay && valueAtIndex.key < endDay) {
            relevantValues.push(valueAtIndex.value);
            index++;
        } else {
            break;
        }
    }
    return relevantValues;
};

Measurements.prototype.remove = function (key) {
    const index = this.indexOf(key);
    const itemOfInterest = this.sortedArray[index];

    if (itemOfInterest && itemOfInterest.key === key) {
        this.sortedArray.splice(index, 1);
        return this.sortedArray.length;
    }
    return null;
};

Measurements.prototype.replace = function (timestamp, value) {
    const index = this.indexOf(timestamp);
    const itemOfInterest = this.sortedArray[index];

    if (itemOfInterest && itemOfInterest.key === timestamp) {
        this.sortedArray[index] = {
            key: timestamp,
            value: value
        };
        return value;
    }
    return null;
};

Measurements.prototype.update = function (timestamp, value) {
    const index = this.indexOf(timestamp);
    const itemOfInterest = this.sortedArray[index];

    if (itemOfInterest && itemOfInterest.key === timestamp) {
        for (let key of Object.keys(value)) {
            itemOfInterest.value[key] = value[key];
        }
        return this.getValue(timestamp);
    }
    return null;
};

Measurements.prototype.getStatistics = function (metric, stats, from, to) {
    const measurementsInRange = this.getValuesInRange(from, to);

    let metrics = [];

    for (let stat of stats) {
        let value;
        switch (stat.toLowerCase()) {
            case 'min':
                measurementsInRange.forEach( (measurement) => {

                    if (measurement[metric]) {
                        if (!value) {
                            value = measurement[metric];
                        }
                        value = Math.min(value, measurement[metric]);
                    }
                });
                break;
            case 'max':
                measurementsInRange.forEach( (measurement) => {
                    if (measurement[metric]) {
                        if (!value) {
                            value = measurement[metric];
                        }
                        value = Math.max(value, measurement[metric]);
                    }
                });
                break;
            case 'average':
                value = findAverageForMetric(measurementsInRange, metric);
                break;
            default:
                throw new Error('metric not supported');
        }

        metrics.push({
            metric: metric,
            stat: stat,
            value: value
        });
    }
    return metrics;
};

function findAverageForMetric (measurements, metric) {
    let value = 0;
    let measurementsWithMetric = 0;
    measurements.forEach( (measurement) => {
        if (measurement[metric]) {
            value += measurement[metric];
            measurementsWithMetric++;
        }
    });
    return value/measurementsWithMetric;
}

Measurements.prototype.clearAll = function () {
    this.sortedArray.length = 0;
};

module.exports = Measurements;