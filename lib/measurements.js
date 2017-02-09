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

Measurements.prototype.remove = function (key) {
    const index = this.indexOf(key);
    const itemOfInterest = this.sortedArray[index];

    if (itemOfInterest && itemOfInterest.key === key) {
        this.sortedArray.splice(index, 1);
    }
};

Measurements.prototype.update = function (timestamp, value) {
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



module.exports = Measurements;