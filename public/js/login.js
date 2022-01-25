const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username-input");

loginForm.addEventListener("submit", (e) => {
  const potentialUsername = usernameInput.value.trim();

  if (potentialUsername === "") return;

  sessionStorage.setItem("username", potentialUsername);
});
