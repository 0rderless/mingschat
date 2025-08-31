function setUsername() {
  const nameInput = document.getElementById("usernameInput").value.trim();
  const roleCode = document.getElementById("modCodeInput").value.trim();

  if (nameInput.length < 2) {
    alert("Username must be at least 2 characters.");
    return;
  }

  username = nameInput;

  if (roleCode === "admin") {
    isAdmin = true;
    isModerator = true;
  } else if (roleCode === "mod") {
    isModerator = true;
  }

  if (isAdmin) {
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

  db.ref("auditLog").push(`${username} joined as ${userData.role}`);
}
