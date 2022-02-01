/** The maximum length of a message */
const MAX_MESSAGE_LENGTH = 500;

/** The maximum length of a username */
const MAX_USERNAME_LENGTH = 15;

/** The favicon to set when a user received message while out of focus */
const NOTIFICATION_FAVICON = './icon/notification.ico';

/** The local storage key for notification preferences. */
const KEY_NOTIFICATIONS = "notifications";

/** The session storage key for the username. */
const KEY_USERNAME = "username";

/** When a server sends a message, or to send one */
const EV_MESSAGE = "message";

/** To send the username to the server, and getting the corrected form. */
const EV_JOIN = "join";

/** To ask the server for the list of usernames, then receiving it. */
const EV_USERS = "users";

// DOM event IDs
const EV_SUBMIT = "submit";
const EV_CHANGE = "change";
const EV_INPUT = "input";
const EV_FOCUS = "focus";
const EV_BLUR = "blur";

// DOM elements
const faviconHolder = document.getElementById("favicon");
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const messageCharCount = document.getElementById("char-count");
const chatForm = document.getElementById("form");
const usersContainer = document.getElementById("users");
const notifyCheckbox = document.getElementById("notification-checkbox");

// Session storage variables
let username = sessionStorage.getItem(KEY_USERNAME) || "Guest";
let notificationsEnabled = localStorage.getItem(KEY_NOTIFICATIONS) === 'true' || false;
notifyCheckbox.checked = notificationsEnabled;

// Utility variables
let isFocused = true;

// Notification senders
const notifier = new BrowserNotifier(window);
const notificationDisplayer = new NotificationDisplayer(faviconHolder, NOTIFICATION_FAVICON);

// Client socket
const socket = io();

// Initialize char counter
updateMessageLength();

// Socket event listeners
socket.emit(EV_JOIN, cleanUsername());
socket.on(EV_JOIN, onJoin);
socket.on(EV_MESSAGE, onMessageReceived);
socket.on(EV_USERS, onUsersReceived);

// DOM event listeners
chatForm.addEventListener(EV_SUBMIT, onSubmitClicked);

// When the window is focused
window.addEventListener(EV_FOCUS, () => {
  // Clear notifications if there are any
  isFocused = true;
  notificationDisplayer.clearNotifications();
});

// When the window is not focused
window.addEventListener(EV_BLUR, () => {
  isFocused = false;
});

// When the notification checkbox check status changes
notifyCheckbox.addEventListener(EV_CHANGE, (e) => {
  // Enable notifications and save
  notificationsEnabled = e.target.checked;
  localStorage.setItem(KEY_NOTIFICATIONS, notificationsEnabled);
});

// When the input changes, update char count
messageInput.addEventListener(EV_INPUT, (e) => {
  preventMessageOverflow(e);
  updateMessageLength();
});


/**
 * When the user joins
 * @param {string} givenUsername The username received from the server socket.
 */
function onJoin(givenUsername) {
  // Save the username to session storage
  username = givenUsername;
  sessionStorage.setItem(KEY_USERNAME, username);
}

/**
 * When a message is received from the server socket
 * @param {{sender: string, text: string, errorLevel: number}} messageObject The message object to display.
 */
