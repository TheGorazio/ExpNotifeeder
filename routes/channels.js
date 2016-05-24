var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
    res.redirect('/home');
});
router.post('/newpost/:id', function(req, res, next) {
    console.log('newpost');
    request({
        url: 'http://85.30.249.228/backend/webapi/channels/' + req.params.id + '/posts',
        method: 'POST',
        body: {
            title: req.body.title,
            text: req.body.text
        },
        headers: {
            'cookie': req.cookies.auth
        },
        json: true
    }, function(error, response, body) {
        if (!error) {
            res.redirect('/channels/' + req.params.id);
        } else {
            res.write('error');
            res.end();
        }
    })
});
router.get('/:id/edit', function(req, res, next) {
    if (isNaN(req.params.id)) next();

    request({
        url: 'http://85.30.249.228/backend/webapi/channels/' + req.params.id,
        method: 'GET',
        headers: {
            'cookie': req.cookies.auth
        },
        json: true
    }, function(error,response,body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            res.render('edit-channel', {channel: body});
        } else {
            res.status(404);
            res.end();
        }
    });
});
router.post('/:id/edit', function(req, res, next) {
    console.log("BODY: " + JSON.stringify(req.body));
    request({
        url: 'http://85.30.249.228/backend/webapi/users/channels',
        method: 'PUT',
        headers: {
            'cookie': req.cookies.auth
        },
        body: {
            'id': req.params.id,
            'name': req.body.name,
            'description': req.body.description,
            'icon': '',
            'tagList': []
        },
        json: true
    }, function(error,response,body) {
        if (!error && response.statusCode == 200) {
            res.redirect('/channels/' + req.body.id);
        } else {
            console.log("ERROR WHEN EDITING");
            console.error(error);
            res.status(404);
            res.end();
        }
    });
});

router.get('/:id', function(req, res, next) {
    if (isNaN(req.params.id)) next();

    console.log('CHANNEL ID = ' + req.params.id);
    if (req.params.id > 0) {
        console.log('Channel search...');
        var posts;

        request({
            url: 'http://85.30.249.228/backend/webapi/channels/' + req.params.id + '/posts?offset=0&count=10',
            method: 'GET',
            headers: {
                'cookie': req.cookies.auth
            },
            json: true
        }, function(error, response, body) {
            console.log(body);
            if (!error && response.statusCode == 200) {
                console.log("POSTS: " + body);
                posts = body;
                findChannel();
            } else {
                console.log("POSTS ERROR: " + error);
            }
        });
        function findChannel() {
            request({
                url: 'http://85.30.249.228/backend/webapi/channels/' + req.params.id,
                method: 'GET',
                headers: {
                    'cookie': req.cookies.auth
                },
                json: true
            }, function (error, response, body) {
                console.log(body);
                if (!error && response.statusCode == 200) {
                    console.log("CHANNEL: " + body);
                    res.render('channel',
                        {
                            channel: body,
                            error: '',
                            posts: posts
                        });
                } else {
                    console.log("CHANNEL ERROR: " + error);
                    res.render('channel',
                        {
                            channel: '',
                            error: 'Channel not found'
                        });
                }
            });
        }
    } else {

    }
});
router.post('/new', function(req, res, next) {
   request({
       url: 'http://85.30.249.228/backend/webapi/users/channels',
       method: 'POST',
       body: {
           name: req.body.name,
           description: req.body.description,
           icon : '',
           tagList: []
       },
       headers: {
           'cookie': req.cookies.auth
       },
       json: true
   }, function(error, response, body)  {

       if (!error) {
           console.log("" + JSON.stringify(body));
           res.redirect('/channels/' + body.id);
       } else {
            console.error(error);
       }
   });
});

module.exports = router;