"use strict";

const request = require('supertest');
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
