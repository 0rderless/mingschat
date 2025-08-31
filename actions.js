function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  const timestamp = new Date().toLocaleTimeString();
  const message = {
    username,
    text,
    time: timestamp,
    replyTo: null
  };

  db.ref("messages").push(message);
  db.ref("auditLog").push(`${username} sent a message`);
  input.value = "";
  db.ref("typingStatus").remove();
}

function addMessage(msg, key) {
  const div = document.createElement("div");
  div.className = "message";

  const nameSpan = document.createElement("span");
  nameSpan.className = "username";
  nameSpan.textContent = msg.username;

  if (isAdmin && msg.username === username) {
    const tag = document.createElement("span");
    tag.className = "admin-tag";
    tag.textContent = "Admin";
    nameSpan.appendChild(tag);
  } else if (isModerator && msg.username === username) {
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

  if ((isAdmin || isModerator) && msg.username !== username) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      db.ref("messages/" + key).remove();
      db.ref("auditLog").push(`${username} deleted a message`);
    };
    div.appendChild(deleteBtn);

    const replyBtn = document.createElement("button");
    replyBtn.className = "reply-btn";
    replyBtn.textContent = "Reply";
    replyBtn.onclick = () => {
      document.getElementById("messageInput").value = `@${msg.username}: `;
    };
    div.appendChild(replyBtn);
  }

  document.getElementById("chat").appendChild(div);
}

function clearChat() {
  if (!isAdmin) {
    alert("Only admins can clear the chat.");
    return;
  }
  db.ref("messages").remove();
  db.ref("auditLog").push(`${username} cleared the chat`);
}

function updateTyping() {
  db.ref("typingStatus").set(username);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    db.ref("typingStatus").remove();
  }, 1000);
}
