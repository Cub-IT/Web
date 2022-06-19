$(function(){


    if(/*localStorage.getItem('token') &&*/ localStorage.getItem('userId')) {
        window.location.replace("main.html");
    }

    $('.switch-auth-mode').on('click', function() {
        $('.auth-mode').toggleClass('d-none');
    })

    $('#loginForm').on('submit', function(event) {
        event.preventDefault();

        const email    = $('#loginEmail');
        const password = $('#loginPassword');

        if (email.val() == '')
            email.addClass('invalid');
        if (password.val() == '')
            password.addClass('invalid');
        if (email.val() != '' && password.val() != '') {
            email.removeClass('invalid');
            password.removeClass('invalid');
            
            const data = JSON.stringify({ "login" : email.val(), "password" : password.val() });
            $.post('rest/login', data, function(callback) {
                localStorage.userId = callback.id ?? '';
                localStorage.token  = callback.token  ?? '';
                localStorage.firstName = callback.firstName;
                localStorage.lastName = callback.lastName;
            })
            .done(function() {
                window.location = 'main.html';
            })
            .fail(function() {
                alert('Something went wrong');
            });
        }
    })

    $('#registrationForm').on('submit', function(event) {
        event.preventDefault();

        const fname           = $('#registrationFirstName');
        const lname           = $('#registrationLastName');
        const email           = $('#registrationEmail');
        const password        = $('#registrationPassword');
        const confirmPassword = $('#registrationConfirmPassword');

        const email_regex    = /(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        const password_regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,45})/;

        if (fname.val() == '')
            fname.addClass('invalid');
        if (lname.val() == '')
            lname.addClass('invalid');
        if (!email_regex.test(email.val()))
            email.addClass('invalid');
        if (!password_regex.test(password.val())) 
            password.addClass('invalid');
        if (!password_regex.test(confirmPassword.val()) || confirmPassword.val() != password.val())
            confirmPassword.addClass('invalid');

        if (!fname.hasClass('invalid')    &&
            !lname.hasClass('invalid')    &&
            !email.hasClass('invalid')    &&
            !password.hasClass('invalid') &&
            !confirmPassword.hasClass('invalid')) {
                const data = JSON.stringify({ "firstName" : fname.val(), "lastName" : lname.val(), "email" : email.val(), "password" : password.val() });
                $.post('rest/api/v1/user/new', data, function(callback) {
                    localStorage.userId = callback.id ?? '';
                    localStorage.token  = callback.token  ?? '';
                    localStorage.firstName = callback.firstName;
                    localStorage.lastName = callback.lastName;
                })
                .done(function() {
                    window.location = 'main.html';
                })
                .fail(function() {
                    alert('Something went wrong');
                });
        }
    })

    $('form input').on('input', function() {
        $(this).removeClass('invalid');
    })

    $('#registrationEmail').on('input', function() {
        const email_regex    = /(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        const email = $(this).val();

        if (email != '') {
            if(email_regex.test(email) || email == '')
                $(this).removeClass('invalid');
            else {
                $(this).addClass('invalid');
                $(this).removeClass('valid');
            }

            if(email_regex.test(email) && email != '')
                $(this).addClass('valid');
        }    
        else
            $(this).removeClass('invalid').removeClass('valid');
    })

    $('#registrationPassword, #registrationConfirmPassword').on('input', function() {
        const password_regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        const password = $(this).val();

        if(password != '') {

            if(password_regex.test(password) && $(this).val() == $('#registrationPassword').val() || password == '')
                $(this).removeClass('invalid');
            else {
                $(this).addClass('invalid');
                $(this).removeClass('valid');
            }

            if(password_regex.test(password) && $(this).val() == $('#registrationPassword').val() && password != '')
                $(this).addClass('valid');
        }
        else
            $(this).removeClass('invalid').removeClass('valid');
    })

    if(localStorage.userId && localStorage.token)
        window.location = 'main.html';


    //hide loader
    $('.loader-wrapper').fadeOut('slow');
})