import { ajax } from './ajaxSetup.js'

$(function() {

    const groups = ajax('class/get/', { method: 'GET' });

    groups.then((data) => {
        $.each(data, function(_, group) {
            $('<a class="link" data-inject-href="class.html"><span data-inject="title"></span></a>')
            .inject(group, { id: 'class-link', id_part: 'id', href_params_keys : "class_id", href_params_values : "id"})
            .appendTo('.menu-body')
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

    // actions with elements

    $(document).on('click', '[data-target]', function(event) {
        event.preventDefault();
        $(`#${$(this).data('target')}`).fadeToggle();
    })

    $(document).on('mouseleave', '.mouse-leave-event-hide', function() {
        $(this).fadeOut();
    })
})