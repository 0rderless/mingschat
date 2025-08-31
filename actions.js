function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  const timestamp = new Date().toLocaleTimeString();
  const message = {
    username,
    text,
    time: timestamp
  };

  db.ref("messages").push(message);
  input.value = "";
  db.ref("typingStatus").remove();
}

function addMessage(msg, key) {
  if (!msg || !msg.username || !msg.text) return;

  const div = document.createElement("div");
  div.className = "message";

  const nameSpan = document.createElement("span");
  nameSpan.className = "username";
  nameSpan.textContent = msg.username;

  if (msg.username === username && isModerator) {
    const tag = document.createElement("span");
    tag.className = "moderator-tag";
    tag.textContent = "Mod";
    nameSpan.appendChild(tag);
  }

  div.appendChild(nameSpan);

  const textDiv = document.createElement("div");
  textDiv.textContent = msg.text;
  div.appendChild(textDiv);

  const timeDiv = document.createElement("div");
  timeDiv.className = "timestamp";
  timeDiv.textContent = msg.time;
  div.appendChild(timeDiv);

  if (isModerator && msg.username !== username) {
    const deleteBtn =
