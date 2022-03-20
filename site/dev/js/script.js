$(function() {
    // LOADER HIDE
    $('.loader-wrapper').fadeOut('slow');
    
    // NAVBAR MENU  
    $('.toggler-button').on('click', function(){
        $('navbarMenu').fadeIn('fast');
    });

    $('.navbar-menu').on('mouseleave', function() {
        $('navbarMenu').fadeOut('fast');
    })
    
    // SETTINGS
    $('.scroll-propagation').on('mouseenter', function() {
        $('body').toggleClass('overflow-hidden');
    })

    $('.scroll-propagation').on('mouseleave', function() {
        $('body').toggleClass('overflow-hidden');
    })
})
