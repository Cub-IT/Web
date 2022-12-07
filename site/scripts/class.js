import { ajax } from './ajaxSetup.js'

$(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const class_id = urlParams.get('class_id')

    const group = ajax(`class/get/${class_id}`, { method: 'GET' });

    group.then((data) => {
        $('.class').inject(data[0])

        const posts = ajax(`post/class/${class_id}/get/`, { method: 'GET' });

        posts.then((data) => {
            $.each(data, function(_, post) {
                const class_temp = $('#post-template').contents().clone();
                $(class_temp).inject(post, { id: 'post', id_part: 'id' }).appendTo('#class-posts')
            })
        })
    })
})


