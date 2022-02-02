const {BOT_NAME} = require('./constants');

/**
 * Generate a message coming from the server.
 * @param {string} message The message to send.
 * @return {{sender: string, text: string, errorLevel: number}|any} The message object containing the sender and text.
 */
function generateServerMessage(message) {
  return {
    sender: BOT_NAME,
    text: message,
    errorLevel: 0,
  };
}

/**
 * Generate an error message coming from the server.
 * @param {string} message The message to send.
 * @return {{sender: string, text: string, errorLevel: number}|any} The message object containing the sender and text.
 */
function generateErrorMessage(message) {
  return {
    sender: BOT_NAME,
    text: message,
    errorLevel: 1,
  };
}

/**
 * Server messaging functions
 */
module.exports = {
  generateServerMessage,
  generateErrorMessage,
};
