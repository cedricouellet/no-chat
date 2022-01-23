const profanityFilter = require("leo-profanity");

/**
 * Filter profanity from a string.
 * @param {string} str The string to filter.
 * @return {string} The filtered string.
 */
module.exports.sanitize = (str) => {
  return profanityFilter.clean(str, "*", 2);
};
