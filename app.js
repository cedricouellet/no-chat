const path = require("path");
const helmet = require("helmet");
const http = require("http");
const socketIO = require("socket.io");
const express = require("express");

const { events } = require("./lib/constants");
const messaging = require("./lib/messaging");
const users = require("./lib/users");
const isZalgo = require("./helpers/isZalgo");

const PORT = parseInt(process.env.PORT) || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

try {
  io.on(events.CONNECT, onClientSocketConnected);
} catch (err) {
  console.log(`A socket error occured: ${err}`);
}

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

function disconnectClient(socket) {
  try {
    const left = users.getById(socket.id);

    if (left) {
      users.remove(left.id);

      io.emit(
        events.MESSAGE,
        messaging.generateServerMessage(`${left.username} has left the chat.`)
      );
    }

    io.emit(events.USERS, users.getUsernames());
  } catch (err) {
    console.log(`An error occured while disconnecting a user: ${err}`);
  }
}

function receiveChatMessage(socket, message) {
  try {
    const sender = users.getById(socket.id)?.username;

    if (sender === undefined) {
      socket.emit(events.MESSAGE,
        messaging.generateServerMessage("Your connection was lost...\n\nTry refreshing the page!")
      );

      return;
    }

    if (isZalgo(message)) {
      socket.emit(events.MESSAGE,
        messaging.generateServerMessage("Nice try, but Zalgo is not allowed...")
      );

      return;
    }

    const messageObject = {
      sender: sender,
      text: message.trim(),
    };

    io.emit(events.MESSAGE, messageObject);
  } catch (err) {
    socket.emit(
      events.MESSAGE,
      messaging.generateServerMessage(
        "Sending failed. Your message was too long or contained invalid characters."
      )
    );
    console.log(
      `An error occured while reading from client ${socket.id}: ${err}`
    );
  }
}

function joinUser(socket, username) {
  try {
    if (isZalgo(username.trim())) {
      username = "I think I'm funny because I use Zalgo";
    }

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
  } catch (err) {
    console.log(`An error occured while joining a user: ${err}`);
  }
}

function onClientSocketConnected(socket) {
  console.log(`client socket ${socket.id} connected`);

  socket.on(events.JOIN, (username) => {
    joinUser(socket, username);
    console.log(`client socket ${socket.id} joined chat as '${username}'`);
  });

  socket.on(events.DISCONNECT, () => {
    disconnectClient(socket);
    console.log(`client socket ${socket.id} disconnected`);
  });

  socket.on(events.CHAT_MESSAGE, (message) => {
    receiveChatMessage(socket, message);
    console.log(`client socket ${socket.id} sent '${message}'`);
  });
}
