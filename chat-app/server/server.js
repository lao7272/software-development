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


let users = [];


io.on("connection", socket => {
    console.log(socket.id);
    const newUser = {
        socketId: socket.id,
    }
    users.push(newUser);
    io.sockets.emit("get-users", users);
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
    });
    socket.on("disconnect", () => {
        const newUsers = users.filter(user => user.socketId !== socket.id);
        users = newUsers;
    })
});

const PORT = 3000;
httpServer.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
instrument(io, { auth: false , mode: "development"});



//const userIo = io.of('/user');

// userIo.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     if(token){
//         socket.username = getUsernameFromToken(token);
//         next();
//     } else {
//         next(new Error("Token required"))
//     }
// })
// const getUsernameFromToken = (token) => {
//     return token
// }

// userIo.on("connection", socket => {
//     console.log(`Connected to server with username: ${socket.username}`)
// });