'use strict';

const measurements = require('../../lib/measurements');
const chai = require('chai');
const should = chai.should();


describe ('Measurements', () => {
    beforeEach(() => {
        measurements.clearAll();
    });

    it ('should be able to add and retrieve value', () => {
        const key = 'A';
        const valueToInsert = {value: 'a'};
        measurements.insert(key, valueToInsert);
        const retrievedValue = measurements.getValue(key);

        retrievedValue.value.should.equal(valueToInsert.value);
    });

    it ('should return null when retrieving invalid value', () => {
        measurements.insert('C', 'c');
        const retrievedValue = measurements.getValue('A');

        should.equal(retrievedValue, null);
    });

    it ('should insert values in sorted order', () => {
        measurements.insert('B', 'b');
        measurements.insert('A', 'a');

        const insertedValues = measurements.getValues();

        insertedValues.length.should.equal(2);
        insertedValues[0].should.equal('a');
        insertedValues[1].should.equal('b');

    });

    it ('should insert timestamps in sorted order', () => {
        measurements.insert('2015-09-01T16:00:00.000Z', 'a');
        measurements.insert('2015-09-01T16:10:00.000Z', 'b');

        const insertedValues = measurements.getValues();

        insertedValues.length.should.equal(2);
        insertedValues[0].should.equal('a');
        insertedValues[1].should.equal('b');

    });

    it ('should be able to remove inserted values', () => {
        const key = 'B';
        measurements.insert(key, 'b');
        const retrievedValue = measurements.getValue(key);
        retrievedValue.should.equal('b');

        measurements.remove(key);
        const deletedValue = measurements.getValue(key);
        should.equal(deletedValue, null);

    });

    it ('should be able to remove nonexistant values', () => {
        const key = 'B';

        measurements.remove(key);
        const deletedValue = measurements.getValue(key);
        should.equal(deletedValue, null);

    });

    it ('should throw exception if key not supplied on insert', () => {
        chai.expect(measurements.insert).to.throw(Error, /key undefined is invalid/);
    });


});