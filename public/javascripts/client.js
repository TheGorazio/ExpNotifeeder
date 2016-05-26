$(document).ready(function(){

    $('#confirm-pass').on('keyup', function(e) {
        console.log(e.target.value + ' --- ' + $('#pass').val());
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
        console.log('adding new post...');
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
                function(data) {
                    console.log(data)
                });
        } else {
            $.post('/channels/unsubscribe', {channel: getId(1)},
                function(data) {
                    console.log(data)
                });
            $(this).text('Subscribe');
        }
        $(this).toggleClass("subscribed");
    });

    $('.btn.search-btn').on('click', function(e) {
        var dom = $('.channels');
        dom.append($('<div class="loader"></div>'));
        $.post('/channels/search', {
            name: $('#search').val()
        }, function(data) {
            var channels = JSON.parse(data);

            var domChannels = [];
            dom.empty();
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

        });
    });

    $('.btn.delete-channel').on('click', function(e) {
        $.post('/channels/delete', {
            channel: getId(2)
        }, function(data) {
            document.location.href = '/channels/';
        });

    });

});

function getId(n) {
    var href = document.location.href;
    console.log('href - ' + href);
    var temp = href.split("?")[0].split("/");
    console.log('temp - ' + temp);

    return temp[temp.length - n];
}