let username = '';
let isModerator = false;
let isAdmin = false;
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

  if (roleCode === "mod") isModerator = true;
  if (roleCode === "admin") {
    isAdmin = true;
    isModerator = true;
    document.getElementById("clearBtn").style.display = "inline-block";
    document.getElementById("auditLog").style.display = "block";
  }

  document.getElementById("usernameModal").style.display = "none";

  const userId = Math.random().toString(36).substr(2, 10);
  userRef = db.ref("presence/" + userId);

  const userData = {
    name: username,
    role: isAdmin ? "Admin" : isModerator ? "Mod" : "User"
  };

  userRef.set(userData);
  userRef.onDisconnect().remove();

  db.ref("presence").on("value", snapshot => {
    const admins = [], mods = [], users = [];
    snapshot.forEach(child => {
      const { name, role } = child.val();
      if (role === "Admin") admins.push(name);
      else if (role === "Mod") mods.push(name);
      else users.push(name);
    });

    document.getElementById("adminsList").innerHTML = admins.length
      ? admins.map(n => `<span class="admin">${n}</span>`).join("<br>")
      : "None";

    document.getElementById("modsList").innerHTML = mods.length
      ? mods.map(n => `<span class="mod">${n}</span>`).join("<br>")
      : "None";

    document.getElementById("usersList").innerHTML = users.length
      ? users.map(n => `<span class="user">${n}</span>`).join("<br>")
      : "None";
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

  db.ref("auditLog").on("child_added", snapshot => {
    const log = snapshot.val();
    const div = document.createElement("div");
    div.textContent = log;
    document.getElementById("auditLog").appendChild(div);
  });

  db.ref("auditLog").push(`${username} joined as ${userData.role}`);
}
