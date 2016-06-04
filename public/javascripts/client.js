$(document).ready(function(){
    var searchStep = 0;
    var $w;
    var wh;
    var h;
    var sHeight;
    var $loader = $('<div class="loader"></div>');


    $('#confirm-pass').on('keyup', function(e) {
        if ($('#pass').val() === $(this).val()) {
            $('#reg-btn').prop('disabled', false);
        } else {
            $('#reg-btn').prop('disabled', true);
        }
    });

    $('.channel').click(function(e) {
        var id = $(this).attr('id');
        document.location.href = '/channels/' + id;
    });

    $('.new-channel').on('click', function(e) {
        document.location.href = '/channels/new';
    });
    $('.edit-channel').on('click', function(e) {
        document.location.href = '/channels/' + getId(1) + '/edit';
    });
    $('.delete-channel').on('click', function(e) {
        $.post('/channels/delete',{
            channel: getId(2)
        }, function(data) {
            document.location.href = '/channels';
        });
    });
    $('.add-post').on('click', function(e) {
        $('.add-post-form').slideToggle(420);
        document.getElementsByClassName('channel-outer')[0].scrollTop = 9999;
    });

    $('.delete-post').on('click', function(e) {
        var id = $(this).attr('id');
        $.post('/channels/delpost', {
            channel: getId(1),
            postid: id
        },
            function(data) {
                $('.post#' + id).slideUp(420);
            });
    });

    $('.subscribe.subscribed').text('');
    $('.subscribe').on('click', function() {
        if (!$(this).hasClass('subscribed')) {
            $(this).text('');
            $.post('/channels/subscribe', {channel: getId(1)},
                function(data) {});
        } else {
            $.post('/channels/unsubscribe', {channel: getId(1)},
                function(data) {});
            $(this).text('Subscribe');
        }
        $(this).toggleClass("subscribed");
    });

    $('.btn.search-btn').on('click', function(e) {
        var uploadState = false;
        var dom = $('.channels');
        dom.empty();
        dom.append($loader);
        $.post('/channels/search', {
            name: $('#search').val(),
            step: searchStep
        }, function(data) {
            dom.empty();
            renderChannels(JSON.parse(data));

            $w = $(window);
            wh = $w.height();
            h = $('body').height();
            sHeight = h - wh;
            $(window).scroll(function(e) {
                var perc = Math.max(0, Math.min(1, $w.scrollTop() / sHeight));

                if (perc == 1 && !uploadState) {
                    uploadState = true;
                    searchStep++;
                    dom.append($loader);
                    $.post('/channels/search', {
                        name: $('#search').val(),
                        step: searchStep
                    }, function(data) {
                        $loader.remove();
                        renderChannels(JSON.parse(data));
                        uploadState = false;
                        $w = $(window);
                        wh = $w.height();
                        h = $('body').height();
                        sHeight = h - wh;
                    });
                }
            });

        });
    });

    $('.btn.delete-channel').on('click', function(e) {
        $.post('/channels/delete', {
            channel: getId(2)
        }, function(data) {
            document.location.href = '/channels/';
        });

    });

    $('.cast-user').on('click', function() {
        var email = $('#moder-email');
        $.post('/channels/castuser', {
            channel: getId(2),
            user: email.val()
        }).done(function(data) {
            email.removeClass('decline');
            email.addClass('success');
        }).fail(function(data) {
            email.removeClass('success');
            email.addClass('decline');
        });
    });
});

function getId(n) {
    var href = document.location.href;
    var temp = href.split("?")[0].split("/");
    return temp[temp.length - n];
}

function renderChannels(data) {
    var dom = $('.channels');
    var domChannels = [];
    var channels = data;

    for (var i = 0; i < channels.length; i++) {
        var channel = $('<div class="channel" id="'+ channels[i].id + '">' +
            '<h2 class="title">' + channels[i].name + '</h2>' +
            '<p class="text">' + channels[i].description + '</p>' +
            '</div>');

        domChannels.push(channel);
    }

    dom.append(domChannels);
    $('.channel').click(function(e) {
        var id = $(this).attr('id');
        document.location.href = '/channels/' + id;
    });
}