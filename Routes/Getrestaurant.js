const express = require("express");
const Getrestaurant = require("../controller/Getrestuarant");

const RestuarantRouter = express.Router();

RestuarantRouter.get("/getrestaurant", Getrestaurant);

module.exports = RestuarantRouter;
