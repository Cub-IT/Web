$(function() {
    $.get(`rest/api/v1/user/${localStorage.userId}/groups`, function(callback) {
        for(var i = 0; i < callback.length; i++) {
            const span = $('<span class="group-name text-truncate">').text(callback[i].title);
            $('<a></a>').attr('class','groups m-4 own-group')
                        .attr('href', `group.html?groupId=${callback[i].id}`)
                        .append(span)
                        .appendTo('#menu-group-list'); 
        }
    })
})