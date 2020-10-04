const socket = io('/')
const videoGrid = document.getElementById('video-grid')

const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
})

let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;

const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
    // input value
    let text = $("input");
    // when press enter send message
    $('html').keydown(function (e) {
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val());
            text.val('')
        }
    });
    socket.on("createMessage", message => {
        $("ul").append(`<li class="message">${message}</li>`);
        scrollToBottom()
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    // videoGrid.append(<div class="col">)
    videoGrid.append(video)
    // videoGrid.append(</div>)
}



const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
    <button onclick="muteUnmute()"><i class="fas fa-microphone"></i></button>
  `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <button class="btn-sec" onclick="muteUnmute()"><i class="fas fa-microphone-slash"></i></button>
  `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
    const html = `
    <button onclick="playStop()"><i class="fas fa-video"></i></button>
  `
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <button class="btn-sec" onclick="playStop()"><i class="fas fa-video-slash"></i></button>
  `
    document.querySelector('.main__video_button').innerHTML = html;
}

var isMessageOpen = false;

function toggleNav() {
    if (isMessageOpen == false) {
        document.getElementById("mySidepanel").style.width = "25vw";
        // document.getElementById("main__message_container").style.width = "25vw";
        document.getElementById("main-window").style.width = "75vw";
        isMessageOpen = true;
    }
    else {
        document.getElementById("mySidepanel").style.width = "0";
        // document.getElementById("main__message_container").style.width = "0vw";
        document.getElementById("main-window").style.width = "100vw";
        isMessageOpen = false;
    }
}

function openInvitePanel() {

    invite_panel = document.getElementById("invite_panel");
    invite_panel.style.display = "block";

    var meetUrl = document.getElementById("meeting-url");
    meetUrl.value = window.location.href;
}

function closeInvitePanel() {
    invite_panel = document.getElementById("invite_panel");
    invite_panel.style.display = "none";
}

window.onclick = function (event) {
    invite_panel = document.getElementById("invite_panel");
    if (event.target == invite_panel) {
        invite_panel.style.display = "none";
    }
}

function copyMeetId() {
    /* Get the text field */
    var copyText = document.getElementById("meeting-url");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
}