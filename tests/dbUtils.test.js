import dbUtils from '@data/dbUtils';

describe('first test', () => {
  it('should return an object', () => {
    expect(typeof(dbUtils)).toBe(typeof({}))
  });
})
