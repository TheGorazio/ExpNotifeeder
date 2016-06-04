/**
 * Created by TheGorazio on 28.05.2016.
 */
$(window).ready(function() {
    var searchStep = 0;
    var $w = $(window);
    var wh = $w.height();
    var h = $('body').height();
    var sHeight = h - wh;
    var $loader = $('<div class="loader"></div>');
    var dom = $('.posts');
    var uploadState = false;
    var href = document.location.href.split('/');
    var id = href[href.length - 1];

    $(window).scroll(function() {
        var perc = Math.max(0, Math.min(1, $w.scrollTop() / sHeight));
        var posts = $('.post');
        if (perc == 1 && !uploadState && posts.length % 10 == 0) {
            uploadState = true;
            searchStep++;
            dom.append($loader);
            $.post('/channels/' + id, {
                id: id,
                step: searchStep
            }, function(data) {
                $loader.remove();
                renderPosts(data);
                uploadState = false;
                $w = $(window);
                wh = $w.height();
                h = $('body').height();
                sHeight = h - wh;
            });
        }
    });
});

function renderPosts(data) {
    var dom = $('.posts');
    var domPosts = [];
    var posts = data;

    for (var i = 0; i < posts.length; i++) {
        var post = $('<div class="post" id="'+ posts[i].id + '">' +
            '<h3 class="title">' + posts[i].name + '</h3>' +
            '<p class="text">' + posts[i].description + '</p>' +
            '<p class="date">' + new Date(post[i].creation_date).toDateString() + '</p>' +

            '</div>');
        if (checkPerms() == 'admin' || checkPerms() == 'moder')
            post.append($('<div class="btn delete-post" id="' + post.id + '"> Delete </div>'));
        domPosts.push(post);
    }
    dom.append(domPosts);
}

function checkPerms() {

    if ($('.edit-channel').isReady()) {
        return 'admin';
    }
}