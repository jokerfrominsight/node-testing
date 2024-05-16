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

let conData = "<h1>Hello World!</h1>";
// const io = new Server(server);
app.get("/", (req, res) => {
  res.send(conData);
});

let globalData = "";
let GURglobalData = "";
const usersData = {};

const hasDataChanged = (oldData, newData) => {
  if (oldData.length !== newData.length) return true;
  const len = oldData.length;
  for (let i = 0; i < len; i++) {
    if (parseFloat(oldData[i]) !== parseFloat(newData[i])) {
      return true;
    }
  }
  return false;
};
const emitEventToITM = (ITM, data) => {
  // console.log(ITM);
  if (ITM === "contracts") return;
  if (
    ITM.length === 3 &&
    data.length > 0 &&
    usersData.hasOwnProperty("contracts")
  ) {
    let dataToSend = {};
    dataToSend["contracts"] = usersData["contracts"];
    dataToSend[ITM] = data;
    dataToSend = JSON.stringify(dataToSend);
    // io.emit(ITM, JSON.stringify(dataToSend));
    io.to(ITM).emit("latestData", dataToSend);
    // console.log(`Event sended to ${ITM} and data ${dataToSend}.`);
  } else {
    // io.emit(ITM, "");
    io.to(ITM).emit("latestData", "");
    // console.log(`Event sended to ${ITM}.`);
  }
};
const updateUsersData = (responseData) => {
  console.log(responseData);
  for (const key in responseData) {
    if (!usersData.hasOwnProperty(key)) {
      // usersData[key] = responseData[key];
      emitEventToITM(key, responseData[key]);
    } else {
      if (hasDataChanged(usersData[key], responseData[key])) {
        emitEventToITM(key, responseData[key]);
      }
    }
    usersData[key] = responseData[key];
  }
};
io.on("connection", (socket) => {
  // console.log("A user conencted", socket.id);
  io.emit("message", globalData);
  socket.on("firstTimeConnect", (ITM) => {
    console.log(`${ITM} connected.`);
    socket.join(ITM);
    if (usersData.hasOwnProperty(ITM)) {
      emitEventToITM(ITM, usersData[ITM]);
    } else {
      usersData[ITM] = [];
    }
  });

  socket.on("updateonserver", (responseData) => {
    updateUsersData(responseData);
    globalData = responseData;
    io.emit("message", responseData);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
