$(function() {
    localStorage.clear()

    $.ajaxSetup({
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });

    $('.go-to-registration, .go-to-login').on('click', function() {
        $('#authorization-registration').toggle();
        $('#authorization-login').toggle();
    })


    $('#sign-in').on('click', function() {
        const formData = new FormData($('#login-form')[0]);

        const body = Object.fromEntries(formData);
        $.post('api/auth/login', JSON.stringify(body), function(callback) {
            localStorage.setItem('token', callback.token);
            localStorage.setItem('refreshToken', callback.refreshToken);

            window.location.assign('main.html') //callback.redirect_uri
        }).fail(function(error) {
            alert(error.responseJSON.validationErrors.errors.map((err, k) => {return err.msg}).join('\n'));
        })
    })

    $('#sign-up').on('click', function() {
        const formData = new FormData($('#registration-form')[0]);

        const body = Object.fromEntries(formData);
        if(body["password"] == body["confirm-password"]) {
            $.post('api/auth/registration', JSON.stringify(body), function(callback) {
                alert("Confirm your account and login")
            }).fail(function(error) {
                alert(error.responseJSON.validationErrors.errors.map((err, k) => {return err.msg}).join('\n'));
            })
        }
        else
            alert("The password must match the confirm password")
    })

    // $('#dialog').dialog({
    //     resizable: false,
    //   height: "auto",
    //   width: 400,
    //   modal: true,
    //   draggable: false,
    //   buttons: {
    //     "Delete all items": function() {
    //       $( this ).dialog( "close" );
    //     },
    //     Cancel: function() {
    //       $( this ).dialog( "close" );
    //     }
    //   }
    // })
})
