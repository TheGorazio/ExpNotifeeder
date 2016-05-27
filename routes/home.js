var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (!req.cookies.auth) {res.redirect('/auth');}
    getChannels();
    function getChannels() {
        request({
            url: 'http://85.30.249.228/backend/webapi/users/channels?offset=0&count=25&groupName="user"',
            method: 'GET',
            json: true,
            headers: {
                'cookie': req.cookies.auth
            }
        }, function(error, response, body) {
            console.log("chan body....\n" + JSON.stringify(body));
            if (!error && response.statusCode == 200) {
                res.render('home',
                    {
                        channels: body,
                        title : 'Your favorite channels'
                    });
            } else {
                res.render('home',
                    {
                        channels: [],
                        title : 'Your favorite channels'
                    });
            }
        });
    }
});

module.exports = router;
