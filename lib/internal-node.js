function InternalNode () {
    this.children = [];
}

InternalNode.prototype = Object.create(BTreeNode.prototype);