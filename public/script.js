import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const iceServers = [
  { urls: process.env.TWILIO_STUN_URL },
  {
    urls: process.env.TWILIO_TURN_URL,
    username: process.env.TWILIO_USERNAME,
    credential: process.env.TWILIO_CREDENTIAL
  }
];

// Send ICE config securely
io.on("connection", (socket) => {
  socket.emit("ice-config", iceServers);

  socket.on("offer", offer => socket.broadcast.emit("offer", offer));
  socket.on("answer", answer => socket.broadcast.emit("answer", answer));
  socket.on("candidate", candidate => socket.broadcast.emit("candidate", candidate));
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
