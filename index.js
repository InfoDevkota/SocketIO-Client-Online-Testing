const http = require('http');

const { Server } = require('socket.io');

const handeler = (req, res) => {
    res.write("Hello World");
    res.end();
}

const server = http.createServer(handeler);

server.listen(8000);
console.log("Server started at", server.address().port);

const io = new Server(server, {
    cors: {
        origin: true,
        // origin: ["asdf"]
    }
})

const adminNS = io.of("/admin");

io.use((socket, next) => {
    let key = socket.handshake.query.key;

    if (key) {
        next();
        socket.user = {
            name: key
        }
    }
})

io.on('connection', (socket) => {
    console.log("User Connected.");

    socket.on('message', (data) => {
        let message = data.message;

        console.log("Got message", message, "from", socket.user.name);

        socket.broadcast.emit("message", {
            message,
            sender: socket.user
        })
    })
})

adminNS.on('connection', (socket) => {
    console.log("Connected to Admin NS.")
})