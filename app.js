const path = require("path");
const helmet = require("helmet");
const http = require("http");
const socketIoServer = require("socket.io");
const express = require("express");

const { events } = require("./helpers/constants");
const sanitizer = require("./helpers/sanitizer");
const messaging = require("./helpers/messaging");
const users = require("./helpers/users");

const PORT = parseInt(process.env.PORT) || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIoServer(server);

app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

io.on(events.CONNECT, (socket) => {
  console.log(`client socket ${socket.id} connected`);

  socket.on(events.JOIN, (username) => {
    const joined = users.add(socket.id, username);

    socket.emit(events.JOIN, joined.username);

    socket.emit(
      events.MESSAGE,
      messaging.generateServerMessage("Welcome to NoChat :-)")
    );

    socket.broadcast.emit(
      events.MESSAGE,
      messaging.generateServerMessage(`${joined.username} has joined the chat.`)
    );

    io.emit(events.USERS, users.getUsernames());
  });

  socket.on(events.DISCONNECT, () => {
    const left = users.getById(socket.id);

    if (left) {
      users.remove(left.id);

      io.emit(
        events.MESSAGE,
        messaging.generateServerMessage(`${left.username} has left the chat.`)
      );
    }

    io.emit(events.USERS, users.getUsernames());
  });

  socket.on(events.CHAT_MESSAGE, (message) => {
    const messageObject = {
      sender: users.getById(socket.id).username,
      text: sanitizer.sanitize(message, "*", 2),
      time: messaging.generateFormattedDate(),
    };

    io.emit(events.MESSAGE, messageObject);
  });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
