
import { io } from "socket.io-client"

const joinRoomButton = document.getElementById("room-button");
const messageContainer = document.getElementById("message-container")
const form = document.getElementById("form");
const messageInput = document.getElementById("message-input");
const roomIput = document.getElementById("room-input");

const socket = io("http://localhost:3000");
socket.on("connect", () => {
    displayMessage(`You are connected with id: ${socket.id}`);
});
socket.on("get-users", (users) => {
    const getCurrUser = users.find(user => user.socketId === socket.id);
    console.log(users, getCurrUser)
});

socket.on("receive-message", (message) => {
    displayMessage(message)
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    const room = roomIput.value;
    
    if(message === "") return;
    
    displayMessage(message, true);
    socket.emit("send-message", message, room);
    
    messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
    const room = roomIput.value;
    socket.emit("join-room", room, message => {
        displayMessage(message)
    });
    
    
});

const displayMessage = (message, isLocalUser) => {
    const localUser = isLocalUser ? "local-user" : "";
    const div = document.createElement("div");
    div.textContent = message;
    if(localUser) {
        div.classList.add('message', localUser)
    } else {
        div.classList.add('message');
    } 
    messageContainer.append(div);
    scrollToBottom();
}
const scrollToBottom = () => {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// const userSocket = io("http://localhost:3000/user", {auth: {token: "test"}})