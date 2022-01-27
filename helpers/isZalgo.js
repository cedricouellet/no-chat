/**
 * Detects if a string contains Zalgo text.
 * @param {string} str The string to test.
 * @return {boolean} If the string contains Zalgo or not.
 */
function isZalgo(str) {
  if (str.length === 0) return false;

  const reg = new RegExp(/([aeiouy]\u0308)|[\u0300-\u036f\u0489]/, "gi");
  const charBites = str.match(/[\s\S]{1,3}/g).length;
  let rawScore = 0;

  str.split("").forEach(char => {
    if (reg.test(char)) rawScore++;
  });

  return rawScore / charBites >= 1;
}

module.exports = isZalgo;