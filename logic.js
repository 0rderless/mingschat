let username = '';
let isModerator = false;
let userRef = null;
let typingTimeout;

function setUsername() {
  const nameInput = document.getElementById("usernameInput").value.trim();
  const roleCode = document.getElementById("modCodeInput").value.trim();

  if (nameInput.length < 2) {
    alert("Username must be at least 2 characters.");
    return;
  }

  username = nameInput;

  if (roleCode === "mod") {
    isModerator = true;
    document.getElementById("clearBtn").style.display = "inline-block";
  }

  document.getElementById("usernameModal").style.display = "none";

  const userId = Math.random().toString(36).substr(2, 10);
  userRef = db.ref("presence/" + userId);

  const userData = {
    name: username,
    role: isModerator ? "Mod" : "User"
  };

  userRef.set(userData);
  userRef.onDisconnect().remove();

  db.ref("presence").on("value", snapshot => {
    const mods = [], users = [];
    snapshot.forEach(child => {
      const { name, role } = child.val();
      if (role === "Mod") mods.push(name);
      else users.push(name);
    });

    document.getElementById("modsList").innerHTML = mods.length
      ? mods.map(n => `<span class="mod">${n}</span>`).join("<br>")
      : "None";

    document.getElementById("usersList").innerHTML = users.length
      ? users.map(n => `<span class="user">${n}</span>`).join("<br>")
      : "None";

    document.getElementById("adminsList").innerHTML = "None"; // Admins removed
  });

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
