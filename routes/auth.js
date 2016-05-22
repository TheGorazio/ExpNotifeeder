/**
 * Created by TheGorazio on 20.05.2016.
 */

var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
    if (req.cookies.auth) res.redirect('/home');
    res.render('auth', {title: 'Authentication',
                        my_err: ''});

});

router.post('/', function(req, res, next) {

    console.log(req.body.email + "/" + req.body.password);
    request({
        url: 'http://85.30.249.228/backend/webapi/auth/login',
        method: 'POST',
        body: {
            email: req.body.email,
            password: req.body.password
        },
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("LOGGED IN");
            console.log(body);
            res.cookie('auth',response.headers['set-cookie']);
            res.redirect('/home');
        } else {
            res.render('auth', {title: 'Authentication',
                error: 'Invalid email/password'});
        }

    });

});


module.exports = router;
