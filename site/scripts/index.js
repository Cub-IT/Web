

$(function() {

    $('.go-to-registration, .go-to-login').on('click', function() {
        $('#authorization-registration').toggle();
        $('#authorization-login').toggle();
    })


    $('#sign-in').on('click', function() {
        const formData = new FormData($('#login-form')[0]);

        const body = Object.fromEntries(formData);
        $.post('api/auth/login', JSON.stringify(body), function(callback) {
            alert(callback.status)
        }).fail(function(error) {
            alert(error.responseJSON.message);
        })
    })

    $('#sign-up').on('click', function() {
        const formData = new FormData($('#registration-form')[0]);

        const body = Object.fromEntries(formData);
        if(body["password"] == body["confirm-password"]) {
            $.post('api/auth/registration', JSON.stringify(body), function(callback) {
                alert(callback.status)
            }).fail(function(error) {
                alert(error.responseJSON.message);
            })
        }
    })
})
