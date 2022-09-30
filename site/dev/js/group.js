$(function(){

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const params = new URLSearchParams(document.location.search);
    const groupId = params.get('groupId');

    var owner_id;

    $.get(`rest/api/v1/group/${groupId}`, function(callback) {
        $('.group-title h2').text(callback.title);
        $('.group-desc span').text(callback.description);
        $('#informationGroupModalCode').text(callback.code);
        $('.group-teacher-name span').text(`${callback.ownerFirstName} ${callback.ownerLastName}`);
        $('.teacher-profile-photo').css('background-color', callback.ownerColor);

        owner_id = callback.ownerId
        if (owner_id != localStorage.userId) {
            $('.owner-group-buttons').remove();
        }
    })
    .done(function() {

        $.get(`rest/api/v1/group/${groupId}/participants`, function(callback) {
            if (callback.length > 1) {
                for(var i = 0; i < callback.length; i++) {
                    if(callback[i].id != owner_id) {
                        var user = $('#profile-template').contents().clone();
                        user.attr('id', `user${callback[i].id}`)
                            .css('background-color', callback[i].color);
                        
                        user.appendTo('.people-list');
                    }
                }
            }
            else
                $('.people-list').closest('.col-lg-12').contents().remove();
        })

        $.get(`rest/api/v1/group/${groupId}/posts`, function(callback) {
            for(var i = 0; i < callback.length; i++) {

                var content = parseStringToHtml(callback[i].description);

                var date = new Date(callback[i].creationDate);

                var task = $('#task-template').contents().clone();
                    task.closest('.task').attr('id', `task${callback[i].id}`).end()
                        .find('.task-owner-name').text($('.group-teacher-name span').text()).end()
                        .find('.task-date').text(`${months[date.getMonth()]} ${date.getDate()}`).end()
                        .find('.task-desc').html(content).end()
                        .find('.task-owner-profile .profile-photo').css('background-color', $('.teacher-profile-photo').css('background-color')).end()
                        $('.group-tasks .container').after(task);
                
                $('.group-setting-plate').hide();

                if(owner_id != localStorage.userId) {
                    $('.owner-group-buttons').remove();
                }
            }
        })
    })
    .fail(function() {
        localStorage.clear();
        //location.replace('authorization.html');
    });

    function parseHtmlToString() {
        const contents = $('.richText-editor').contents();
    
        var result = [];
        contents.each((_, element) => {
            result.push($(element).text());
        });

        for(i = result.length - 1; i != 0 && result[i].trim() == ''; i--) {
            result.splice(i, 1);
        }

        return result.join('\n');
    }

    $(document).on('click','.delete-button', function() {

        const task = $(this).closest('.task');

        const post_id = /\d+/.exec(task.attr('id'));

        $.ajax({
            method: 'PATCH',
            url: `rest/api/v1/group/${groupId}/remove/post/${post_id}`
        })
        
        task.remove();
        
    } )

    $(document).on('click','.task-setting-button', function(event) {
        event.stopPropagation();

        $(this).closest('.task').find('.group-setting-plate').fadeToggle('fast');

    })

    $(document).on('click keydown', function(event) {
        if(!$('.group-setting-plate').is(event.target) && (!event.key || event.key == 'Escape')) {
            $('.group-setting-plate').fadeOut('fast');
        }
    })

    function parseStringToHtml(str) {
        const regex = /(http(s?):\/\/([A-Za-z0-9_.~!*''();:@&=+$,\/?#%-\[\]]+))/g;
        str = str ? str : '';
        const matches = str.match(regex);

        if(matches) {
            matches.forEach(element => {
                str = str.replace(element, `<a href="${element}">${element}</a>`);
            });
        }

        str = str.replace(/\n/g, '<br>');

        return str;
    }

    $(document).on('click', '.richText-saveChanges', function(event) {
        var result = parseHtmlToString();
        
        $.post(`rest/api/v1/task/new/group/${groupId}`, JSON.stringify({ "description" : result }))
        .always(function() {
            $.get(`rest/api/v1/group/${groupId}/posts`, function(callback) {

                var content = parseStringToHtml(callback[callback.length-1].description);
    
                var date = new Date(callback[callback.length-1].creationDate);
    
                var task = $('#task-template').contents().clone();
                task.closest('.task').attr('id', `task${callback[i].id}`).end()
                    .find('.task-owner-name').text($('.group-teacher-name span').text()).end()
                    .find('.task-date').text(`${months[date.getMonth()]} ${date.getDate()}`).end()
                    .find('.task-desc').html(content).end()
                    .find('.task-owner-profile .profile-photo').css('background-color', $('.teacher-profile-photo').css('background-color')).end();
                    $('.group-tasks .container').after(task);

                $('.group-setting-plate').hide();

                if(owner_id != localStorage.userId) {
                    $('.owner-group-buttons').remove();
                }
            })

            $('.richText-editor').contents().remove();
        })

        
    })

    $('.media-big, .media-small').on('click', function(event) {
        $('.page-wrapper.box-content').slideToggle();
    })

    $('.content').richText();



    //hode loader
    $('.loader-wrapper').fadeOut('slow');
})