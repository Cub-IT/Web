
$.ajaxSetup({
    url: 'localhos:8080',
    beforeSend: function(xhr) {
        xhr.setRequestHeader('token', localStorage.getItem('acces-token'));
    }
});