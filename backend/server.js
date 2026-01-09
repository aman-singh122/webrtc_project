const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static("public"));

/* ---------- ICE CONFIG (SECURE) ---------- */
const iceServers = [
  { urls: process.env.TWILIO_STUN_URL },
  {
    urls: process.env.TWILIO_TURN_URL,
    username: process.env.TWILIO_USERNAME,
    credential: process.env.TWILIO_CREDENTIAL
  }
];

/* ---------- SOCKET.IO ---------- */
io.on("connection", socket => {
  console.log("User connected:", socket.id);

  // Send ICE config once on connection
  socket.emit("ice-config", iceServers);

  // Relay signaling data
  ["offer", "answer", "candidate"].forEach(event => {
    socket.on(event, data => {
      socket.broadcast.emit(event, data);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
