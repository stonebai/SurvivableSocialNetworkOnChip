/**
 * Created by baishi on 4/19/16.
 */
var RequestStatistic = require('../src/utils/RequestRecord');

describe('Test record to file function', function() {
    it('test not find', function(done) {
        var record = {};
        record.date = 'Date4Test';
        record.type = 'Type4Test';
        RequestStatistic.recordToFile(record);
        done();
    });
});

describe('Test record to file function', function() {
    before(function(done) {
        RequestStatistic.create({
            date: 'Date4Test',
            type: 'Type4Test',
            count: 1
        }).then(function() {
            done();
        });
    });

    it('test find', function(done) {
        var record = {};
        record.date = 'Date4Test';
        record.type = 'Type4Test';
        RequestStatistic.recordToFile(record);
        done();
    });

    after(function(done) {
        RequestStatistic.destroy({
            where: {
                date: 'Date4Test'
            }
        }).then(function() {
            done();
        });
    });
});

describe('Test record function', function() {
    it('test success', function(done) {
        var req = {};
        req.baseUrl = 'BaseUrl4Test';
        RequestStatistic.record(req, {}, done);
    });

    after(function(done) {
        RequestStatistic.destroy({
            where: {
                type: 'BaseUrl4Test'
            }
        }).then(function() {
            done();
        });
    });
});