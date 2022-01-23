const path = require("path");
const helmet = require("helmet");
const http = require("http");
const socketIoServer = require("socket.io");
const express = require("express");

const sanitizer = require("./helpers/sanitizer");
const messaging = require("./helpers/messaging");
const users = require("./helpers/users");

const PORT = parseInt(process.env.PORT) || 3000;

// Builtin Socket.IO
const EV_CONNECT = "connection";
const EV_DISCONNECT = "disconnect";

// Custom events
const EV_JOIN = "join";
const EV_MESSAGE = "message";
const EV_CHAT_MESSAGE = "chat_message";
const EV_USERS = "users";

const app = express();
const server = http.createServer(app);
const io = socketIoServer(server);

app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

io.on(EV_CONNECT, (socket) => {
  console.log(`client socket ${socket.id} connected`);

  socket.on(EV_JOIN, (username) => {
    const joined = users.add(socket.id, username);

    socket.emit(
      EV_MESSAGE,
      messaging.generateServerMessage("Welcome to NoChat :-)")
    );

    socket.emit(EV_JOIN, joined.username);

    socket.broadcast.emit(
      EV_MESSAGE,
      messaging.generateServerMessage(`${joined.username} has joined the chat.`)
    );

    io.emit(EV_USERS, users.getUsernames());
  });

  socket.on(EV_DISCONNECT, () => {
    const left = users.getById(socket.id);

    if (left) {
      users.remove(left.id);

      io.emit(
        EV_MESSAGE,
        messaging.generateServerMessage(`${left.username} has left the chat.`)
      );
    }

    io.emit(EV_USERS, users.getUsernames());
  });

  socket.on(EV_CHAT_MESSAGE, (message) => {
    const messageObject = {
      sender: users.getById(socket.id).username,
      text: sanitizer.sanitize(message, "*", 2),
      time: messaging.generateFormattedDate(),
    };

    io.emit(EV_MESSAGE, messageObject);
  });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
