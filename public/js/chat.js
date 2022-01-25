const MAX_MESSAGE_LENGTH = 500;

// socket.io server event IDs
const EV_MESSAGE = "message";
const EV_CHAT_MESSAGE = "chat_message";
const EV_JOIN = "join";
const EV_USERS = "users";

// DOM event IDs
const EV_SUBMIT = "submit";
const EV_CLICK = "click";

const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const chatForm = document.getElementById("form");
const usersContainer = document.getElementById("users");

let username = sessionStorage.getItem("username") || "Guest";

const socket = io();

socket.emit(EV_JOIN, username);

socket.on(EV_JOIN, (givenUsername) => {
  username = givenUsername;
  sessionStorage.setItem("username", username);
});

socket.on(EV_MESSAGE, (messageObject) => {
  displayMessage(messageObject);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

socket.on(EV_USERS, (usernameList) => {
  displayUsernames(usernameList);
});

chatForm.addEventListener(EV_SUBMIT, (e) => {
  e.preventDefault();

  let msg = messageInput.value.trim();

  if (msg === "") return;

  if (msg.length > MAX_MESSAGE_LENGTH) {
    msg = msg.substring(0, MAX_MESSAGE_LENGTH) + "...";
  }

  socket.emit(EV_CHAT_MESSAGE, msg);

  messageInput.value = "";
});

/**
 * Display an incoming message.
 * @param {{sender: string, text: string, time: string}} messageObject The message object to display.
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
  senderTimeSpan.innerText = messageObject?.time;

  senderParagraph.appendChild(senderTimeSpan);

  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("text");
  messageParagraph.innerText = messageObject?.text;

  container.appendChild(senderParagraph);
  container.appendChild(messageParagraph);

  messagesContainer.appendChild(container);
}

function displayUsernames(usernamesList) {
  usersContainer.innerHTML = "";

  usernamesList.forEach((username) => {
    const user = document.createElement("li");
    user.innerText = username;
    usersContainer.appendChild(user);
  });
}
