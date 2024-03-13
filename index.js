import express from "express";
import cors from "cors";
import axios from "axios";
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

let conData = "";
// const io = new Server(server);
app.get("/", (req, res) => {
  res.send(conData);
});

let iterationCount = 0;
let dataToSend = {};

io.on("connection", (socket) => {
  console.log("A user conencted");
  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  setInterval(() => {
    iterationCount++;
    var randomNumber = parseInt(Math.random() * 100) + 1;
    if (randomNumber > 50) {
      io.emit("message", conData);
    }
  }, 10);
});

const filterCentralData = (d1) => {
  d1 = d1.replaceAll("\n", "");
  d1 = d1.replaceAll("\\\\", "");

  const allCentralData = d1.split(";");
  conData = allCentralData[2];
  conData = conData.slice(25, -2);
  conData = conData.split(",");
  let tempFilterData = [];
  conData.forEach((item) => {
    let tempItem = item.split(":")[0].trim();
    tempFilterData.push(tempItem);
  });
  conData = tempFilterData;
  console.log(conData);
};
const fetchContractsData = async () => {
  try {
    const response = await axios.get(
      `https://insight.corp.hertshtengroup.com/technicals/brazilcontractsdata.js?v=${Math.random()}`
    );
    let data = response.data;
    filterCentralData(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

fetchContractsData();
server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
