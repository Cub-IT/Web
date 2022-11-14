import { ajax } from './ajaxSetup.js'

$(function() {
    const groups = ajax('class/', { method: 'GET' });

    groups.then((data) => {
        $.each(data, function(_, group) {
            const class_temp = $('#class-template').contents().clone();
            $(class_temp).inject(group, { id: 'class', id_part: 'id' }).appendTo('.classes')
        })
        
    })
})


