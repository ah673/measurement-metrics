"use strict";
const measurements = (function Measurements () {
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
        clearAll: clearAll,
        getValues: getValues
    }
})();

module.exports = measurements;