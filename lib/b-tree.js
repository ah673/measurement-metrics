/**
 A B-tree of order m is a search tree in which each nonleaf node has up to m children
 If a node has n children, it contains n−1 keys.
 Every node (except the root) is at least half full
 The elements stored in a given subtree all have keys that are between the keys in the parent node on either side of the subtree pointer. (This generalizes the BST invariant.)
 The root has at least two children if it is not a leaf.
 * @param order
 * @constructor
 */
function BTree (order) {
    this.order = order;
    this.values = new Array(order-1);
    this.children = new Array(order);
};

BTree.prototype.insert = function (key, value) {
    if (!this.isFull()) {
        this.insert(key, value);
    }
};

BTree.prototype.isFull = function () {
    return this.values.length >= this.order;
};

BTree.prototype.insert = function (key, value) {
    const index = this.binarySearchIndexToInsert(key);

};



BTree.prototype.get = function (key) {
    for (let value of this.values) {

    }
};