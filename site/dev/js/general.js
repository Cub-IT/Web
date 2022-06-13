$(function() {
    $.ajaxSetup({
        url: 'localhos:3001',
        beforeSend: function(xhr) {
            if(localStorage.getItem('token'))
                xhr.setRequestHeader('token', localStorage.getItem('token'));
        }
    });
    //redirect if not login
    // if(window. location. pathname != '/authorization.html' && !localStorage.getItem('token'))
    //     window.location.replace("authorization.html");
})