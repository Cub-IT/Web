$(function(){

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
        

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const date = new Date();

        var task = $('#task-template').contents().clone();
        task.find('.task-desc').html(parseStringToHtml(result));
        task.find('.task-date').text(`${months[date.getMonth()]} ${date.getDate()}`);
        $('.group-tasks .container').after(task);
    })

    $('.media-big, .media-small').on('click', function(event) {
        $('.page-wrapper.box-content').slideToggle();
    })

    parseHtmlToString();
    // LOADER HIDE
    $('.loader-wrapper').fadeOut('slow');
})