$(function() {
    // NAVBAR MENU  
    $('#menuButton').on('click', function(){
        $('navbarMenu').fadeIn('fast');
        $('body').css('overflow', 'hidden');
    });
    $('.wrapper').on('click', function(event) {
        if($(event.target).hasClass('wrapper')) {
            $('navbarMenu').fadeOut('fast');
            $('body').css('overflow', 'auto');
        }
    })
    // $('.navbar-menu').on('mouseleave', function() {
    //     $('navbarMenu').fadeOut('fast');
    //     $('body').css('overflow', 'auto');
    // })
    
    // SETTINGS
    $('.scroll-propagation').on('mouseenter', function() {
        $('body').toggleClass('overflow-hidden');
    })
    
    $('.scroll-propagation').on('mouseleave', function() {
        $('body').toggleClass('overflow-hidden');
    })
})
