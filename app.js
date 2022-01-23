const path = require('path');
const helmet = require('helmet');
const http = require('http');
const socketIoServer = require('socket.io');
const express = require('express');

const PORT = parseInt(process.env.PORT) || 3000;

const EV_CONNECT = 'connection';
const EV_MESSAGE = 'message';
const EV_CHAT_MESSAGE = 'chat_message';
const EV_DISCONNECT = 'disconnect';

const app = express();
const server = http.createServer(app);
const io = socketIoServer(server);

// Express middlewares
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// Listen for socket connections
io.on(EV_CONNECT, (socket) => {
  console.log(`client socket ${socket.id} connected`);

  // Welcome the new user
  socket.emit(EV_MESSAGE, 'Welcome to NoChat!');

  // Send to all users except the new user
  socket.broadcast.emit(EV_MESSAGE, 'A user has joined the chat.');

  // When a user disconnects
  socket.on(EV_DISCONNECT, () => {
    io.emit(EV_MESSAGE, 'A user has left the chat.');
  });

  // When a user sends a message
  socket.on(EV_CHAT_MESSAGE, (message) => {
    // We broadcast it to every user
    io.emit(EV_MESSAGE, message);
  });
});

// Start Express server
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
