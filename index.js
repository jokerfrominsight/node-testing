import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
import http from "http";
import { Server } from "socket.io";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://insight.corp.hertshtengroup.com/", // Specify the origin of your client
    methods: ["GET", "POST"], // Specify the methods allowed
    // credentials: true, // Set to true if you're using credentials
  },
});

// const io = new Server(server);
app.get("/", (req, res) => {
  res.send("<h1>Hello World - Bhavesh Kumar 123</h1>");
});

io.on("connection", (socket) => {
  console.log("A user conencted");
  socket.on("message", (msg) => {
    io.emit("message", msg);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
