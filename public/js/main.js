const chatForm = document.getElementById('chat-form');
// const chatIndex = document.getElementById('chatIndex');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('message', message => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers',({room , users})=>{
  outputroom(room);
  outputusers(users);
})

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  e.target.elements.msg.value = e.target.elements.msg.value.replace(/[`~#%^&*()_|+\-;'",.<>\{\}\[\]\\\/]/gi, '');
  const msg = e.target.elements.msg.value;


  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement('div');

  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function outputroom(room) {
  roomName.innerText=room;
}
function outputusers(users) {
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
