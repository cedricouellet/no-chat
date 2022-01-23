const EV_MESSAGE = "message";
const EV_CHAT_MESSAGE = "chat_message";
const EV_SUBMIT = "submit";

let username = sessionStorage.getItem('username') ?? 'Hackerman';
console.log(username);

const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const chatForm = document.getElementById("form");

const socket = io();




socket.on(EV_MESSAGE, (message) => {
  console.log(message);
  displayMessage(message);
});

// When a message is submitted
chatForm.addEventListener(EV_SUBMIT, (e) => {
  e.preventDefault();

  // Fetch text from message input and trim spaces
  const msg = messageInput.innerText.trim();

  // If it is empty, we do not send it
  if (msg === "") return;

  // We send the message to the server
  socket.emit(EV_CHAT_MESSAGE, msg);
});

function displayMessage(message) {
  const container = document.createElement("div");
  container.classList.add("message");

  const senderParagraph = document.createElement("p");
  senderParagraph.classList.add("meta");
  senderParagraph.innerText = "Brad";

  const senderTimeSpan = document.createElement("span");
  senderTimeSpan.innerText = "9:00pm";

  senderParagraph.appendChild(senderTimeSpan);

  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("text");
  messageParagraph.innerText = message;

  container.appendChild(senderParagraph);
  container.appendChild(messageParagraph);

  messagesContainer.appendChild(container);
}
