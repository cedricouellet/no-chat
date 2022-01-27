// Constants
const MAX_MESSAGE_LENGTH = 500;
const NOTIFICATION_FAVICON = './icon/notification.ico';

// socket.io server event IDs
const EV_MESSAGE = "message";
const EV_CHAT_MESSAGE = "chat_message";
const EV_JOIN = "join";
const EV_USERS = "users";

// DOM event IDs
const EV_SUBMIT = "submit";
const EV_MOUSEOVER = "mouseover";

// DOM elements
const faviconHolder = document.getElementById("favicon");
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const chatForm = document.getElementById("form");
const usersContainer = document.getElementById("users");

// Session storage variables
let username = sessionStorage.getItem("username") || "Guest";

// Notification senders
const notifier = new BrowserNotifier(window);
const notificationDisplayer = new NotificationDisplayer(faviconHolder, NOTIFICATION_FAVICON);

// Client socket
const socket = io();

// Socket event listeners
socket.emit(EV_JOIN, username);
socket.on(EV_JOIN, onJoin);
socket.on(EV_MESSAGE, onMessageReceived);
socket.on(EV_USERS, onUsersReceived);

// DOM event listeners
chatForm.addEventListener(EV_SUBMIT, onSubmitClicked);
window.addEventListener(EV_MOUSEOVER, () => notificationDisplayer.clearNotifications());

/**
 * When the user joins
 * @param {string} givenUsername The username received from the server socket.
 */
function onJoin(givenUsername) {
  username = givenUsername;
  sessionStorage.setItem("username", username);
}

/**
 * When a message is received from the server socket
 * @param {{sender: string, text: string}} messageObject The message object to display.
 */
function onMessageReceived(messageObject) {
  if (messageObject?.sender !== username) {
    notificationDisplayer.addNotification();
  }

  displayMessage(messageObject);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * When the submit button is clicked.
 * @param {Event} e The button click event
 */
function onSubmitClicked(e) {
  e.preventDefault();

  let message = messageInput.value.trim();
  if (message === "") return;

  if (message.length > MAX_MESSAGE_LENGTH) {
    message = message.substring(0, MAX_MESSAGE_LENGTH) + "...";
  }

  socket.emit(EV_CHAT_MESSAGE, message);
  messageInput.value = "";
}

/**
 * Display an incoming message.
 * @param {{sender: string, text: string}} messageObject The message object to display.
 */
function displayMessage(messageObject) {
  const container = document.createElement("div");
  container.classList.add("message");

  if (messageObject.sender === username) {
    container.classList.add("outgoing-message");
  } else {
    container.classList.add("incoming-message");
  }

  const senderParagraph = document.createElement("p");
  senderParagraph.classList.add("meta");
  senderParagraph.innerText = messageObject?.sender;

  const senderTimeSpan = document.createElement("span");
  senderTimeSpan.innerText = getFormattedTime();

  senderParagraph.appendChild(senderTimeSpan);

  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("text");
  messageParagraph.innerText = messageObject?.text;

  container.appendChild(senderParagraph);
  container.appendChild(messageParagraph);

  messagesContainer.appendChild(container);
}

/**
 * Displays usernames on the DOM
 * @param {string[]} usernamesList The list of usernames to display.
 */
function onUsersReceived(usernamesList) {
  usersContainer.innerHTML = "";

  usernamesList.forEach((username) => {
    const user = document.createElement("li");
    user.innerText = username;
    usersContainer.appendChild(user);
  });
}

/**
 * Gets the current time and formats it to xx:xx PM / AM
 * @return {string} The current formatted time.
 */
function getFormattedTime() { 
  const now = new Date();

  const suffix = now.getHours() >= 12 ? " PM" : " AM";

  let hours = now.getHours() % 12;
  if (hours === 0) hours = 12;

  let minutes = now.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} ${suffix}`;
}