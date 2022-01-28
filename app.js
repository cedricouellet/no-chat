
const path = require("path");
const helmet = require("helmet");
const http = require("http");
const socketIO = require("socket.io");
const {Socket} = require("socket.io");
const express = require("express");

const { events } = require("./lib/constants");
const messaging = require("./lib/messaging");
const users = require("./lib/users");
const isZalgo = require("./helpers/isZalgo");

const PORT = parseInt(process.env.PORT) || 3000;

// Create the express listener
const app = express();

// Create an underlying http server using the express listener
// (needed for socket.io)
const server = http.createServer(app);

// Create the socket.io socket for the server

// LINT: SocketIO is a valid function
// noinspection JSValidateTypes
const io = socketIO(server);

// Prevent XSS
app.use(helmet());

// Serve the client website
app.use(express.static(path.join(__dirname, "public")));

// Handle new socket connections
try {
  io.on(events.CONNECT, onClientSocketConnected);
} catch (err) {
  console.log(`A socket error occured: ${err}`);
}

// Start the server listener
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

/**
 * When a client socket connects
 * @param {Socket} socket The client socket that connected.
 */
function onClientSocketConnected(socket) {
  console.log(`client socket ${socket.id} connected`);

  // When a user joins
  socket.on(events.JOIN, (username) => {
    joinUser(socket, username);
    console.log(`client socket ${socket.id} joined chat as '${username}'`);
  });

  // When a user disconnects
  socket.on(events.DISCONNECT, () => {
    disconnectClient(socket);
    console.log(`client socket ${socket.id} disconnected`);
  });

  // When a user sends a message
  socket.on(events.MESSAGE, (message) => {
    receiveMessage(socket, message);
    console.log(`client socket ${socket.id} sent '${message}'`);
  });
}

/**
 * When a client socket disconnects
 * @param {Socket} socket The client socket that disconnected
 */
function disconnectClient(socket) {
  try {
    const left = users.getById(socket.id);

    if (left) {
      // We remove the user from the list
      users.remove(left.id);

      // Then notify all clients that this client has disconnected
      io.emit(
        events.MESSAGE,
        messaging.generateServerMessage(`${left.username} has left the chat.`)
      );
    }

    // Send the updated list of usernames to all clients
    io.emit(events.USERS, users.getUsernames());
  } catch (err) {
    console.log(`An error occured while disconnecting a user: ${err}`);
  }
}

// noinspection JSCheckFunctionSignatures
/**
 * When a user sends a message
 * @param {Socket} socket The client socket that sent the message
 * @param {string} message The message that was received
 */
function receiveMessage(socket, message) {
  try {
    // Get the current client that sent the message
    const sender = users.getById(socket.id)?.username;

    // If their connection was somehow interrupted
    if (sender === undefined) {
      // Let them know something went wrong
      socket.emit(events.MESSAGE,
        messaging.generateServerMessage("Your connection was lost...\n\nTry refreshing the page!")
      );

      return;
    }

    // Otherwise if their message contains zalgo text
    if (isZalgo(message)) {
      // Let them know they can't do that
      socket.emit(events.MESSAGE,
        messaging.generateServerMessage("Nice try, but Zalgo is not allowed...")
      );

      return;
    }

    // Create the message that will be sent
    const messageObject = {
      sender: sender,
      text: message.trim(),
    };

    // Send the message to all clients
    io.emit(events.MESSAGE, messageObject);
  } catch (err) {
    // If something goes wrong with the message, let the sender know
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

/**
 * Join a user in the chat
 * @param {Socket} socket The socket attached to the client
 * @param {string} username The username sent by the client
 */
function joinUser(socket, username) {
  try {
    // If the username contains zalgo
    if (isZalgo(username.trim())) {
      // Give them a new username
      username = "I think I'm funny because I use Zalgo";
    }

    // Add the user to the list
    const joined = users.add(socket.id, username);

    // Send them their verified (and maybe altered) username
    socket.emit(events.JOIN, joined.username);

    // Welcome the client that joined
    socket.emit(
      events.MESSAGE,
      messaging.generateServerMessage("Welcome to NoChat :-)")
    );

    // Notify all clients except the one that joined,
    // that a new user has joined the chat
    socket.broadcast.emit(
      events.MESSAGE,
      messaging.generateServerMessage(`${joined.username} has joined the chat.`)
    );

    // Send every user the updates list of usernames
    io.emit(events.USERS, users.getUsernames());
  } catch (err) {
    console.log(`An error occured while joining a user: ${err}`);
  }
}
