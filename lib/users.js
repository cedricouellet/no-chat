const { BOT_NAME } = require("./constants");

/**
 * The list of users
 * @type {[{id: string, username: string}]}
 */
let users = [];

/**
 * Add a user to the list of users.
 * @param {string} id The unique identifier of the user.
 * @param {string} username The username of the user.
 * @return {{id: string|any, username: string|any}} The user that was added.
 */
function add(id, username) {
  // Trim white-spaces
  id = id.trim();
  username = username.trim();

  // Try to find an already existing username
  let existing = users.find((user) => user.username === username);

  // If a username does exists or it is the same as the bot name
  if (existing !== undefined || username === BOT_NAME) {
    let i = 1;
    // We add the count of duplicates to obtain a unique variation
    // While it is still not unique, we keep checking for a unique value
    while (existing !== undefined) {
      existing = users.find((user) => user.username === `${username}(${i})`);
      i++;
    }
    // Then modify the username to the count
    username = `${username}(${i})`;
  }

  // We assign the user to an object then add it to the list
  const user = { id, username };
  users.push(user);

  // Then return the newly created user.
  return user;
}

/**
 * Get a user by their unique identifier.
 * @param {string} id The identifier of the user.
 * @return {{id: string, username: string}} The user object if found, or undefined.
 */
function getById(id) {
  return users.find((user) => user.id === id);
}

/**
 * Remove a user by their unique identifier.
 * @param {string} id The identifier of the user.
 */
function remove(id) {
  users = users.filter((user) => user.id !== id);
}

/**
 * Get the list of usernames that are connected.
 * @return {[string]} The list of usernames.
 */
function getUsernames() {
  return users.map((user) => user.username);
}

/**
 * User operations.
 */
module.exports = {
  add,
  getById,
  remove,
  getUsernames,
};
