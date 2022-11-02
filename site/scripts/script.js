$(function() {
    $.ajaxSetup({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        // beforeSend: function(xhr) {
        //     if(localStorage.getItem('token'))
        //         xhr.setRequestHeader('token', localStorage.getItem('token'));
        // }
        
    });

    $(document).on('click', '.menu-btn', function() {
        $('menu').fadeIn('fast');
        $('body').css('overflow', 'hidden');
    });

    $(document).on('mouseleave', '.menu', function() {
        $('menu').fadeOut('fast');
        $('body').css('overflow', 'auto');
    });

    $(document).on('click', '.menu-wrapper', function() {
        $('menu').fadeOut('fast');
        $('body').css('overflow', 'auto');
    })
})