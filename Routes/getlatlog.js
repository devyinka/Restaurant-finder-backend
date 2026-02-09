const express = require("express");
const latlogrouter = express.Router();
const getLatLog = require("../controller/getlatlog");
latlogrouter.post("/getlatlog", getLatLog);
latlogrouter.get("/getlatlog", getLatLog);
module.exports = latlogrouter;
