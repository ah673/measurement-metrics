'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const should = chai.should();

chai.use(chaiHttp);


describe('Get measurement statistics', () => {
    afterEach ((done) => {
        chai.request(server)
            .post('/clearAll')
            .end((err, res) => {
                res.should.have.status(204);
                done();
            });
    });

    beforeEach((done) => {
        const measurements = [
            {
                timestamp: '2015-09-01T16:00:00.000Z',
                temperature: 27.1,
                dewPoint: 16.9
            },
            {
                timestamp: '2015-09-01T16:10:00.000Z',
                temperature: 27.3
            },
            {
                timestamp: '2015-09-01T16:20:00.000Z',
                temperature: 27.5,
                dewPoint: 17.1
            },
            {
                timestamp: '2015-09-01T16:30:00.000Z',
                temperature: 27.4,
                dewPoint: 17.3
            },
            {
                timestamp: '2015-09-01T16:40:00.000Z',
                temperature: 27.2,
            },
            {
                timestamp: '2015-09-02T16:00:00.000Z',
                temperature: 28.1,
                dewPoint: 18.3
            }
        ];

        chai.request(server)
            .post('/measurements')
            .send(measurements)
            .end( (err, res) => {
                done();
            });
    });

    it ('should get stats for a well-reported metric', (done) => {
        const stats = ['min', 'max', 'average'];
        chai.request(server)
            .get('/stats')
            .query({
                stat: stats,
                metric: 'temperature',
                fromDateTime: '2015-09-01T16:00:00.000Z',
                toDateTime: '2015-09-01T17:00:00.000Z'
            })
            .end( (err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.equal(stats.length);

                res.body[0].metric.should.equal('temperature');
                res.body[0].stat.should.equal(stats[0]);
                res.body[0].value.should.equal(27.1);

                res.body[1].metric.should.equal('temperature');
                res.body[1].stat.should.equal(stats[1]);
                res.body[1].value.should.equal(27.5);

                res.body[2].metric.should.equal('temperature');
                res.body[2].stat.should.equal(stats[2]);
                res.body[2].value.should.be.closeTo(27.3, 0.001);
                done();
            });
    });

    it ('should get stats for a sparsely reported metric', (done) => {
        const stats = ['min', 'max', 'average'];
        chai.request(server)
            .get('/stats')
            .query({
                stat: stats,
                metric: 'dewPoint',
                fromDateTime: '2015-09-01T16:00:00.000Z',
                toDateTime: '2015-09-01T17:00:00.000Z'
            })
            .end( (err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.equal(stats.length);

                res.body[0].metric.should.equal('dewPoint');
                res.body[0].stat.should.equal(stats[0]);
                res.body[0].value.should.equal(16.9);

                res.body[1].metric.should.equal('dewPoint');
                res.body[1].stat.should.equal(stats[1]);
                res.body[1].value.should.equal(17.3);

                res.body[2].metric.should.equal('dewPoint');
                res.body[2].stat.should.equal(stats[2]);
                res.body[2].value.should.be.closeTo(17.1, 0.001);
                done();
            });
    });

    it ('should return an empty array for a metric that has never been reported', (done) => {
        const stats = ['min', 'max', 'average'];
        chai.request(server)
            .get('/stats')
            .query({
                stat: stats,
                metric: 'precipitation',
                fromDateTime: '2015-09-01T16:00:00.000Z',
                toDateTime: '2015-09-01T17:00:00.000Z'
            })
            .end( (err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.equal(0);

                done();
            });
    });

    it ('should get statistics for more than one metric', (done) => {
        const stats = ['min', 'max', 'average'];
        const metrics = ['temperature', 'dewPoint'];
        chai.request(server)
            .get('/stats')
            .query({
                stat: stats,
                metric: metrics,
                fromDateTime: '2015-09-01T16:00:00.000Z',
                toDateTime: '2015-09-01T17:00:00.000Z'
            })
            .end( (err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.equal(stats.length * metrics.length);

                res.body[0].metric.should.equal(metrics[0]);
                res.body[0].stat.should.equal(stats[0]);
                res.body[0].value.should.equal(27.1);

                res.body[1].metric.should.equal(metrics[0]);
                res.body[1].stat.should.equal(stats[1]);
                res.body[1].value.should.equal(27.5);

                res.body[2].metric.should.equal(metrics[0]);
                res.body[2].stat.should.equal(stats[2]);
                res.body[2].value.should.be.closeTo(27.3, 0.001);

                res.body[3].metric.should.equal(metrics[1]);
                res.body[3].stat.should.equal(stats[0]);
                res.body[3].value.should.be.equal(16.9);

                res.body[4].metric.should.equal(metrics[1]);
                res.body[4].stat.should.equal(stats[1]);
                res.body[4].value.should.be.equal(17.3);

                res.body[5].metric.should.equal(metrics[1]);
                res.body[5].stat.should.equal(stats[2]);
                res.body[5].value.should.be.closeTo(17.1, 0.01);

                done();
            });
    });

    it ('should return 500 when stat is not supported', (done) => {
        const stats = ['median'];
        const metrics = 'temperature';
        chai.request(server)
            .get('/stats')
            .query({
                stat: stats,
                metric: metrics,
                fromDateTime: '2015-09-01T16:00:00.000Z',
                toDateTime: '2015-09-01T17:00:00.000Z'
            })
            .end( (err, res) => {
                res.should.have.status(500);
                done();
            });
    });

    it ('should return 500 when date range is not supplied', (done) => {
        const stats = 'average';
        const metrics = 'temperature';
        chai.request(server)
            .get('/stats')
            .query({
                stat: stats,
                metric: metrics,
            })
            .end( (err, res) => {
                res.should.have.status(500);
                done();
            });
    });

    it ('should return 500 when stat is not supplied', (done) => {
        const metrics = 'temperature';
        chai.request(server)
            .get('/stats')
            .query({
                metric: metrics,
                fromDateTime: '2015-09-01T16:00:00.000Z',
                toDateTime: '2015-09-01T17:00:00.000Z'
            })
            .end( (err, res) => {
                res.should.have.status(500);
                done();
            });
    });

    it ('should return 500 when metric is not supplied', (done) => {
        chai.request(server)
            .get('/stats')
            .query({
                stat: 'average',
                fromDateTime: '2015-09-01T16:00:00.000Z',
                toDateTime: '2015-09-01T17:00:00.000Z'
            })
            .end( (err, res) => {
                res.should.have.status(500);
                done();
            });
    });

});
