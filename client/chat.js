let username = localStorage.getItem("guestName");
let room = "";
let socket = null;

async function init() {
  if (!username) {
    window.location.href = "index.html";
    return;
  }

  const res = await fetch("http://localhost:3000/api/rooms");
  const rooms = await res.json();
  const list = document.getElementById("rooms");

  rooms.forEach((r) => {
    const li = document.createElement("li");
    li.innerHTML = `<button class="w-full text-right bg-gray-700 p-2 rounded hover:bg-gray-600">${r}</button>`;
    li.onclick = () => joinRoom(r);
    list.appendChild(li);
  });
}

function joinRoom(roomName) {
  room = roomName;

  document.getElementById("rooms-section").classList.add("hidden");
  document.getElementById("chat-section").classList.remove("hidden");
  document.getElementById("room-title").innerText = `غرفة: ${room}`;

  socket = io("http://localhost:3000");

  socket.emit("joinRoom", { username, room });

  socket.on("message", (data) => {
    const box = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.classList.add("mb-2");
    msg.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
  });

  document.getElementById("send").onclick = () => {
    const message = document.getElementById("message").value;
    if (message) {
      socket.emit("chatMessage", { username, room, message });
      document.getElementById("message").value = "";
    }
  };
}

window.onload = init;
