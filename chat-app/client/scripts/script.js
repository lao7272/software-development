
import { io } from "socket.io-client"
const socket = io("http://localhost:8080");

const joinRoomButton = document.getElementById("room-button");
const sendMessageButton = document.getElementById("message-button");
const form = document.getElementById("form");
const messageInput = document.getElementById("message-input");
const roomIput = document.getElementById("room-input");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    const room = roomIput.value;

    if(message === "") return;

    displayMessage(message);

    messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
    const room = roomIput.value;
});

const displayMessage = (message) => {
    const div = document.createElement("div");
    div.textContent = message;
    div.classList.add(["message"])
    document.getElementById("message-container").append(div);
}