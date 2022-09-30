$(function(){

    $('.edit').hide();

    function toggleEditWindow() {

        $('.user-firstname').val(localStorage.firstName).removeClass('valid').removeClass('invalid');
        $('.user-lastname').val(localStorage.lastName).removeClass('valid').removeClass('invalid');
        $('.user-password').val('').removeClass('valid').removeClass('invalid');
        $('.user-confirmPassword').val('').removeClass('valid').removeClass('invalid');

        $('.edit-input').toggleClass('bg-dark')
                        .toggleClass('bg-dark-gray')
                        .toggleClass('border-dark')
                        .toggleClass('border-dark-gray')
                        .attr('disabled', function(_, attr){ return !attr});

        $('.edit').slideToggle({
            duration: 'fast', 
            start: function() {
                $(this).css('display','flex');
          }
        });

        if(!$('.edit-input:disabled').length)
            $('.user-firstname').focus();
    }

    function editUser() {
        const firstName = $('.user-firstname');
        const lastName = $('.user-lastname');
        const password = $('.user-password');
        const confirmPassword = $('.user-confirmPassword');
        
        if (!firstName.hasClass('invalid') && firstName.val() != '' &&
            !lastName.hasClass('invalid')  && lastName.val() != '' &&
            (!password.hasClass('invalid') && password.val() == confirmPassword.val())) {
            
            $.ajax({
                method: 'PATCH',
                url: `rest/api/v1/user/${localStorage.userId}/edit`,
                data: JSON.stringify({"firstName" : firstName.val(), "lastName" : lastName.val(), "password" : password.val() }) 
            })
            .done(function() {
                localStorage.firstName = firstName.val();
                localStorage.lastName  = lastName.val();
                toggleEditWindow();
            })
        }
    }

    function cancelEditUser() {
        if ($('.valid, .invalid').length) {
            if (confirm('Are you sure?\nAll changes will be reverted'))
                toggleEditWindow();
        }
        else
            toggleEditWindow();
    }

    $.get(`rest/api/v1/user/${localStorage.userId}`, function(callback) {
        $('.user-firstname').val(callback.firstName);
        $('.user-lastname').val(callback.lastName);
        $('.user-email').val(callback.email);
        $('.setting-photo .profile-photo').css('background', callback.color);

        //hide loader
        $('.loader-wrapper').fadeOut('slow');
    })
    .fail(function() {
        localStorage.clear();
        //location.replace('authorization.html');
    });

    $('.edit-profile-button').on('click', cancelEditUser)

    $('#cancel').on('click', cancelEditUser);

    $('#save').on('click', function() {
        editUser();
    })

    $('.user-firstname, .user-lastname').on('input', function() {
        const name_regex = /[\d\s]/;

        const name = $(this).val();

        if(!name_regex.test(name))
            $(this).removeClass('invalid');
        else {
            $(this).addClass('invalid');
            $(this).removeClass('valid');
        }

        if(!name_regex.test(name) && name != '')
            $(this).addClass('valid');
        

    })

    $('.user-password, .user-confirmPassword').on('input', function() {
        const password_regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        const password = $(this).val();

        if(password != '') {

            if(password_regex.test(password) && $(this).val() == $('.user-password').val() || password == '')
                $(this).removeClass('invalid');
            else {
                $(this).addClass('invalid');
                $(this).removeClass('valid');
            }

            if(password_regex.test(password) && $(this).val() == $('.user-password').val() && password != '')
                $(this).addClass('valid');
        }
        else
            $(this).removeClass('invalid').removeClass('valid');
    })

    $('.logout a').on('click', function() {
        localStorage.clear();
    })
})