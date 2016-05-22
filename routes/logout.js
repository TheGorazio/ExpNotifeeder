/**
 * Created by TheGorazio on 23.05.2016.
 */

var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
    res.clearCookie('auth');
    request({
        url: 'http://85.30.249.228/backend/webapi/auth/logout',
        method: 'GET',
        json: true
    }, function(error, response, body) {
        res.redirect('/auth');
    })
});

module.exports = router;