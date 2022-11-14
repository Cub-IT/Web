import { ajax } from './ajaxSetup.js'

$(function() {

    const groups = ajax('class/', { method: 'GET' });

    groups.then((data) => {
        $.each(data, function(_, group) {
            console.log(group)
            const a = $('<a class="link" href="class.html"><span data-inject="title"></span></a>').inject(group, { id: 'class-link', id_part: 'id'})
            $(a).appendTo('.menu-body')
            console.log(a);

        })
        
    })


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