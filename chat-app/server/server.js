import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import { instrument } from "@socket.io/admin-ui"


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:8080', 'https://admin.socket.io'],
        credentials: true
    }
});

const userIo = io.of('/user');
userIo.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if(token){
        socket.username = getUsernameFromToken(token);
        next();
    } else {
        next(new Error("Token required"))
    }
})
const getUsernameFromToken = (token) => {
    return token
}
userIo.on("connection", socket => {
    console.log(`Connected to server with username: ${socket.username}`)
});

io.on("connection", socket => {
    console.log(socket.id);
    socket.on("send-message", (message, room) => {
        if(room === "") {
            socket.broadcast.emit("receive-message", message);
        } else {
            socket.to(room).emit("receive-message", message);
        }
    }); 
    socket.on("join-room", (room, cb) => {
        socket.join(room);
        cb(`Joined ${room}`)
    })
});

const PORT = 3000;
httpServer.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
instrument(io, { auth: false , mode: "development"})