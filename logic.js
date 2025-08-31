let username = '';
let userRef = null;
let typingTimeout;

function setUsername() {
  const nameInput = document.getElementById("usernameInput").value.trim();

  if (nameInput.length < 2) {
    alert("Username must be at least 2 characters.");
    return;
  }

  username = nameInput;
  document.getElementById("usernameModal").style.display = "none";

  const userId = Math.random().toString(36).substr(2, 10);
  userRef = db.ref("presence/" + userId);
  userRef.set({ name: username });
  userRef.onDisconnect().remove();

  db.ref("messages").on("child_added", snapshot => {
    const msg = snapshot.val();
    addMessage(msg, snapshot.key);
  });

  db.ref("typingStatus").on("value", snapshot => {
    const typingUser = snapshot.val();
    document.getElementById("typingStatus").textContent = typingUser
      ? `${typingUser} is typing...`
      : "";
  });
}
