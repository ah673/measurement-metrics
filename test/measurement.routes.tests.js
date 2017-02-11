"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);


describe('Measurements RESTful Endpoint', () => {
    afterEach ((done) => {
        chai.request(server)
            .get('/clearAll')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    describe('Add a measurement', () => {
        it ('should add the measurement when valid', (done) => {
            const measurement = {
                timestamp: "2015-09-01T16:00:00.000Z",
                temperature: 27.1,
                dewPoint: 16.7,
                precipitation: 0
            };
            chai.request(server)
                .post('/measurements')
                .send(measurement)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.temperature.should.equal(measurement.temperature);
                    res.body.dewPoint.should.equal(measurement.dewPoint);
                    res.body.precipitation.should.equal(measurement.precipitation);
                    done();
                });

        });

        it('should not add the measurement with invalid value', (done) => {
            const measurement = {
                timestamp: "2015-09-01T16:00:00.000Z",
                temperature: 'not a number',
                dewPoint: 16.7,
                precipitation: 0
            };
            chai.request(server)
            .post('/measurements')
            .send(measurement)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

        });

        it('should not add measurement without POST body', (done) => {
            chai.request(server)
            .post('/measurements')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

        });

        it('should not add measurements without a timestamp', (done) => {
            const measurement = {
                temperature: 27.1,
                dewPoint: 16.7,
                precipitation: 0
            };
            chai.request(server)
            .post('/measurements')
            .send(measurement)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

        });
    });

    describe('Get a measurement', () => {
        beforeEach((done) => {
            const measurements = [
                {
                    timestamp: '2015-09-01T16:00:00.000Z',
                    temperature: 27.1,
                    dewPoint: 16.7,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:10:00.000Z',
                    temperature: 27.3,
                    dewPoint: 16.9,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:20:00.000Z',
                    temperature: 27.5,
                    dewPoint: 17.1,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:30:00.000Z',
                    temperature: 27.4,
                    dewPoint: 17.3,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:40:00.000Z',
                    temperature: 27.2,
                    dewPoint: 17.2,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:40:00.000Z',
                    temperature: 28.1,
                    dewPoint: 18.3,
                    precipitation: 0
                }
            ];

            chai.request(server)
                .post('/measurements')
                .send(measurements)
                .end( (err, res) => {
                    done();
                });
        });

        it('should be able to retrieve a measurement', (done) => {
            chai.request(server)
            .get('/measurements/2015-09-01T16:20:00.000Z')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.temperature.should.equal(27.5);
                res.body.dewPoint.should.equal(17.1);
                res.body.precipitation.should.equal(0);
                done();
            });
        });

        it('should not be able to retrieve a measurement that does not exist', (done) => {
            const timestamp = '2015-09-01T16:50:00.000Z';
            chai.request(server)
            .get(`/measurements/${timestamp}`)
            .end((err, res) => {
                res.should.have.status(404);

                chai.request(server)
                    .get(`/measurements/${timestamp}`)
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });

    });

    describe('Get a days worth of measurements', () => {
        beforeEach((done) => {
            const measurements = [
                {
                    timestamp: '2015-09-01T16:00:00.000Z',
                    temperature: 27.1,
                    dewPoint: 16.7,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:10:00.000Z',
                    temperature: 27.3,
                    dewPoint: 16.9,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:20:00.000Z',
                    temperature: 27.5,
                    dewPoint: 17.1,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:30:00.000Z',
                    temperature: 27.4,
                    dewPoint: 17.3,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:40:00.000Z',
                    temperature: 27.2,
                    dewPoint: 17.2,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-02T16:00:00.000Z',
                    temperature: 28.1,
                    dewPoint: 18.3,
                    precipitation: 0
                }
            ];

            chai.request(server)
                .post('/measurements')
                .send(measurements)
                .end( (err, res) => {
                    done();
                });
        });

        it ('should be able to retrieve measurements for a day', (done) => {
            chai.request(server)
                .get('/measurements/2015-09-01')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.equal(5);

                    res.body[0].timestamp.should.equal('2015-09-01T16:00:00.000Z');
                    res.body[0].temperature.should.equal(27.1);
                    res.body[0].dewPoint.should.equal(16.7);
                    res.body[0].precipitation.should.equal(0);

                    res.body[1].timestamp.should.equal('2015-09-01T16:10:00.000Z');
                    res.body[1].temperature.should.equal(27.3);
                    res.body[1].dewPoint.should.equal(16.9);
                    res.body[1].precipitation.should.equal(0);

                    res.body[2].timestamp.should.equal('2015-09-01T16:20:00.000Z');
                    res.body[2].temperature.should.equal(27.5);
                    res.body[2].dewPoint.should.equal(17.1);
                    res.body[2].precipitation.should.equal(0);

                    res.body[3].timestamp.should.equal('2015-09-01T16:30:00.000Z');
                    res.body[3].temperature.should.equal(27.4);
                    res.body[3].dewPoint.should.equal(17.3);
                    res.body[3].precipitation.should.equal(0);

                    res.body[4].timestamp.should.equal('2015-09-01T16:40:00.000Z');
                    res.body[4].temperature.should.equal(27.2);
                    res.body[4].dewPoint.should.equal(17.2);
                    res.body[4].precipitation.should.equal(0);

                    done();
                });
        });

        it ('should return 404 when measurements do not exist', (done) => {
            chai.request(server)
                .get('/measurements/2015-09-03')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        describe ('additional test case for getting day of data', () => {
            before( (done) => {
                chai.request(server)
                    .post('/measurements')
                    .send([{
                        timestamp: '2015-08-31T00:00:00.000Z',
                        temperature: 20.2,
                        dewPoint: 14.0,
                        precipitation: 1
                    }, {
                        timestamp: '2015-09-01T00:00:00.000Z',
                        temperature: 10.2,
                        dewPoint: 15.0,
                        precipitation: 2.0
                    }])
                    .end( (err, res) => {
                        done();
                    });
            });

            it('should not retrieve values before day', (done) => {
                chai.request(server)
                    .get('/measurements/2015-09-01')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.equal(6);

                        res.body[0].timestamp.should.equal('2015-09-01T00:00:00.000Z');
                        res.body[0].temperature.should.equal(10.2);
                        res.body[0].dewPoint.should.equal(15.0);
                        res.body[0].precipitation.should.equal(2.0);

                        res.body[1].timestamp.should.equal('2015-09-01T16:00:00.000Z');
                        res.body[1].temperature.should.equal(27.1);
                        res.body[1].dewPoint.should.equal(16.7);
                        res.body[1].precipitation.should.equal(0);

                        res.body[2].timestamp.should.equal('2015-09-01T16:10:00.000Z');
                        res.body[2].temperature.should.equal(27.3);
                        res.body[2].dewPoint.should.equal(16.9);
                        res.body[2].precipitation.should.equal(0);

                        res.body[3].timestamp.should.equal('2015-09-01T16:20:00.000Z');
                        res.body[3].temperature.should.equal(27.5);
                        res.body[3].dewPoint.should.equal(17.1);
                        res.body[3].precipitation.should.equal(0);

                        res.body[4].timestamp.should.equal('2015-09-01T16:30:00.000Z');
                        res.body[4].temperature.should.equal(27.4);
                        res.body[4].dewPoint.should.equal(17.3);
                        res.body[4].precipitation.should.equal(0);

                        res.body[5].timestamp.should.equal('2015-09-01T16:40:00.000Z');
                        res.body[5].temperature.should.equal(27.2);
                        res.body[5].dewPoint.should.equal(17.2);
                        res.body[5].precipitation.should.equal(0);

                        done();
                    });
            });

        })

    });

    describe('Replace a measurement', () => {
        beforeEach( (done)=> {
            const measurements = [
                {
                    timestamp: '2015-09-01T16:00:00.000Z',
                    temperature: 27.1,
                    dewPoint: 16.7,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:10:00.000Z',
                    temperature: 27.3,
                    dewPoint: 16.9,
                    precipitation: 0
                }
            ];
            chai.request(server)
            .post('/measurements')
            .send(measurements)
            .end( (err, res) => {
                done();
            });
        });
        it('should be able to update a measurement of a specified time', (done) => {
            const timestamp = '2015-09-01T16:00:00.000Z';
            const updatedObject = {
                timestamp: timestamp,
                temperature: 27.1,
                dewPoint: 16.7,
                precipitation: 15.2
            };

            chai.request(server)
            .put(`/measurements/${timestamp}`)
            .send(updatedObject)
            .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.a('object');

                chai.request(server)
                .get(`/measurements/${timestamp}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.temperature.should.equal(updatedObject.temperature);
                    res.body.dewPoint.should.equal(updatedObject.dewPoint);
                    res.body.precipitation.should.equal(updatedObject.precipitation);
                    done();

                });
            });
        });

        it ('should not allow update of measurements to invalid values', (done) => {
            const timestamp = '2015-09-01T16:00:00.000Z';
            const updatedObject = {
                timestamp: timestamp,
                temperature: 'not a number',
                dewPoint: 16.7,
                precipitation: 15.2
            };

            chai.request(server)
            .put(`/measurements/${timestamp}`)
            .send(updatedObject)
            .end((err, res) => {
                res.should.have.status(400);

                chai.request(server)
                .get(`/measurements/${timestamp}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.temperature.should.equal(27.1);
                    res.body.dewPoint.should.equal(16.7);
                    res.body.precipitation.should.equal(0);
                    done();

                });
            });
        });

        it ('should not allow update with mismatched timestamps', (done) => {
            const timestamp = '2015-09-01T16:00:00.000Z';
            const updatedObject = {
                timestamp: '2015-09-02T16:00:00.000Z',
                temperature: 27.1,
                dewPoint: 16.7,
                precipitation: 15.2
            };

            chai.request(server)
            .put(`/measurements/${timestamp}`)
            .send(updatedObject)
            .end((err, res) => {
                res.should.have.status(409);

                chai.request(server)
                .get(`/measurements/${timestamp}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.temperature.should.equal(27.1);
                    res.body.dewPoint.should.equal(16.7);
                    res.body.precipitation.should.equal(0);
                    done();

                });
            });
        });

        it ('should not replace measurement for timestamp that does not exist', (done) => {
            const timestamp = '2015-09-02T16:00:00.000Z';
            const updatedObject = {
                timestamp: timestamp,
                temperature: 27.1,
                dewPoint: 16.7,
                precipitation: 15.2
            };

            chai.request(server)
            .put(`/measurements/${timestamp}`)
            .send(updatedObject)
            .end((err, res) => {
                res.should.have.status(404);

                chai.request(server)
                    .get(`/measurements/${timestamp}`)
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();

                    });
            });
        });

    });

    describe('Update a measurement', () => {
        beforeEach( (done)=> {
            const measurements = [
                {
                    timestamp: '2015-09-01T16:00:00.000Z',
                    temperature: 27.1,
                    dewPoint: 16.7,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:10:00.000Z',
                    temperature: 27.3,
                    dewPoint: 16.9,
                    precipitation: 0
                }
            ];
            chai.request(server)
                .post('/measurements')
                .send(measurements)
                .end( (err, res) => {
                    done();
                });
        });

        it ('should be able to update a measurement when valid values supplied', (done) => {
            const timestamp = '2015-09-01T16:00:00.000Z';
            const fieldsToUpdate = {
                timestamp: timestamp,
                precipitation: 12.3
            };

            chai.request(server)
                .patch(`/measurements/${timestamp}`)
                .send(fieldsToUpdate)
                .end((err, res) => {
                    res.should.have.status(204);

                    chai.request(server)
                        .get(`/measurements/${timestamp}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.temperature.should.equal(27.1);
                            res.body.dewPoint.should.equal(16.7);
                            res.body.precipitation.should.equal(fieldsToUpdate.precipitation);
                            done();

                        });
                });
        });

        it ('should not update a measurement when invalid values supplied', (done) => {
            const timestamp = '2015-09-01T16:00:00.000Z';
            const fieldsToUpdate = {
                timestamp: timestamp,
                precipitation: 'not a number'
            };

            chai.request(server)
                .patch(`/measurements/${timestamp}`)
                .send(fieldsToUpdate)
                .end((err, res) => {
                    res.should.have.status(400);

                    chai.request(server)
                        .get(`/measurements/${timestamp}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.temperature.should.equal(27.1);
                            res.body.dewPoint.should.equal(16.7);
                            res.body.precipitation.should.equal(0);
                            done();

                        });
                });
        });

        it ('should not update a measurement with mismatched timestamps', (done) => {
            const timestamp = '2015-09-01T16:00:00.000Z';
            const fieldsToUpdate = {
                timestamp: '2015-09-02T16:00:00.000Z',
                precipitation: 12.3
            };

            chai.request(server)
                .patch(`/measurements/${timestamp}`)
                .send(fieldsToUpdate)
                .end((err, res) => {
                    res.should.have.status(409);

                    chai.request(server)
                        .get(`/measurements/${timestamp}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.temperature.should.equal(27.1);
                            res.body.dewPoint.should.equal(16.7);
                            res.body.precipitation.should.equal(0);
                            done();

                        });
                });
        });

        it ('should not update metrics of a measurement that does not exist', (done) => {
            const timestamp = '2015-09-02T16:00:00.000Z';
            const fieldsToUpdate = {
                timestamp: timestamp,
                precipitation: 12.3
            };

            chai.request(server)
                .patch(`/measurements/${timestamp}`)
                .send(fieldsToUpdate)
                .end((err, res) => {
                    res.should.have.status(404);

                    chai.request(server)
                        .get(`/measurements/${timestamp}`)
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();

                        });
                });
        });

    });

    describe('Delete a measurement', () => {
        beforeEach( (done)=> {
            const measurements = [
                {
                    timestamp: '2015-09-01T16:00:00.000Z',
                    temperature: 27.1,
                    dewPoint: 16.7,
                    precipitation: 0
                },
                {
                    timestamp: '2015-09-01T16:10:00.000Z',
                    temperature: 27.3,
                    dewPoint: 16.9,
                    precipitation: 0
                }
            ];
            chai.request(server)
                .post('/measurements')
                .send(measurements)
                .end( (err, res) => {
                    done();
                });
        });

        it ('should delete a specified measurement', (done) => {
            const timestamp = '2015-09-01T16:00:00.000Z';

            chai.request(server)
                .delete(`/measurements/${timestamp}`)
                .end((err, res) => {
                    res.should.have.status(204);

                    chai.request(server)
                        .get(`/measurements/${timestamp}`)
                        .end((err, res) => {
                            res.should.have.status(404);

                            chai.request(server)
                                .get(`/measurements/2015-09-01T16:10:00.000Z`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.temperature.should.equal(27.3);
                                    res.body.dewPoint.should.equal(16.9);
                                    res.body.precipitation.should.equal(0);
                                    done();
                                });
                        });
                });
        });

        it ('should return 404 when deleting a measurement that does not exist', (done) => {
            const timestamp = '2015-09-01T16:20:00.000Z';

            chai.request(server)
                .delete(`/measurements/${timestamp}`)
                .end((err, res) => {
                    res.should.have.status(404);

                    chai.request(server)
                        .get(`/measurements/${timestamp}`)
                        .end((err, res) => {
                            res.should.have.status(404);

                            chai.request(server)
                                .get(`/measurements/2015-09-01T16:00:00.000Z`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.timestamp.should.equal('2015-09-01T16:00:00.000Z');
                                    res.body.temperature.should.equal(27.1);
                                    res.body.dewPoint.should.equal(16.7);
                                    res.body.precipitation.should.equal(0);

                                    chai.request(server)
                                        .get(`/measurements/2015-09-01T16:10:00.000Z`)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.timestamp.should.equal('2015-09-01T16:10:00.000Z');
                                            res.body.temperature.should.equal(27.3);
                                            res.body.dewPoint.should.equal(16.9);
                                            res.body.precipitation.should.equal(0);
                                            done();
                                        });
                                });
                        });
                });
        });


    });
});