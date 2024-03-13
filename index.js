import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
import http from "http";
import { Server } from "socket.io";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://insight.corp.hertshtengroup.com", // Specify the origin of your client
    methods: ["GET", "POST"], // Specify the methods allowed
    // credentials: true, // Set to true if you're using credentials
  },
});

// const io = new Server(server);
app.get("/", (req, res) => {
  res.send("<h1>Hello World - Bhavesh Kumar 123</h1>");
});

let iterationCount = 0;
io.on("connection", (socket) => {
  console.log("A user conencted");
  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  const intervalId = setInterval(() => {
    iterationCount++;
    var randomNumber = parseInt(Math.random() * 100) + 1;
    // if (randomNumber > 50) {
    io.emit("message", randomNumber);
    // }
    if (iterationCount === 10) {
      console.log("Stopping the server after 10 iterations.");
      clearInterval(intervalId); // Stop the interval
      server.close(); // Stop the server
      throw new Error("Intentional error on the 10th iteration");
    }
  }, 1000);
  //   setInterval(() => {
  //     var randomNumber = parseInt(Math.random() * 100) + 1;
  //     if (randomNumber > 50) {
  //       io.emit("message", randomNumber);
  //     }
  //   }, 1000);
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
