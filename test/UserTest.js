/**
 * Created by baishi on 2/24/16.
 */
var expect = require('expect.js');
var User = require('../src/models/user');

suite('User testing', function() {

    test('valid input', function(done) {
        var user = new User();
        var result = user.checkValidation('stone', '1234');
        expect(true).to.eql(result.register);
        done();
    });

    test('short username', function(done) {
        var user = new User();
        var result = user.checkValidation('ab', '1234');
        expect(user.SHORTNAME).to.eql(result);
        done();
    });

    test('short password', function(done) {
        var user = new User();
        var result = user.checkValidation('abc', '123');
        expect(user.SHORTPASSWORD).to.eql(result);
        done();
    });

    test('illegal username', function(done) {
        var user = new User();
        var result = user.checkValidation('javascript', '1234');
        expect(user.ILLEGALNAME).to.eql(result);
        done();
    });
});