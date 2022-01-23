let users = [];

/**
 * Add a user to the list of users.
 * @param {string} id The unique identifier of the user.
 * @param {string} username The username of the user.
 * @return {{id: string, username: string}} The user that was added.
 */
function add(id, username) {
  let existing = users.find((user) => user.username === username);

  if (existing !== undefined) {
    let i = 0;
    while (existing !== undefined) {
      i++;
      existing = users.find((user) => user.username === `${username}(${i})`);
    }
    username = `${username}(${i})`;
  }

  const user = { id, username };

  users.push(user);

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

module.exports = {
  add,
  getById,
  remove,
  getUsernames,
};
