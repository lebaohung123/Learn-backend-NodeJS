"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helper/check.connect");

const connectString = `mongodb+srv://baohung01:%40Abcabc123@cluster0.ohy5w.mongodb.net/`;

class Database {
	constructor() {
		this.connect();
	}

	connect(type = "mongodb") {
		//dev
		if (1 === 1) {
			mongoose.set("debug", true);
			mongoose.set("debug", { color: true });
		}
		mongoose
			.connect(connectString, {
				maxPoolSize: 50,
			})
			.then((_) => {
				countConnect();
				console.log("Connected Mongodb Success");
			})
			.catch((err) => console.log("Error Connect"));
	}
	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}

		return Database.instance;
	}
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