function onMessageReceived(messageObject) {
  // Do not show/send notifications if the message received was the one composed by the current user
  if (messageObject?.sender !== username) {
    notificationDisplayer.addNotification();

    // Make sure notifications are enabled and that the window is not focused
    if (notificationsEnabled === true && isFocused === false) {
      notifier.notify(`${messageObject?.sender}: ${messageObject?.text}`);
    }
  }

  // Display the message and scroll down to it
  displayMessage(messageObject);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * When the submit button is clicked.
 * @param {Event} e The button click event
 */
function onSubmitClicked(e) {
  e.preventDefault();

  // Do not continue if the message is empty
  let message = messageInput.value.trim();
  if (message === "") return;

  // If the message is too long, we shorten it
  if (message.length > MAX_MESSAGE_LENGTH) {
    message = cutText(message, MAX_MESSAGE_LENGTH);
  }

  // We send the message to the server socket
  socket.emit(EV_MESSAGE, message);
  messageInput.value = "";

  // Clear the char counter
  updateMessageLength();
}

/**
 * Update the message length on the DOM.
 */
function updateMessageLength() {
  const maxDigits = MAX_MESSAGE_LENGTH.toString().length;
  const strCount = messageInput.value.length.toString().padStart(maxDigits, '0');

  messageCharCount.innerText = `${strCount}/${MAX_MESSAGE_LENGTH}`;

  if (messageInput.value.length >= MAX_MESSAGE_LENGTH && !messageCharCount.classList.contains("over")) {
    messageCharCount.classList.add("over");
    return;
  }
  if (messageInput.value.length < MAX_MESSAGE_LENGTH && messageCharCount.classList.contains("over")) {
    messageCharCount.classList.remove("over");
  }
}

/**
 * Prevent message input going past the limit.
 * @param {Event} e The input event.
 */
function preventMessageOverflow(e) {
  e.preventDefault();

  const message = messageInput.value;

  if (message.length >= MAX_MESSAGE_LENGTH) {
    messageInput.value = messageInput.value.substring(0, MAX_MESSAGE_LENGTH);
  }
}

/**
 * Display an incoming message.
 * @param {{sender: string, text: string, errorLevel: number}} messageObject The message object to display.
 */
function displayMessage(messageObject) {
  // Create the container
  const container = document.createElement("div");
  container.classList.add("message");

  // Assign it a CSS class indicating if the message is incoming ot outgoing
  // Ex: different colors for each
  if (messageObject.sender === username) {
    container.classList.add("outgoing-message");
  } else if (messageObject.errorLevel === 0) {
    container.classList.add("incoming-message");
  } else {
    container.classList.add("error-message");
  }

  // Assign the sender to a DOM element
  const senderParagraph = document.createElement("p");
  senderParagraph.classList.add("meta");
  senderParagraph.innerText = messageObject?.sender;

  // Assign the message reception time to a DOM element
  const senderTimeSpan = document.createElement("span");
  senderTimeSpan.innerText = getFormattedTime();

  // Assign the message text to a DOM element
  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("text");
  messageParagraph.innerText = messageObject?.text;

  // Make the sender time a child of the sender paragraph
  senderParagraph.appendChild(senderTimeSpan);

  // Add elements to the container
  container.appendChild(senderParagraph);
  container.appendChild(messageParagraph);

  // Append the container to the DOM
  messagesContainer.appendChild(container);
}

/**
 * Displays usernames on the DOM
 * @param {string[]} usernamesList The list of usernames to display.
 */
function onUsersReceived(usernamesList) {
  // Empty before re-rendering
  usersContainer.innerHTML = "";

  // Render all usernames in its container
  usernamesList.forEach((username) => {
    const user = document.createElement("li");
    user.innerText = username;
    usersContainer.appendChild(user);
  });
}

/**
 * Cut text if it is above a limit.
 * @param {string} text The text to cut.
 * @param {number} limit The maximum length of the text until it is cleaned.
 * @return {string} The cleaned text.
 */
function cutText(text, limit) {
  return text.trim().substring(0, limit) + "...";
}

/**
 * Clean the username
 * @return {string} The cleaned username
 */
function cleanUsername() {
  if (username.length > MAX_USERNAME_LENGTH) {
    username = cutText(username, MAX_USERNAME_LENGTH);
  }
  return username;
}

/**
 * Gets the current time and formats it to xx:xx PM / AM
 * @return {string} The current formatted time.
 */
function getFormattedTime() {
  // Get the current time
  const now = new Date();

  // Generate the AM or PM suffix depending on the time
  const suffix = now.getHours() >= 12 ? " PM" : " AM";

  // Format the time in a 12h format
  let hours = now.getHours() % 12;
  if (hours === 0) hours = 12;

  // Format the time as 00:00
  let minutes = now.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} ${suffix}`;
}
