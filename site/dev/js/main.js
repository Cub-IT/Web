$(function() {
    $.get(`rest/api/v1/user/${localStorage.userId}`)
    .done(function() {
        //hide loader
        $('.loader-wrapper').fadeOut('slow');
    })
    .fail(function() {
        localStorage.clear();
        //location.replace('authorization.html');
    });

    $.get(`rest/api/v1/user/${localStorage.userId}/groups`, function(callback) {
        if (callback.length)
            $('#group-empty-warning').hide()
        for(var i = 0; i < callback.length; i++) {
            const group = $('#group-template').contents().clone();
            group.attr('id', `group${callback[i].id}`)
                 .find('.group-title h2').text(callback[i].title).end()
                 .find('.group-desc span').text(callback[i].description).end()
                 .find('.group-teacher-name span').text(`${callback[i].ownerFirstName} ${callback[i].ownerLastName}`).end()
            group.appendTo('.groups-place');

            $('.group-setting-plate').hide();
        }
    });

    $('#join').on('click', function(event) {
        const groupCode = $('#join-group-code');

        $.ajax({
            method: 'PATCH',
            url: `rest/api/v1/user/${localStorage.userId}/join/${groupCode.val()}`
        })
        .always(function() {
            location.reload();
        })
        .fail(function() {
            groupCode.addClass('invalid');
        });
    })

    $('#create').on('click', function(event) {
        const groupName = $('#create-group-name').val();
        const groupDesc = $('#create-group-desc').val();

        const data = JSON.stringify({ "title" : groupName, "description" : groupDesc });
        $.post('rest/api/v1/group/new', data)
        .always(function() {
            location.reload();
        });
    })

    $('#join-group-code').on('input', function() {
        $(this).removeClass('invalid');
    })

    $(document).on('click keydown', function(event) {
        if(!$('.group-setting-plate').is(event.target) && (!event.key || event.key == 'Escape')) {
            $('.group-setting-plate').fadeOut('fast');
        }
    })
    
    $(document).on('click','.group-setting-button', function(event) {
        event.stopPropagation();

        $('.group-setting-plate:not(.d-none)').not($(this).closest('.group').find('.group-setting-plate')).fadeOut('fast');
        $(this).closest('.group').find('.group-setting-plate').fadeToggle('fast');

    })

    $(document).on('click','.leave-button', function(event) {
        event.stopPropagation();

        const group = $(this).closest('.group');
        const groupId = /\d+/.exec(group.attr('id'));

        $.ajax({
            method: 'PATCH',
            url: `rest/api/v1/user/${localStorage.userId}/leave/${groupId}`
        })

        group.remove();
        $(`a[href="group.html?groupId=${groupId}"]`).remove()

        if ($('.group-class').length == 0)
            $('#group-empty-warning').show()
    });

    $(document).on('click', '.group-class', function() {
        const group = $(this).closest('.group');
        const groupId = /\d+/.exec(group.attr('id'));
        window.location.href =`group.html?groupId=${groupId}`;
        
    });

    $('.groups-action-button').on('click', function(event) {
        $('#create-group-name').val('');
        $('#create-group-desc').val('');
        $('#join-group-code').val('');

        if ($('#actionGroupModal .modal-content').first().css('display') == 'none') {
            $('#actionGroupModal .modal-content').slideToggle(0);    
        }

    })
    $('.toggle-action').on('click', function() {
        $('#actionGroupModal .modal-content').slideToggle('fast');
    })
});