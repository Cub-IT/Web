import { ajax } from './ajaxSetup.js'

$(function() {
    const videoGrid = $('#video-grid')
    const myVideo = $('<video></video>')

    const cameraButton = $('[name=camera]');
    const microphoneButton = $('[name=microphone]');
    const soundButton = $('[name=sound]');
    const leaveButton = $('[name=leave]');

    myVideo.get(0).muted = true

    let prev_room_id;
    $.userInRoom = false;
    let myUserPeerId;
    let my_prev_peer;

    const peers = {}

    const socket = io('/');

    function leaveRoom(roomId, userPeerId) {
        socket.emit('leave-room', roomId, userPeerId);
        prev_room_id = undefined;
        myUserPeerId = undefined;
        $.userInRoom = false;
        my_prev_peer.disconnect();
        my_prev_peer.destroy();
    }

    async function toggleAudio(stream, stop) {
        const audioTrack = stream.getTracks().find(track => track.kind === 'audio');
        if(stop === true && audioTrack) {
            audioTrack.enabled = false;
            setTimeout(function() {
                audioTrack.stop();
            }, 1000);
        }

        else {
            let newVideoStreamGrab = await navigator.mediaDevices.getUserMedia({
                audio: true
            })
            if(audioTrack)
                stream.removeTrack(audioTrack)
                
            stream.addTrack(newVideoStreamGrab.getAudioTracks()[0])

            $.each(peers, (_, call) => {
                const senders = call.peerConnection.getSenders();
                const audioSender = senders.find(sender => sender.track && sender.track.kind === 'audio');
                if(audioSender)
                    audioSender.replaceTrack(stream.getAudioTracks()[0]);
                else
                    senders.addTrack(stream.getAudioTracks()[0]);
            })
        }
    }

    async function toggleVideo(stream, stop) {
        const videoTrack = stream.getTracks().find(track => track.kind == 'video');
        if(stop === true) {
            videoTrack.enabled = false;
            setTimeout(function() {
                videoTrack.stop();
            }, 1000);
        }
        else {
            // stream.getVideoTracks()[0].enabled = true;
            let newVideoStreamGrab = await navigator.mediaDevices.getUserMedia({
                video: true
            })
            if(videoTrack)
                stream.removeTrack(videoTrack)

            stream.addTrack(newVideoStreamGrab.getVideoTracks()[0])

            $.each(peers, (_, call) => {
                const senders = call.peerConnection.getSenders();
                const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
                if(videoSender)
                    videoSender.replaceTrack(stream.getVideoTracks()[0]);
                else
                    senders.addTrack(stream.getVideoTracks()[0]);
            })
        }
    }

    $('.video-rooms').on('click', function(event) {
        event.stopPropagation();
    }).on('click', '.video-room', function(event) {
        $.showVideo();
        event.stopPropagation();
        const ROOM_ID = $(this).data('roomId');

        if(prev_room_id === ROOM_ID)
            return;

        if($.userInRoom)
            leaveRoom(prev_room_id, myUserPeerId);

        videoGrid.empty();

        const myPeer = new Peer(undefined, {
            host: '/',
            port: '9091'
        });

        my_prev_peer = myPeer;
        
        prev_room_id = ROOM_ID;
        $.userInRoom = true;

        navigator.mediaDevices.getUserMedia({
            video: !cameraButton.prop('checked'),
            audio: !(soundButton.prop('checked') || microphoneButton.prop('checked'))
        }).then(myVideoStream => {
            addVideoStream(myVideo, myVideoStream)
    
            myPeer.on('call', call => {
                peers[call.peer] = call;

                call.answer(myVideoStream)
                const video = $('<video></video>')
                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                }).on('close', () => {
                    video.remove()
                    delete peers[call.peer];
                })
            }).on('data', (m) => {
                console.log(m);
            })
    
            socket.on('user-connected', userId => {
                // connectToNewUser(userId, stream)
                console.log(userId)
                // make sure myPeer.on('call') has been executed first
                setTimeout(connectToNewUser, 1000, userId, myVideoStream)
            })

            leaveButton.on('click', function() {
                videoGrid.empty();
                toggleVideo(myVideoStream, true);
                toggleAudio(myVideoStream, true);
                // if(prev_room_id && myUserPeerId)
                leaveRoom(prev_room_id, myUserPeerId);
                $.lastScreen();
            })

            cameraButton.on('change', function() {
                toggleVideo(myVideoStream, $(this).prop('checked'));
            })

            microphoneButton.on('change', function() {
                toggleAudio(myVideoStream, $(this).prop('checked'));
            })

            soundButton.on('change', function() {
                toggleVideo(myVideoStream, $(this).prop('checked'));
                toggleAudio(myVideoStream, $(this).prop('checked'));
            })
        })
    
        socket.on('user-disconnected', userId => {
            if (peers[userId]) {
                peers[userId].close();
                delete peers[userId]; // Удалить вызов из объекта peers при отключении пользователя
            }
        })
    
        myPeer.on('open', userPeerId => {
            // On join chatroom
            myUserPeerId = userPeerId;
            socket.emit('join-room', ROOM_ID, userPeerId);
        })

        function connectToNewUser(userId, stream) {
            const call = myPeer.call(userId, stream)
            const video = $('<video></video>');
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            }).on('close', () => {
                video.remove()
                delete peers[call.peer];
            })
    
            peers[userId] = call
        }
    
        function addVideoStream(video, stream) {
            video.get(0).srcObject = stream
            video.on('loadedmetadata', () => {
                video.get(0).play()
            })
            videoGrid.append(video)
        }
    })

    //chat
    const urlParams = new URLSearchParams(window.location.search);
    const class_id = urlParams.get('class_id');

    ajax(`class/${class_id}/messages`, {method: "GET"}).then((messages) => {
        ajax('auth/get/user', {method : "GET"}).then((userInfo) => {

            const addMessage = ({user, message, send_date}) => {
                const date = new Date(send_date);
                const day = date.getDate();
                const month = ('0' + (date.getMonth() + 1)).slice(-2);
                const hours = ('0' + date.getHours()).slice(-2);
                const minutes = ('0' + date.getMinutes()).slice(-2);
    
                const message_temp = $('#message-template').contents().clone();
                message_temp.inject({...user, message, send_date: `${day}.${month} ${hours}:${minutes}`})
    
                const current_pos = $('.chat-messages').scrollTop();
                const block_height = $('.chat-messages').outerHeight();
                const max_scroll_height = $('.chat-messages').prop("scrollHeight")
    
                let scroll = current_pos + block_height == max_scroll_height;
                
                $('.chat-typing-indicator__wrapper').before(message_temp)
    
                if(userInfo.id == user.id) {
                    message_temp.addClass('right')
                    
                    scroll = true
                }
                if(scroll) {
                    $('.chat-messages').animate({scrollTop: $('.chat-messages').prop("scrollHeight")}, 100)
                }
            }

            $.each(messages, (_, message) => {
                const obj = {
                    user : {
                        id : message.user_id,
                        first_name : message.first_name,
                        last_name : message.last_name
                    },
                    message : message.message,
                    send_date : message.send_date
                }
                addMessage(obj);
            })
        
            socket.emit('join-chat', class_id, userInfo);

            const showTypingIndicator = () => {
                $('.chat-typing-indicator__wrapper').css('visibility', 'visible');
            }
            const hideTypingIndicator = () => {
                $('.chat-typing-indicator__wrapper').css('visibility', 'hidden');
            }
        
            socket.on('message', addMessage)
            socket.on('typing', (user) => {
                const user_typing = $(`<span class="chat-typing-users" data-user-id="${user.id}">${user.first_name}</span>`);
                $('.chat-typing-users').append(user_typing);
                showTypingIndicator();
            }).on('stop-typing', (user) => {
                $('.chat-typing-users').find(`[data-user-id="${user.id}"]`).first().remove();
                if(!$('.chat-typing-users').find('.chat-typing-users').length) {
                    hideTypingIndicator();
                }
            });
        
            let send = false;
        
            const formatText = (text) => {
                return text.replace(/^(<div><br><\/div>)+/, '')
                           .replace(/(<div><br><\/div>)+$/, '')
                           .replace(/^(<div>(&nbsp;\s?)+<\/div>)+/, '')
                           .replace(/(<div>(&nbsp;\s?)+<\/div>)+$/ , '')
                           .replace(/^(&nbsp;\s?)+/ , '')
                           .replace(/(&nbsp;\s?)+$/ , '')
                           .replace(/^(\s)+/ , '')
                           .replace(/(\s)+$/ , '')
                           .replace(/^(<br>)+/ , '')
                           .replace(/(<br>)+$/ , ''); //trim html
            }

            let user_typing = false;
        
            $(".chat-input").on('keydown', function(event) {
                if(event.key == "Enter" && !event.shiftKey) {
                    send = true;
                    event.preventDefault();
                }
            }).on('keyup', function() {
                if(!user_typing && $(this).text().length > 0) {
                    user_typing = true;
                    socket.emit('user-typing');
                }
                else if(user_typing && $(this).text().length == 0) {
                    user_typing = false;
                    socket.emit('user-stop-typing');
                }

                if(send) {
                    send = false;
                    if($(this).text().trim().length) { //send message
                        const text = formatText($(this).html())
                        socket.emit('user-send-message', text);
                        socket.emit('user-stop-typing');
                        $(this).empty();
                    }
                }
            }).on('focusout', function() {
                var element = $(this);        
                if (!element.text().replace(" ", "").length) {
                    element.empty();
                }

                if(user_typing) {
                    socket.emit('user-stop-typing');
                    user_typing = false;
                }
                    
            })
        
            $('.chat-send-message').on('click', function() { //send message
                if($(".chat-input").text().trim().length) {
                    const text = formatText($(".chat-input").html());
                    socket.emit('user-send-message', text);
                    socket.emit('user-stop-typing');
                    $(".chat-input").empty(); 
                }
            })
        })
    })
    

})