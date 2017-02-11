'use strict';

const measurements = require('../../lib/measurements');
const chai = require('chai');
const should = chai.should();


describe ('Measurements', () => {
    afterEach(() => {
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

    it('should be able to clear all data from store', () => {
        measurements.insert('2015-09-01T16:00:00.000Z', 'a');
        measurements.insert('2015-09-01T16:10:00.000Z', 'b');

        measurements.clearAll();

        const insertedValues = measurements.getValues();
        insertedValues.length.should.equal(0);
    });

    it('should be able to clear values when there is no data', () => {
        const retrievedMeasurements = measurements.getValues();
        retrievedMeasurements.length.should.equal(0);

        measurements.clearAll();
        const newValues = measurements.getValues();
        newValues.length.should.equal(0);

    });

    it('should be able to get values within a range', () => {
        measurements.insert('2015-07-01T16:00:00.000Z', 'x');
        measurements.insert('2015-09-01T16:00:00.000Z', 'a');
        measurements.insert('2015-09-01T16:10:00.000Z', 'b');
        measurements.insert('2015-09-31T16:00:00.000Z', 'c');

        const retrievedMeasurements = measurements.getValuesInRange('2015-09-01', '2015-09-02');

        retrievedMeasurements.length.should.equal(2);
        retrievedMeasurements[0].should.equal('a');
        retrievedMeasurements[1].should.equal('b');
    });

    it('should return an emtpy array when nothing matches the range', () => {
        measurements.insert('2015-07-01T16:00:00.000Z', 'x');
        measurements.insert('2015-09-01T16:00:00.000Z', 'a');
        measurements.insert('2015-09-01T16:10:00.000Z', 'b');
        measurements.insert('2015-09-31T16:00:00.000Z', 'c');

        const retrievedMeasurements = measurements.getValuesInRange('A', 'Z');

        retrievedMeasurements.length.should.equal(0);

    });

    it('should be able to replace the value for a given key', () => {
        const key = 'Replace me';
        measurements.insert(key, {
            name: 'temporary',
            mood: 'okay'
        });

        const newValue = {
            name: 'Chrom',
            address: 'good',
            newKey: 'newValue'
        };

        measurements.replace(key, newValue);

        const retrievedValue = measurements.getValue(key);
        retrievedValue.name.should.equal(newValue.name);
        retrievedValue.address.should.equal(newValue.address);
        retrievedValue.newKey.should.equal(newValue.newKey);
    });

    it('should be able to partially update a record', () => {
        const key = 'Replace me';
        measurements.insert(key, {
            name: 'temporary',
            mood: 'okay'
        });

        const newValue = {
            name: 'Anna'
        };

        measurements.update(key, newValue);

        const retrievedValue = measurements.getValue(key);
        retrievedValue.name.should.equal(newValue.name);
        retrievedValue.mood.should.equal('okay');

    });

    it('should return null when updating the value of a key that does not exist', () => {
        const updateStatus = measurements.update('nonexistent', 'value');
        should.not.exist(updateStatus);
        should.equal(updateStatus, null);
    });

    it('should return null when replacing the value of a key that does not exist', () => {
        const replaceStatus = measurements.replace('nonexistent', 'value');
        should.not.exist(replaceStatus);
        should.equal(replaceStatus, null);
    });
});