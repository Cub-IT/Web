$(function(){

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const params = new URLSearchParams(document.location.search);
    const groupId = params.get('groupId');

    $.get(`/api/v1/user/${localStorage.userId}/groups/${groupId}`, function(callback) {
        $('.group-title h2').text(callback.name);
        $('.group-desc span').text(callback.description);
        $('.group-teacher-name span').text(`${callback.ownerFirstName} ${callback.ownerLastName}`);
        $('.teacher-profile-photo').css('background-color', callback.ownerColor);

        for(var i = 0; i < callback.taskList.length; i++) {

            var content = parseStringToHtml(callback.taskList[i].content);

            var date = new Date(callback.taskList[i].creationDate);

            var task = $('#task-template').contents().clone();
            task.find('.task-owner-name').text(`${callback.ownerFirstName} ${callback.ownerLastName}`).end()
                .find('.task-date').text(`${months[date.getMonth()]} ${date.getDate()}`).end()
                .find('.task-desc').html(content).end()
                .find('.task-owner-profile .profile-photo').css('background-color', callback.taskList[i].userColor).end()
                .appendTo('.group-tasks');
            //$('.group-tasks .container').append(task);
        }
    })

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

    function parseStringToHtml(str) {
        const regex = /(http(s?):\/\/([A-Za-z0-9_.~!*''();:@&=+$,\/?#%-\[\]]+))/g;
        const matches = str.match(regex);

        if(matches) {
            matches.forEach(element => {
                str = str.replace(element, `<a href="${element}">${element}</a>`);
            });
        }

        str = str.replace(/\n/g, '<br>');

        return str;
    }

    $('.richText-saveChanges').on('click', function(event) {
        var result = parseHtmlToString()
        

        
        const date = new Date();

        var task = $('#task-template').contents().clone();
        task.find('.task-desc').html(parseStringToHtml(result));
        task.find('.task-date').text(`${months[date.getMonth()]} ${date.getDate()}`);
        $('.group-tasks .container').after(task);
    })

    $('.media-big, .media-small').on('click', function(event) {
        $('.page-wrapper.box-content').slideToggle();
    })

    $('.content').richText();



    //hode loader
    $('.loader-wrapper').fadeOut('slow');
})