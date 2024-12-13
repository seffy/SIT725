const chai = require('chai');
const expect = chai.expect;

describe('Array', function () {
    it('should start empty', function () {
        const arr = [];
        expect(arr).to.be.an('array').that.is.empty;
    });
});