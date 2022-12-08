import { ajax } from './ajaxSetup.js'

$(function() {

    const user = ajax(`auth/get/user`, { method: 'GET' });

    user.then((user_info) => {
        $('.about-user').inject(user_info)
    })


})


