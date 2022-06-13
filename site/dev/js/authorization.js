$(function(){

    $('.switch-auth-mode').on('click', function() {
        $('.auth-mode').toggleClass('d-none');
    })

    $('#loginForm').on('submit', function(event) {
        event.preventDefault();

        const email = $('#loginEmail');
        const password = $('#loginPassword');

        if(email.val() != '' && password.val() != '') {
            email.removeClass('invalid');
            password.removeClass('invalid');
            
            window.location = 'main.html';
            $.get('', {'username' : email, 'password' : password}, function(callback) {
                
            });
        }
        if(email.val() == '')
            email.addClass('invalid');
        if (password.val() == '')
            password.addClass('invalid');
        
    })

    $('#registrationForm').on('submit', function(event) {
        event.preventDefault();

        const username        = $('#registrationUsername');
        const email           = $('#registrationEmail');
        const password        = $('#registrationPassword');
        const confirmPassword = $('#registrationConfirmPassword');

        const username_regex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+/;
        const email_regex    = /(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        const password_regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        if (!username_regex.test(username.val()))
            username.addClass('invalid');
        if (!email_regex.test(email.val()))
            email.addClass('invalid');
        if (!password_regex.test(password.val())) 
            password.addClass('invalid');
        if (!password_regex.test(confirmPassword.val()) || confirmPassword.val() != password.val())
            confirmPassword.addClass('invalid');

        if (!username.hasClass('invalid') &&
            !email.hasClass('invalid')    &&
            !password.hasClass('invalid') &&
            !confirmPassword.hasClass('invalid')) {

                $.post('', {'username' : username, 'email' : email, 'password' : password}, function(callback) {
                    
                });
        }
    })

    $('form input').on('input', function() {
        $(this).removeClass('invalid');
    })

    $('#registrationUsername').on('input', function() {
        const username_regex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+/;

        const username = $(this).val();

        if (username_regex.test(username) || username == '')
            $(this).removeClass('invalid');
        else {
            $(this).addClass('invalid');
            $(this).removeClass('valid');
        }

        if (username_regex.test(username) && username != '') 
            $(this).addClass('valid');
    })

    $('#registrationEmail').on('input', function() {
        const email_regex    = /(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        const email = $(this).val();

        if(email_regex.test(email) || email == '')
            $(this).removeClass('invalid');
        else {
            $(this).addClass('invalid');
            $(this).removeClass('valid');
        }

        if(email_regex.test(email) && email != '')
            $(this).addClass('valid');
    })

    $('#registrationPassword, #registrationConfirmPassword').on('input', function() {
        const password_regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        const password = $(this).val();

        if(password_regex.test(password) && $(this).val() == $('#registrationPassword').val() || password == '')
            $(this).removeClass('invalid');
        else {
            $(this).addClass('invalid');
            $(this).removeClass('valid');
        }

        if(password_regex.test(password) && $(this).val() == $('#registrationPassword').val() && password != '')
            $(this).addClass('valid');
    })
    
    // LOADER HIDE
    $('.loader-wrapper').fadeOut('slow');
})