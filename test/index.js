import assert from 'assert';

describe('Test', () => {
    it('should work', () => {
        assert.isTrue(true);
    });
});


describe('returnFirstArgument', () => {
    it('must return same value', ()=>{
        assert.equal(returnFirstArgument(5), 5);
    });
});