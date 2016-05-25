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
        document.location.href = '/channels/' + getId() + '/edit';
    });

    $('.add-post').on('click', function(e) {
        console.log('adding new post...');
        $('.add-post-form').slideToggle(420);
        document.getElementsByClassName('channel-outer')[0].scrollTop = 9999;
    });

    $('.delete-post').on('click', function(e) {
        var id = $(this).attr('id');
        $.post('/channels/delpost', {
            channel: getId(),
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
            $.post('/channels/subscribe', {channel: getId()},
                function(data) {
                    console.log(data)
                });
        } else {
            $.post('/channels/unsubscribe', {channel: getId()},
                function(data) {
                    console.log(data)
                });
            $(this).text('Subscribe');
        }
        $(this).toggleClass("subscribed");
    });

    $('.search-btn').on('click', function(e) {
        $.get('/channels/search', {
            name: $('#search').val()
        }, function(data) {
            console.log(data);
        });
    });

});

function getId() {
    var href = document.location.href;
    console.log('href - ' + href);
    var temp = href.split("?")[0].split("/");
    console.log('temp - ' + temp);

    return temp[temp.length - 1];
}