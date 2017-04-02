"use strict";

const expect = require('chai').expect;

describe('Math', () => {
    describe('#abs()', () => {
        it('should return positive value of given negative number', () => {
            expect(Math.abs(-5)).to.be.equal(5);
        });

        it('should return positive value of given positive number', () => {
            expect(Math.abs(3)).to.be.equal(3);
        });

        it('should return 0 given 0', () => {
            expect(Math.abs(0)).to.be.equal(0);
        });
    });

    describe('#sqrt()', () => {
        it('should return the square root of a given positive number', () => {
            expect(Math.sqrt(25)).to.be.equal(5);
        });

        it('should return NaN for a given negative number', () => {
            expect(Math.sqrt(-9)).to.be.NaN;
        });

        it('should return 0 given 0', () => {
            expect(Math.sqrt(0)).to.be.equal(0);
        });
    });
});
