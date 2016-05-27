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
        json: true,
        encoding: null
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
        json: true,
        encoding: null
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
        json: true,
        encoding: null
    }, function(error,response,body) {
        if (!error && response.statusCode == 200) {
            res.redirect('/channels/' + req.params.id);
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
router.get('/new', function(req, res, next) {
    res.render('new-channel');
    res.end();
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
router.post('/delete', function(req, res, next) {
    request({
        url: 'http://85.30.249.228/backend/webapi/users/channels/' + req.body.channel,
        method: 'DELETE',
        headers: {
            'cookie': req.cookies.auth
        },
        json: true
    }, function(error, response, body)  {

        if (!error && response.statusCode == 200) {
            res.status(200);
            res.write(""+body);
            res.end();
        } else {
            res.status(500);
            res.write(error);
            res.end();
        }
    });
});
router.post('/subscribe', function(req, res, next) {
   console.log('subscribing.... ' + req.body.channel);
    request({
        url: 'http://85.30.249.228/backend/webapi/channels/' + req.body.channel,
        method: 'PUT',
        headers: {
            'cookie': req.cookies.auth
        },
        json: true
    }, function(error, response, body) {
        console.log('sub body -- \n' + JSON.stringify(body));
        if (!error && response.statusCode == 200) {
            res.status(200);
            res.write('Subscribe');
            res.end();
        } else {
            res.status(500);
            res.write('You can not subscribe this channel');
            res.end();
        }
    })
});

router.post('/unsubscribe', function(req, res, next) {
    console.log('unsubscribing.... ' + req.body.channel);
    request({
        url: 'http://85.30.249.228/backend/webapi/users/channels/' + req.body.channel,
        method: 'DELETE',
        headers: {
            'cookie': req.cookies.auth
        },
        json: true
    }, function(error, response, body) {
        console.log('sub body -- \n' + JSON.stringify(body));
        if (!error && response.statusCode == 200) {
            res.status(200);
            res.write('Unsubscribe success');
            res.end();
        } else {
            res.status(500);
            res.write('You can not unsubscribe this channel');
            res.end();
        }
    })
});
router.post('/castuser', function(req, res, next) {
    request({
        url: 'http://85.30.249.228/backend/webapi/users/channels/' + req.body.channel,
        method: 'PUT',
        headers: {
            'cookie': req.cookies.auth
        },
        body: {
            'email': req.body.user
        },
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.status(200);
            res.write('User casted');
            res.end();
        } else {
            res.status(500);
            res.write('error');
            res.end();
        }
    })
});
router.get('/work', function(req, res, next) {
    if (!req.cookies.auth) {res.redirect('/auth');}
    getChannels();
    function getChannels() {
        request({
            url: 'http://85.30.249.228/backend/webapi/users/channels/?offset=0&count=20&groupName=adminmoder',
            method: 'GET',
            json: true,
            headers: {
                'cookie': req.cookies.auth
            },
            encoding: null
        }, function(error, response, body) {
            console.log(body);
            if (!error && response.statusCode == 200) {
                var channels = [];
                console.log('start cycle');
                for (var i = 0; i < body.length; i++) {
                    console.log('step['+i+'] - ' + JSON.stringify(body[i]) + '\n');
                    if (body[i].group == 'admin' || body[i].group == 'moder') channels.push(body[i]);
                }
                res.render('home',
                    {
                        channels: channels,
                        title: 'Your work channels'
                    });
            } else {
                res.render('home',
                    {
                        channels: [],
                        title: 'Your work channels'
                    });
            }
        });
    }
});

router.post('/delpost', function(req, res, next) {
    console.log('deleting post');
    request({
         url: 'http://85.30.249.228/backend/webapi/channels/' + req.body.channel + '/posts/' + req.body.postid,
         method: 'DELETE',
         headers: {
            'cookie': req.cookies.auth
        },
        json: true
    }, function(error, response, body) {
        console.log(body);
        if (!error && response.statusCode == 200) {
            res.status(200);
            res.end();
        } else {
            res.status(500);
            res.end();
        }
    })
});
router.post('/delete', function(req, res, next) {
    console.log('deleting channel ' + req.body.channel);
    request({
        url: 'http://85.30.249.228/backend/webapi/channels/' + req.body.channel,
        method: 'DELETE',
        headers: {
            'cookie': req.cookies.auth
        },
        json: true
    }, function(error, response, body) {
        console.log(body);
        if (!error && response.statusCode == 200) {
            res.status(200);
            res.end();
        } else {
            res.status(500);
            res.end();
        }
    })
});
router.post('/search', function(req, res, next) {
    console.log(JSON.stringify(req.body.name));
    request({
        url: 'http://85.30.249.228/backend/webapi/channels?offset=0&count=20&channelName=' + req.body.name,
        method: 'GET',
        headers: {
            'cookie': req.cookies.auth
        },
        json: true,
        encoding: null
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('body -');
            console.log(body);
            res.write(JSON.stringify(body));
            res.end();
        } else {
            res.write('error');
            res.end();
        }
    })
});
module.exports = router;