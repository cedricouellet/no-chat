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

/**
 * Detects if a string contains Zalgo text.
 * @param {string} str The string to test.
 * @return {boolean} If the string contains Zalgo or not.
 */
function getZalgoScore(str) {
  if (str.length == 0) return false;

  const reg = new RegExp(/([aeiouy]\u0308)|[\u0300-\u036f\u0489]/, "gi");
  const trueLength = str.normalize("NFD").replace(/[\u0300-\u036f]/, "g").length;
  let rawScore = 0;

  str.split("").forEach(char => {
    if (reg.test(char)) rawScore++;
  });
  
  return rawScore / trueLength > 0.8;
}

module.exports = {
  generateServerMessage,
  getZalgoScore,
};
