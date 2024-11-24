require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const { countConnect, checkoverLoad } = require("./helper/check.connect");

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init db
require("./dbs/init.mongodb");
checkoverLoad();
// countConnect();

//init routers

app.get("/", (req, res) => {
	res.send("Welcome to the eCommerce server");
});

//handling errors

module.exports = app;
