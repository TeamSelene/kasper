"use strict";

const request = require('supertest');
let app = require('../server');

describe('API', () => {
    describe('Integration Tests', () => {
        describe('GET /api/images/', () => {
            it('should use charset UTF-8', (done) => {
                request(app)
                    .get('/api/images')
                    .set('Accept-Charset', 'utf-8')
                    .expect('Content-Type', /charset\=(utf|UTF)\-8/)
                    .expect(200, done);
            });

            it('should return application/json', (done) => {
                request(app)
                    .get('/api/images')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(200, done);
            });
        });

        describe('GET /api/image/:id/:in', () => {
            const id = "58c6923bff2dcd3dd1239367";
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
