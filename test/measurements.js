const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);


describe('Measurements', () => {

    describe('/POST measurements', () => {

        it('should write the measurement when valid', (done) => {
            const measurement = {
                timestamp: "2017-02-07T15:42:14.373Z",
                temperature: 22.4,
                dewPoint: 18.6,
                precipitation: 142.2
            };
            chai.request(server)
                .post('/measurements')
                .send(measurement)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                });
            done();
        });
    });
});