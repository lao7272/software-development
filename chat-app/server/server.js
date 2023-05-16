import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";

const app = express();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:8080']
    }
});
let user;
io.on("connection", socket => {
    user = socket.id;
    console.log(user);
});
app.get("/", (req, res) => {
    res.send(user)
})
const PORT = 8080;
server.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));