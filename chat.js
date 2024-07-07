// url Async requesting function
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

var apikey = "LIVDSRZULELA";
var lmt = 6;
// callback for share event
function tenorCallback_searchSuggestion(responsetext) {
    var response_objects = JSON.parse(responsetext);
    predicted_words = response_objects["results"];
    document.getElementById("ac_1").innerHTML = predicted_words[0];
    document.getElementById("ac_2").innerHTML = predicted_words[1];
    document.getElementById("ac_3").innerHTML = predicted_words[2];
    document.getElementById("ac_4").innerHTML = predicted_words[3];
}

var socket = io('http://192.168.0.102:8000'); // Ensure the correct URL is used here

socket.on('new_message', function(data) {
    var UserName = localStorage.getItem("UserName");
    if (UserName == data.UserName && data.Type != 0)
        addMessage(data.message, true, '',data.Type);
    else
        addMessage(data.message, false, data.UserName,data.Type);
});

function addMessage(message, isUser, username = '', Type) {
    let messageHtml
    if (Type == 0) {
        messageHtml = `
        <div class="text-center text-black-500 italic">
            ${username} has joined the chat
        </div>
    `;
    }
    else if (Type == 1) {
        messageHtml = `
        <div class="flex items-start ${isUser ? 'justify-end' : ''} space-x-4">
            ${!isUser ? `<div class="flex-shrink-0">
                <img class="h-10 w-10 rounded-full" src="user.png" alt="User Avatar">
            </div>` : ''}
            <div>
                ${!isUser ? `<p class="text-gray-500 text-sm">${username}</p>` : ''}
                <div class="${isUser ? 'bg-blue-100' : 'bg-white'} shadow rounded-lg p-4">
                    <p>${message}</p>
                </div>
                <span class="text-gray-500 text-sm">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            ${isUser ? `<div class="flex-shrink-0 order-first">
                <img class="h-10 w-10 rounded-full" src="user.png" alt="User Avatar">
            </div>` : ''}
        </div>
    `;
    }
    else if (Type == 2) {
        messageHtml = `
        <div class="flex items-start ${isUser ? 'justify-end' : ''} space-x-4">
            ${!isUser ? `<div class="flex-shrink-0">
                <img class="h-10 w-10 rounded-full" src="user.png" alt="User Avatar">
            </div>` : ''}
            <div>
                ${!isUser ? `<p class="text-gray-500 text-sm">${username}</p>` : ''}
                <div class="${isUser ? 'bg-blue-100' : 'bg-gray-100'} p-2 rounded-lg">
                    <img src="${message}" alt="Image" class="rounded-lg">
                </div>
                <span class="text-gray-500 text-sm">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            ${isUser ? `<div class="flex-shrink-0 order-first">
                <img class="h-10 w-10 rounded-full" src="user.png" alt="User Avatar">
            </div>` : ''}
        </div>
    `;
    }
    else if (Type == 3){
        messageHtml = `
        <div class="text-center text-black-500 italic">
            Error :${message} 
        </div>
    `;
    }
    $('#messages').append(messageHtml);
    $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight);
}

function sendMessage() {
    var message = $('#message-input').val();
    var formData = {
        message: message,
        UserName: localStorage.getItem("UserName"),
        Type: 1
    };
    if (message.trim() !== '') {
        socket.emit('send_message', formData);
        $('#message-input').val('');
    }
}

function toggleGifSearch() {
    var messageInput = $('#message-input');
    if (messageInput.attr('placeholder') === 'Type your message here...') {
        messageInput.attr('placeholder', 'Search GIFs...');
        $('#send-button').attr('onclick', 'searchGIFs()').text('Search');
    } else {
        messageInput.attr('placeholder', 'Type your message here...');
        $('#send-button').attr('onclick', 'sendMessage()').text('Send');
    }
}

function searchGIFs() {
    var searchTerm = $('#message-input').val();
    if (searchTerm.trim() !== '') {
        var search_url = "https://g.tenor.com/v1/search?key=" + apikey + "&q=" + searchTerm + "&limit=" + lmt;
        httpGetAsync(search_url, displayGIFs);
    }
}
function toggleModal() {
    const modal = document.getElementById('modal');
    modal.classList.toggle('hidden');
}


function displayGIFs(responsetext) {
    var response_objects = JSON.parse(responsetext);
    var gifs = response_objects["results"];
    var gifHtml = gifs.map(gif => `<img src="${gif.media[0].tinygif.url}" class="gif w-full h-40 object-cover p-2 rounded" onclick="sendGIF('${gif.media[0].tinygif.url}')">`).join("");
    document.getElementById('gif-container').innerHTML = gifHtml;
    toggleModal();
}


function sendGIF(gifUrl) {
    var formData = {
        message: gifUrl,
        UserName: localStorage.getItem("UserName"),
        Type: 2
    };
    socket.emit('send_message', formData);
    toggleGifSearch();
    toggleModal();
    $('#message-input').val('');
}

$(document).ready(function() {
    Swal.fire({
        title: "Submit your Name",
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: false,
        confirmButtonText: "Submit",
        showLoaderOnConfirm: true,
        preConfirm: (username) => {
            localStorage.setItem("UserName", username);
            socket.emit('connect_user', {username: username});
        },
    });
});
