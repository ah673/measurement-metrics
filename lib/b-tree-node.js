'use strict';
function BTreeNode (order) {
    this.order = order || 5;
    this.values = [];
}

BTreeNode.prototype.isFull = function () {
    return this.values.length >= this.order;
};

BTreeNode.prototype.insert = function (key, value) {
    const index = this.binarySearchIndexToInsert(key);
    this.values.splice(index, 0, {key: key, value: value});
};

BTreeNode.prototype.binarySearchIndexToInsert = function (key) {
    let low = 0;
    let high = this.values.length;
    while (low < high) {
        const middle = low + Math.floor((high - low)/2);
        if (this.values[middle].key > key) {
            high = middle -1;
        } else {
            low = middle +1;
        }
    }
    return low;
};

BTreeNode.prototype.get = function (key) {
    let low = 0;
    let high = this.values.length;
    while (low < high) {
        const middle = low + ((high - low)/2);
        if (this.values[middle].key === key) {
            return this.values[middle].value;
        }
        if (this.values[middle] > key) {
            low = middle +1;
        } else {
            high = middle -1;
        }
    }
    return null;
};

BTreeNode.prototype.getValues = function () {
    return this.values;
};

module.exports = BTreeNode;
