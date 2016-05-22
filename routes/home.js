var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (!req.cookies.auth) {res.status(400); res.end();}
    getChannels();
    function getChannels() {
        request({
            url: 'http://85.30.249.228/backend/webapi/channels?offset=0&count=25&channelName=',
            method: 'GET',
            json: true,
            headers: {
                'cookie': req.cookies.auth
            }
        }, function(error, response, body) {
            if (!error) {
                res.render('home',
                    {
                        channels: body
                    });
            } else {
                res.render('home',
                    {
                        channels: []
                    });
            }
        });
    }
});

module.exports = router;
