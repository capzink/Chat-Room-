const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById("room-name")
const userList = document.getElementById('users')


//get username and room from url
const { username, room} = Qs.parse(location.search , {
  ignoreQueryPrefix: true
})


const socket = io()

//join chatroom
socket.emit('joinroom', {username, room})

//get room from user

socket.io('roomusers', {username, room})
outputRoomName(room)
outputUsers(users)


//message from server
socket.on('message', message =>{
  console.log(message);
  outputMessage(message)

  //scroll down
  chatMessages.scrollTop =chatMessages.scrollHeight
})

//message submit
chatForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  // get message text
  const msg = e.target.elements.msg.value
  //emit message to server
  socket.emit('chatmessage', msg)

  //clear input
  e.target.elements.msg.value =''
  e.target.elements.msg.focus();

})


//output message to dom
function outputMessage(message){
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
                    <p class="text">
                        ${message.text}
                    </p>`;
                    document.querySelector('.chat-messages').appendChild(div)
}

// add room name to DOM
function outputRoomName (room){
  roomName.innerText = room
}

//add users to DOM

function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}