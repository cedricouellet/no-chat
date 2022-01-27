const {BOT_NAME} = require('./constants');

/**
 * Generate a message coming from the server.
 * @param {string} message The message to send.
 * @return {{sender: string, text: string, time: string}} The message object containing the sender, text and formatted time.
 */
function generateServerMessage(message) {
  return {
    sender: BOT_NAME,
    text: message,
  };
}

module.exports = {
  generateServerMessage,
};
