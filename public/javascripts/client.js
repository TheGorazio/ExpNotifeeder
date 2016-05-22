$(document).ready(function(){
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
    $('#savePost').on('click', function(e) {
        $.post("http://85.30.249.228/backend/webapi/channels/" + getId() + "/posts", {
            title: $('.title').value,
            text: $('.text').value
        }).success(function() {
            console.log("Success");
        });
        alert(id);
    })
});

function getId() {
    var href = document.location.href;
    console.log('href - ' + href);
    var temp = href.split("?")[0].split("/");
    console.log('temp - ' + temp);

    return temp[temp.length - 1];
}