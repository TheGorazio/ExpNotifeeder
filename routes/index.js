var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    var cookie = req.cookies.auth;



    res.redirect('/auth');
});

module.exports = router;
