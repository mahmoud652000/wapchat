const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 3005;

mongoose
  .connect("mongodb://127.0.0.1:27017/chat-app")
  .then(() => console.log("✅ تم الاتصال بـ MongoDB"))
  .catch((err) => console.error("❌ خطأ في الاتصال:", err));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client"))); // استضافة ملفات HTML

let rooms = ["عام", "برمجة", "تصميم"];

// API: تسجيل مستخدم
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "البريد موجود مسبقًا" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });
  res.json({ message: "تم التسجيل بنجاح" });
});

// API: تسجيل الدخول
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "المستخدم غير موجود" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "كلمة المرور خاطئة" });

  const token = jwt.sign({ id: user._id, name: user.name }, "secret123");
  res.json({ token, name: user.name });
});

// API: الغرف
app.get("/api/rooms", (req, res) => {
  res.json(rooms);
});

app.post("/api/rooms", (req, res) => {
  const { name } = req.body;
  if (!rooms.includes(name)) {
    rooms.push(name);
    res.json({ message: "تم إنشاء الغرفة", rooms });
  } else {
    res.status(400).json({ message: "الغرفة موجودة مسبقًا" });
  }
});

// WebSocket
io.on("connection", (socket) => {
  console.log("🔌 مستخدم متصل");

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    socket.to(room).emit("message", {
      username: "النظام",
      message: `${username} انضم إلى الغرفة`,
    });
  });

  socket.on("chatMessage", ({ username, room, message }) => {
    io.to(room).emit("message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("❌ مستخدم قطع الاتصال");
  });
});

server.listen(PORT, () => {
  console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
});
