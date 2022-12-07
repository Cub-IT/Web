import { ajax } from './ajaxSetup.js'

$(function() {
    const groups = ajax('class/get/', { method: 'GET' });

    const addGroup = function(group) {
        const class_temp = $('#class-template').contents().clone();
        $(class_temp).inject(group, { id: 'class', id_part: 'id', href_params_keys : "class_id", href_params_values : "id"}).appendTo('.classes')
    }

    groups.then((data) => {
        $.each(data, function(_, group) {
            addGroup(group)
        })
    })

    const joinToClass = function() {
        const formData = new FormData($('#join-class-form')[0])
        const formEntries = Object.fromEntries(formData);

        const group = ajax('class/add/user', { method : 'POST', data : formEntries })

        group.then((result) => { 
            addGroup(result[0]) 
            dialog_join.dialog('close');
        }).catch((error) => {
            alert(error)
        })
    }

    const createClass = function() {
        const formData = new FormData($('#create-new-class-form')[0])
        const formEntries = Object.fromEntries(formData);

        const group = ajax('class/new', { method : 'POST', data : formEntries })

        group.then((result) => { 
            addGroup(result[0]) 
            dialog_create.dialog('close');
        }).catch((error) => {
            alert(error);
        })
    }

    const dialog_join = $( "#dialog-join-class" ).dialog({
        autoOpen: false,
        resizable: false,
        draggable: false,
        width: 350,
        modal: true,
        buttons: {
          Join: {
            text : 'Join',
            class : 'ui-join',
            click : function() { joinToClass() }
          },
          Cancel: {
            text : 'Cancel',
            class : 'ui-close-dialog',
            click : function() {
                dialog_create.dialog( "close" );
            }
          }
        },
        close: function() {
        }
    });

    $('.join-to-class-btn').on('click', function() {
        dialog_join.dialog('open')
    })

    const dialog_create = $( "#dialog-create-class" ).dialog({
        autoOpen: false,
        resizable: false,
        draggable: false,
        // height: 400,
        width: 350,
        modal: true,
        buttons: {
          Create: {
            text : 'Create',
            class : 'ui-create',
            click : function() { createClass() }
          },
          Cancel: {
            text : 'Cancel',
            class : 'ui-close-dialog',
            click : function() {
                dialog_create.dialog( "close" );
            }
          }
        },
        close: function() {
        }
    });

    $('.create-class-btn').on('click', function() {
        dialog_create.dialog('open')
    })
})


