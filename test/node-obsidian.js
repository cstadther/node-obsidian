var assert = require('assert');
var noapi = require('../lib/index.js');
process.env.NODE_ENV = "testing";





describe('Initialization', function () { 
    it('Must pass in consumer key.', function () {
        assert.throws(function () { var no = new noapi({ consumer_secret: "abc" }); }, "error");
    });
    it('Must pass in consumer secret.', function () {
        assert.throws(function () { var no = new noapi({ consumer_key: "abc" }); }, "error");
    });

});


describe('Initialize API', function () {
    var no = new noapi({
        consumer_key : 'I14KxZDy4y9xVB4rShFq',
        consumer_secret : 'eq99fCkIfcUyfEHs0XCIIRQDK3XY6Y6jQhmsXJCg'
    });

    it('Initialize', function () {
        assert.ok(typeof no !== "undefined", "Error");
    });
    
    it('Start OAuth Callback Server', function () {
        no._testing.initializeCallbackServer();

        no.server.on('listening', function () { 
            assert(true);
        })
    });

    it('Generate Request Token', function () {
        no._testing.getRequestToken(function () { 
            assert.ok(no.token.request.token !== '' && no.token.request.secret !== '', 'error');
        });
    });

});
