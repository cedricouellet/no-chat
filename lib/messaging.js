const {BOT_NAME} = require('./constants');

/**
 * Generate a message coming from the server.
 * @param {string} message The message to send.
 * @return {{sender: string, text: string}|any} The message object containing the sender and text.
 */
function generateServerMessage(message) {
  return {
    sender: BOT_NAME,
    text: message,
  };
}

/**
 * Server messaging functions
 */
module.exports = {
  generateServerMessage,
};
