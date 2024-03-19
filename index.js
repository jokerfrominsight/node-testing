import express from "express";
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

let iterationCount = 0;
let dataToSend = {};
const liveCdieG = 11.15;

const contractExpiry = [
  "DIJ24",
  "DIK24",
  "DIM24",
  "DIN24",
  "DIQ24",
  "DIU24",
  "DIV24",
  "DIX24",
  "DIZ24",
  "DIF25",
  "DIG25",
  "DIH25",
  "DIJ25",
  "DIN25",
  "DIV25",
  "DIF26",
  "DIJ26",
  "DIN26",
  "DIV26",
  "DIF27",
  "DIJ27",
  "DIN27",
  "DIV27",
  "DIF28",
  "DIJ28",
  "DIN28",
  "DIV28",
  "DIF29",
  "DIF30",
  "DIF31",
  "DIF32",
  "DIF33",
];

io.on("connection", (socket) => {
  console.log("A user conencted", socket.id);
  socket.emit("connected", "You are now connected to the bhavesh server!");
  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on("updateonserver", (msg) => {
    io.emit("message", msg);
  });
});
setInterval(() => {
  io.emit("change", "Hello Bhavesh this side.");
}, 5000);
server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
