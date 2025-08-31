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

  // Show role tag for sender
  if (msg.username === username) {
    if (isAdmin) {
      const tag = document.createElement("span");
      tag.className = "admin-tag";
      tag.textContent = "Admin";
      nameSpan.appendChild(tag);
    } else if (isModerator) {
      const tag = document.createElement("span");
      tag.className = "moderator-tag";
      tag.textContent = "Mod";
      nameSpan.appendChild(tag);
    }
  }

  div.appendChild(nameSpan);

  const textDiv = document.createElement("div");
  textDiv.textContent = msg.text;
  div.appendChild(textDiv);

  const timeDiv = document.createElement("div");
  timeDiv.className = "timestamp";
  timeDiv.textContent = msg.time;
  div.appendChild(timeDiv);

  // Show delete/reply buttons if current user is mod/admin and not the sender
  if ((isAdmin || isModerator) && msg.username !== username) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      db.ref("messages/" + key).remove();
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
}

function updateTyping() {
  db.ref("typingStatus").set(username);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    db.ref("typingStatus").remove();
  }, 1000);
}
