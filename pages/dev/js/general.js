$(function() {
    $.ajaxSetup({
        contentType: "application/json",
        dataType: "json",
        beforeSend: function(xhr) {
            if(localStorage.getItem('token'))
                xhr.setRequestHeader('token', localStorage.getItem('token'));
        }
        
    });
    //redirect if 
    // if(window.location.href.indexOf("authorization.html") == -1 && (/*!localStorage.getItem('token') || */ !localStorage.getItem('userId'))) {
    //     window.location.replace("authorization.html");
    //     localStorage.clear();
    // }
})