$(function(){

    $('.edit').hide();

    $.get(`rest/api/v1/user/${localStorage.userId}`, function(callback) {
        $('.user-firstname').val(callback.firstName);
        $('.user-lastname').val(callback.lastName);
        $('.user-email').val(callback.email);

        //hide loader
        $('.loader-wrapper').fadeOut('slow');
    });

    $('.edit-profile-button').on('click', function(event) {
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