var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/', function(req, res, next) {
    request({
        url: 'http://85.30.249.228/backend/webapi/channels/' + req.params.id + '/posts',
        method: 'POST',
        headers: {
            'cookie': req.cookies.auth
        },
        body: {
            title: req.body.title,
            text: req.body.text
        },
        json: true
    }, function(error, response, body) {
        console.log(body);
        if (!error && response.statusCode == 200) {
            console.log('POST SUCCESSFULLY ADDED');
        } else {
            console.log("POSTS ERROR: " + error);
        }
    });
});