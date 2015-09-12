var oauth = require("oauth"),
    http = require("http")
url = require('url'),
events = require('events'),
util = require('util');

var VERSION = '0.1.0';

function nodeobsidian(options) {
    var self = this;
    events.EventEmitter.call(self);
    
    var defaults = {
        request_token_url: 'https://www.obsidianportal.com/oauth/request_token',
        access_token_url: 'https://www.obsidianportal.com/oauth/access_token',
        authorize_url: 'https://www.obsidianportal.com/oauth/authorize',
        api_url: 'http://api.obsidianportal.com/v1',
        user_name: null,
        password: null,
        consumer_key: null,
        consumer_secret: null,
        access_token_callback_url: null,
        access_token: {
            token: '',
            secret: ''
        }
    }
    
    /* Properties */
    
    self.isconnected = null;
    self.token = {
        request: {
            token: '',
            secret: ''
        },
        access: {
            token: '',
            secret: ''
        },
        verifier: ''
    };
    self.options = _mergeOptions(options, defaults);
    
    /* end Properties */
    
    /* Public functions */
    
    self.destroy = function () {
        self.server.close();
    }
    
    self.api = {};
    
    self.api.user = {
        me: function (format, callback) {
            _api_get('/users/me', 'json', [], callback);
        },
        show: function (userid, format, callback) {
            _api_get('/users/' + userid, 'json', [], callback);
        }
    }
    
    self.api.campaign = {
        show: function (campaignid, format, callback) {
            _api_get('/campaigns/' + campaignid, 'json', [], callback);
        },
        characters: {
            list: function (campaignid, format, callback) {
                _api_get('/campaigns/' + campaignid + '/characters', 'json', [], callback);
            },
            show: function (campaignid, characterid, format, callback) {
                _api_get('/campaigns/' + campaignid + '/characters/' + characterid, 'json', [], callback);
            },
            create: function (campaignid, characterdata, format, callback) {
                _api_post('/campaigns/' + campaignid + '/characters', 'json', characterdata, callback);
            },
            update: function (campaignid, characterid, characterdata, format, callback) {
                _api_put('/campaigns/' + campaignid + '/characters/' + characterid, 'json', characterdata, callback);
            },
            delete: function (campaignid, characterid, format, callback) {
                _api_delete('/campaigns/' + campaignid + '/characters/' + characterid, 'json', callback);
            }
        },
        wikis: {
            list: function (campaignid, format, callback) {
                _api_get('/campaigns/' + campaignid + '/wikis', 'json', [], callback);
            },
            show: function (campaignid, wikiid, format, callback) {
                _api_get('/campaigns/' + campaignid + '/wikis/' + wikiid, 'json', [], callback);
            },
            create: function (campaignid, wikidata, format, callback) {
                _api_post('/campaigns/' + campaignid + '/wikis', 'json', wikidata, callback);
            },
            update: function (campaignid, wikiid, wikidata, format, callback) {
                _api_put('/campaigns/' + campaignid + '/wikis/' + wikiid, 'json', wikidata, callback);
            },
            delete: function (campaignid, wikiid, format, callback) {
                _api_delete('campaigns/' + campaignid + '/wikis/' + wikiid, 'json', callback);
            }
        }
    }
    
    
    self.api.dst = {
        list: function (format, callback) {
            _api_get('/dynamic_sheet_templates', 'json', [], callback);
        },
        show: function (dstid, format, callback) {
            _api_get('/dynamic_sheet_templates/' + dstid, 'json', [], callback);
        },
        update: function (dstid, dstdata, format, callback) {
            _api_put('/dynamic_sheet_templates/' + dstid, 'json', dstdata, callback);
        },
        submit: function (dstid, format, callback) {
            _api_put('/dynamic_sheet_templates/' + dstid + '/submit', 'json', {}, callback);
        }
    };
    
    self.connect = _initialize;
    
    /* end Public functions */
    
    
    /* Private functions */
    
    function _api_get(path, format, values, callback) {
        self.consumer.get(
            self.options.api_url + path + "." + format + "?" + (util.isArray(values) ? values.join('&') : values.toString()),
            self.token.access.token,
            self.token.access.secret,
            function (error, data) {
                if (error) {
                    console.error(error);
                    callback(error, null);
                } else {
                    callback(null, data);
                }
            }
        );
    }
    
    function _api_putOrPost(path, format, values, callback) {
        self.consumer.post(
            self.options.api_url + path + "." + format,
            self.token.access.token,
            self.token.access.secret,
            values,
            function (error, data) {
                if (error) {
                    console.error(error);
                    callback(error, null);
                } else {
                    callback(null, data);
                }
            }
        );
    }
    
    function _api_delete(path, format, callback) {
        self.consumer.get(
            self.options.api_url + path + "." + format,
            self.token.access.token,
            self.token.access.secret,
            function (error, data) {
                if (error) {
                    console.error(error);
                    callback(error, false);
                } else {
                    callback(null, true);
                }
            }
        );
    }
    
    function _getUser(initializing, format) {
        
        _api_get('/users/me', 'json', [], function (err, data) {
            if (initializing) {
                if (err) { self.isconnected = false; } else { self.isconnected = true; }
                self.emit("AfterInitialize");
            }
        });
    }
    
    function _initializeConsumer() {
        self.consumer = new oauth.OAuth(
            self.options.request_token_url, self.options.access_token_url,
            self.options.consumer_key, self.options.consumer_secret, "1.0", self.options.access_token_callback_url, "HMAC-SHA1");
    }
    
    function _getRequestToken(callback) {
        _initializeConsumer();
        
        self.consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
            if (error) {
                console.log(error);
            } else {
                self.token.request.token = oauthToken;
                self.token.request.secret = oauthTokenSecret;
                callback();
            }
        });
    }
    
    function _authorizeToken(callback) {
        self.emit("UserAuthorizationReady");
    }
    
    function _getAuthorizeToken(callback) {
        self.consumer.getOAuthAccessToken(self.token.request.token, self.token.request.secret, self.token.verifier, function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
            
            if (error) {
                console.log(error);
            } else {
                self.token.access.token = oauthAccessToken;
                self.token.access.secret = oauthAccessTokenSecret;
                callback();
            }
        });
    }
    
    function _mergeOptions(options, defaults) {
        defaults = defaults || {};
        if (options && typeof options === 'object') {
            var keys = Object.keys(options);
            for (var i = 0, len = keys.length; i < len; i++) {
                var k = keys[i];
                if (options[k] !== undefined) defaults[k] = options[k];
            }
        }
        return defaults;
    }
    
    function _initConnection() {
        if (self.token.access.token !== "" && self.token.access.secret !== "") {
            // we need to make sure token is still valid.
            _getUser(true);
        } else {
            // generate new token
            _getRequestToken(function () {
                _authorizeToken(function () {
                });
            });
        }
    }
    
    function _initCallbackServer() {
        self.server = http.createServer(function (request, response) {
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end("Hello World\n");
            
            var queryData = url.parse(request.url, true).query;
            
            if (queryData.oauth_verifier) {
                self.token.verifier = queryData.oauth_verifier;
                
                self.emit("AfterOAuthCallback");
                
                _getAuthorizeToken(function () {
                    self.token.verifier = "";
                    self.token.request.token = "";
                    self.token.request.secret = "";
                    
                    self.emit("AfterAccessToken", { token: self.token });
                    
                    _initConnection();
                });
            }
        });
        
        self.server.listen(0);
        
        self.server.on('listening', function () {
            var port = self.server.address().port;
            
            self.options.access_token_callback_url = "http://localhost:" + port + "/OAuthRedirect.aspx";
            _initializeConsumer();
            _initConnection();
        });
    }
    
    function _dnslookup(domain, timeout, callback) {
        var callbackCalled = false;
        var doCallback = function (err, domains) {
            if (callbackCalled) return;
            callbackCalled = true;
            callback(err, domains);
        };
        
        setTimeout(function () {
            doCallback(new Error("Timeout exceeded"), null);
        }, timeout);
        
        require('dns').resolve(domain, doCallback);
    }
    
    function _initialize() {
        if (self.options.consumer_key == null) {
            throw new Error("Consumer Key not entered.");
        }
        if (self.options.consumer_secret == null) {
            throw new Error("Consumer Secret not entered.");
        }
        self.token.access = self.options.access_token
        
        _dnslookup('www.obsidianportal.com', 30000, function (err) {
            if (err) {
                // offline mode
                self.isconnected = false;
                self.emit("AfterInitialize");
            } else {
                // online mode
                _initCallbackServer();
            }
        });
    }
    
    /* end Private functions */
    
    /* Testing functions */    
    if (process.env.NODE_ENV == "testing") {
        self._testing = {
            intialize: _initialize,
            initializeCallbackServer: _initCallbackServer,
            getRequestToken: _getRequestToken
        };
    
    }
    /* end Testing functions */
    
    if (process.env.NODE_ENV !== "testing") {
        _initialize();
    }
}
require("util").inherits(nodeobsidian, events.EventEmitter);

nodeobsidian.VERSION = VERSION;
module.exports = nodeobsidian;
