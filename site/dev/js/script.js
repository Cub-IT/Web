$(function() {
    // NAVBAR MENU  
    $('#menuButton').on('click', function(){
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
