/**
 * Detects if a string contains Zalgo text.
 * @param {string} str The string to test.
 * @return {boolean} If the string contains Zalgo or not.
 */
function isZalgo(str) {
  // If empty, stop here.
  if (str.length === 0) return false;

  // Create the zalgo regex (idk how it works exactly, but it works)
  const reg = new RegExp(/([aeiouy]\u0308)|[\u0300-\u036f\u0489]/, "gi");

  // Julien magic
  const charBites = str.match(/[\s\S]{1,3}/g).length;

  // Find the chances of it being zalgo (when a lot of the characters match the regex)
  let rawScore = 0;
  str.split("").forEach(char => {
    if (reg.test(char)) rawScore++;
  });

  // Determine a boolean value based on the score
  return rawScore / charBites >= 1;
}

module.exports = isZalgo;