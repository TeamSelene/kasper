"use strict";

const request = require('supertest');
const expect = require('chai').expect;
let app = require('../server');

describe('API', () => {
    describe('Unit Tests', () => {
        describe('GET /api/points/', () => {
            // 2764 octets of json + 23 octets of metadata
            const octets = 2787;
            it(`should be ${octets} octets big`, (done) => {
                request(app)
                    .get('/api/points')
                    .set('Accept-Charset', 'utf-8')
                    .set('Accept', 'application/json')
                    .expect('Content-Length', octets.toString(10))
                    .expect(200, done);
            });
            it('should have property \'error\'', () => {
                return request(app)
                    .get('/api/points')
                    .set('Accept-Charset', 'utf-8')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.have.property('error');
                    });
            });
            it('should have property \'Points\'', () => {
                return request(app)
                    .get('/api/points')
                    .set('Accept-Charset', 'utf-8')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.have.property('error', 0);
                        expect(resp.body).to.have.property('Points');
                    });
            });

            describe("#Points", () => {
                it('should be an array', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body.Points).to.be.an('array');
                        });
                });
                it('should not be empty', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body.Points).to.not.be.empty;
                        });
                });
            });
            describe("#Points[0]", () => {
                it('should have property \'_id\'', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body).to.have.deep.property('Points[0]._id', "58ad1e5fff2dcd0ecd984a8e");
                        });
                });
                it('should have property \'pts\'', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body).to.have.deep.property('Points[0].pts');
                        });
                });
            });
            describe("#Points[0].pts", () => {
                it('should be an array', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body.Points[0].pts).to.be.an('array');
                        });
                });
                it('should not be empty', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body.Points[0].pts).to.not.be.empty;
                        });
                });
                it('should have length at most 39', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body.Points[0].pts).to.have.length.most(39);
                        });
                });
            });
            describe("#Points[0].pts[0]", () => {
                it('should have property \'loc\'', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body).to.have.deep.property('Points[0].pts[0].loc');
                        });
                });
            });
            describe("#Points[0].pts[0].loc", () => {
                it('should have property \'coordinates\'', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body).to.have.deep.property('Points[0].pts[0].loc.coordinates');
                        });
                });
                it('should have property \'type\' equal to "Points"', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body).to.have.deep.property('Points[0].pts[0].loc.type', "Point");
                        });
                });
            });
            describe("#Points[0].pts[0].loc.coordinates", () => {
                it('should be an array', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body.Points[0].pts[0].loc.coordinates).to.be.an('array');
                        });
                });
                it('should have length of exactly 2', () => {
                    return request(app)
                        .get('/api/points')
                        .set('Accept-Charset', 'utf-8')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.have.property('error', 0);
                            expect(resp.body.Points[0].pts[0].loc.coordinates).to.have.lengthOf(2);
                        });
                });
            });
        });

        describe('GET /api/image/:id/:in', () => {
            const id = "58da235eff2dcd035160cda8";
            const index = 0;
            const octets = 2903;

            it(`should be ${octets} octets big`, (done) => {
                request(app)
                    .get(`/api/image/${id}/${index}`)
                    .set('Accept-Charset', 'utf-8')
                    .set('Accept', 'application/json')
                    .expect('Content-Length', octets.toString(10))
                    .expect(200, done);
            })
        })
    });

    describe('Integration Tests', () => {
        describe('GET /api/points/', () => {
            it('should use charset UTF-8', (done) => {
                request(app)
                    .get('/api/points')
                    .set('Accept-Charset', 'utf-8')
                    .expect('Content-Type', /charset\=(utf|UTF)\-8/)
                    .expect(200, done);
            });

            it('should return application/json', (done) => {
                request(app)
                    .get('/api/points')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(200, done);
            });
        });

        describe('GET /api/image/:id/:in', () => {
            const id = "58da235eff2dcd035160cda8";
            const index = 0;

            it('should use charset UTF-8', (done) => {
                request(app)
                    .get(`/api/image/${id}/${index}`)
                    .set('Accept-Charset', 'utf-8')
                    .expect('Content-Type', /charset\=(utf|UTF)\-8/)
                    .expect(200, done);
            });

            it('should return application/json', (done) => {
                request(app)
                    .get(`/api/image/${id}/${index}`)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(200, done);
            });
        });
    });
});
