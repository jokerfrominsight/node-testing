import express, { response } from "express";
import cors from "cors";
import axios from "axios";
import http from "http";
import { Server } from "socket.io";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const app = express();
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    //  [
    //   "https://insight.corp.hertshtengroup.com",
    //   "http://localhost:3030",
    // ], // Specify the origin of your client
    methods: ["GET", "POST"], // Specify the methods allowed
    credentials: false, // Set to true if you're using credentials
  },
  httpsCompression: false,
  httpCompression: false,
  perMessageDeflate: false,
});

let conData = "";
// const io = new Server(server);
app.get("/", (req, res) => {
  res.send(conData);
});

let globalData = "";
let GURglobalData = "";
const usersData = {};
io.on("connection", (socket) => {
  console.log("A user conencted", socket.id);
  io.emit("message", globalData);

  socket.on("updateonserver", (msg) => {
    globalData = msg;
    io.emit("message", msg);
  });
  socket.on("updateFromGUR", (msg) => {
    GURglobalData = msg;
    io.emit("GUREvent", msg);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
