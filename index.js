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
const GurUsersData = {};

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
const emitEventToITM = (ITM, data, storedData) => {
  if (ITM === "contracts") return;
  if (
    ITM.length === 3 &&
    data.length > 0 &&
    storedData.hasOwnProperty("contracts")
  ) {
    let dataToSend = {};
    dataToSend["contracts"] = storedData["contracts"];
    dataToSend[ITM] = data;
    dataToSend = JSON.stringify(dataToSend);
    io.to(ITM).emit("latestData", dataToSend);
  } else {
    io.to(ITM).emit("latestData", {});
  }
};
const updateUsersData = (responseData) => {
  responseData = JSON.parse(responseData);
  for (const key in responseData) {
    if (!usersData.hasOwnProperty(key)) {
      emitEventToITM(`${key}`, responseData[key], usersData);
    } else {
      if (hasDataChanged(usersData[key], responseData[key])) {
        emitEventToITM(`${key}`, responseData[key], usersData);
      }
    }
    usersData[key] = responseData[key];
  }
};
const updateGURUsersData = (responseData) => {
  responseData = JSON.parse(responseData);
  for (const key in responseData) {
    if (!GurUsersData.hasOwnProperty(key)) {
      emitEventToITM(`${key}`, responseData[key], GurUsersData);
    } else {
      if (hasDataChanged(GurUsersData[key], responseData[key])) {
        emitEventToITM(`${key}`, responseData[key], GurUsersData);
      }
    }
    GurUsersData[key] = responseData[key];
  }
};
io.on("connection", (socket) => {
  io.emit("message", globalData);
  socket.on("firstTimeConnect", (ITM) => {
    // console.log(`${ITM} connected.`);
    socket.join(ITM);
    if (ITM === "POSTEST") {
      io.to("POSTEST").emit("message", globalData);
      // console.log("Response from .Net: ", new Date());
    }
    if (usersData.hasOwnProperty(ITM)) {
      emitEventToITM(ITM, usersData[ITM], usersData);
    } else {
      usersData[ITM] = [];
    }
    if (GurUsersData.hasOwnProperty(ITM)) {
      emitEventToITM(ITM, GurUsersData[ITM], GurUsersData);
    } else {
      GurUsersData[ITM] = [];
    }
  });

  socket.on("updateonserver", (responseData) => {
    updateUsersData(responseData);
    globalData = responseData;
    io.to("POSTEST").emit("message", responseData);
    console.log("Response from .Net: ", new Date());
  });
  socket.on("GURupdateonserver", (responseData) => {
    updateGURUsersData(responseData);
    GURglobalData = responseData;
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
