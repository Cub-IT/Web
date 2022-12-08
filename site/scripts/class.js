import { ajax } from './ajaxSetup.js'

$(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const class_id = urlParams.get('class_id')

    const addPost = function(post) {
        const class_temp = $('#post-template').contents().clone();
        $(class_temp).inject(post, { id: 'post', id_part: 'id' }).prependTo('#class-posts')
    }

    const clearPostForm = function() {
        $('#create-post-form').find('input, textarea').val('')
    }

    const group = ajax(`class/get/${class_id}`, { method: 'GET' });

    group.then((data) => {
        $('.class').inject(data[0],  {class : 'label'} )

        const posts = ajax(`post/class/${class_id}/get/`, { method: 'GET' });

        posts.then((data) => {
            $.each(data, function(_, post) {
                addPost(post)
            })
        })
    })

    $('#create-post-btn').on('click', function() {
        const formData = new FormData($('#create-post-form')[0])
        const formEntries = Object.fromEntries(formData)

        const post = ajax(`post/class/${class_id}/new`, {method : "POST", data : formEntries})

        post.then((data) => {
            addPost(data[0])
        }).catch((error) => {
            alert(error)
        })
    })

    $('#cancel-create-post-btn').on('click', clearPostForm)
})


