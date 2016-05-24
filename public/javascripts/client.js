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
        $('.add-post-form').toggleClass('hide');
    });
});

function getId() {
    var href = document.location.href;
    console.log('href - ' + href);
    var temp = href.split("?")[0].split("/");
    console.log('temp - ' + temp);

    return temp[temp.length - 1];
}