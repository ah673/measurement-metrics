'use strict';
const BTreeNode = require('../../lib/b-tree-node');
const chai = require('chai');
const should = chai.should();

describe ('B-Tree Node', () => {
    let bTreeNode;
    beforeEach(() => {
        bTreeNode = new BTreeNode(3);
    });

    it ('should not be overflowed when it contains no data', () => {
        bTreeNode.isFull().should.be.false;
    });

    it ('should be overflowed when it exceeds order', () => {
        bTreeNode.insert('2017-01-08T03:48:23.223Z', {});
        bTreeNode.insert('2017-02-08T03:48:23.223Z', {});
        bTreeNode.insert('2017-03-08T03:48:23.223Z', {});
        bTreeNode.insert('2017-04-08T03:48:23.223Z', {});

        bTreeNode.isFull().should.be.true;

    });

    it ('should keep keys in sorted order', () => {
        bTreeNode.insert('2017-04-08T03:48:23.223Z', {temperature: 10.0});
        bTreeNode.insert('2017-02-08T03:48:23.223Z', {temperature: 20.0});
        bTreeNode.insert('2017-01-08T03:48:23.223Z', {temperature: 30.0});

        const values = bTreeNode.getValues();
        values.length.should.equal(3);
        values[0].value.temperature.should.equal(30.0);
        values[1].value.temperature.should.equal(20.0);
        values[2].value.temperature.should.equal(10.0);

    });

    it ('should be able to retrieve an inserted key', () => {
        const key = '2017-04-08T03:48:23.223Z';
        bTreeNode.insert(key, {'temperature': 22.4});
        bTreeNode.insert('2017-03-08T03:48:23.223Z', {'temperature': 20.0});

        const value = bTreeNode.get(key);
        value.temperature.should.equal(22.4);

    });

    it ('should return null when no such key is found', () => {
        const value = bTreeNode.get('2017-04-08T03:48:23.223Z');
        should.equal(value, null);
    });
});