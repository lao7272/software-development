
import { io } from "socket.io-client"

const joinRoomButton = document.getElementById("room-button");
const messageContainer = document.getElementById("message-container")
const form = document.getElementById("form");
const messageInput = document.getElementById("message-input");
const roomIput = document.getElementById("room-input");

const socket = io("http://localhost:3000");
const userSocket = io("http://localhost:3000/user", {auth: {token: "test"}})
socket.on("connect", () => {
    displayMessage(`You are connected with id: ${socket.id}`)
});

socket.on("receive-message", (message) => {
    displayMessage(message)
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    const room = roomIput.value;
    
    if(message === "") return;
    
    displayMessage(message);
    socket.emit("send-message", message, room);

    messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
    const room = roomIput.value;
    socket.emit("join-room", room, message => {
        displayMessage(message)
    });


});

const displayMessage = (message) => {
    const div = document.createElement("div");
    div.textContent = message;
    div.classList.add(["message"])
    messageContainer.append(div);
    scrollToBottom();
}
const scrollToBottom = () => {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
