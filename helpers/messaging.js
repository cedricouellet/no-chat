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
    time: generateFormattedDate(),
  };
}

/**
 * Generate a formatted date.
 * @return {string} The formatted date.
 */
function generateFormattedDate() {
  const now = new Date();
  const format = now.getHours() >= 12 ? "PM" : "AM";

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} ${format}`;
}

module.exports = {
  generateServerMessage,
  generateFormattedDate,
};
