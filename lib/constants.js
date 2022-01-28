/**
 * The name of the server bot.
 * @type {string}
 */
module.exports.BOT_NAME = "NoChat Bot";

/**
 * Socket.io events, including custom entries.
 * @type {object}
 */
module.exports.events = {
  /**
   * Event for client socket connection.
   */
  CONNECT: "connection",

  /**
   * Event for client socket disconnection.
   */
  DISCONNECT: "disconnect",

  /**
   * Event for a connected client socket joining the chat, and sending it its corrected username.
   */
  JOIN: "join",

  /**
   * Event for sending/reading messages to/from the connected client socket.
   */
  MESSAGE: "message",

  /**
   * Event for sending/replying to the client with the list of usernames.
   */
  USERS: "users",
};
