import { chai } from 'meteor/practicalmeteor:chai';

describe('server test', function() {
  it('passes', function() {
    chai.assert.isTrue(true);
  });
  it('doesntpass', function() {
    chai.assert.isTrue(false);
  });
});