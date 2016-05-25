$(document).ready(function(){
    var sub_state = false

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
        $('.add-post-form').toggleClass('hide');
    });

    $('.subscribe').on('click', function(e) {
        sub_state = !sub_state;
        console.log("klac " + sub_state);
        if (sub_state) {
            $(this).text('');
        } else {
            $(this).text('Subscribe');
        }
        $(this).toggleClass("subscribed");
    })
});

function getId() {
    var href = document.location.href;
    console.log('href - ' + href);
    var temp = href.split("?")[0].split("/");
    console.log('temp - ' + temp);

    return temp[temp.length - 1];
}