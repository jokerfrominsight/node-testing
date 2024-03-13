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
const contracts = [
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
  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  setInterval(() => {
    iterationCount++;
    var randomNumber = parseInt(Math.random() * 100) + 1;
    if (randomNumber > 50) {
      const sendingData = JSON.stringify({
        contractData: contracts,
        randomNumber,
      });
      console.log(sendingData);
      io.emit("message", sendingData);
    }
  }, 10000);
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

// fetchContractsData();
server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
