$(function() {
    $('.group-setting-plate').hide();

    $(document).on('click keydown', function(event) {
        if(!$('.group-setting-plate').is(event.target) && (!event.key || event.key == 'Escape')) {
            $('.group-setting-plate').fadeOut('fast');
        }
    })
    
    $('.group-setting-button').on('click', function(event) {
        event.stopPropagation();

        $('.group-setting-plate:not(.d-none)').not($(this).closest('.group').find('.group-setting-plate')).fadeOut('fast');
        $(this).closest('.group').find('.group-setting-plate').fadeToggle('fast');

    })

    $('.group-class').on('click', function() {
        window.location.href ='group.html?id=1&name=12';
        
    });
  
    // LOADER HIDE
    $('.loader-wrapper').fadeOut('slow');
});