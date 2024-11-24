"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;

//Count connect
const countConnect = () => {
	const numConnection = mongoose.connections.length;
	console.log(`Number of connections: ${numConnection}`);
};

//Check overload connect
const checkoverLoad = () => {
	setInterval(() => {
		const numConnection = mongoose.connections.length;
		const numCores = os.cpus().length;
		const memoryUse = process.memoryUsage().rss;
		//Example maximum number of connections based on number osf cores
        // console.log(`numCores `,numCores)
		console.log(`Active connection: ${numConnection}`);
		console.log(`Memory use: ${memoryUse / 1024 / 1024} MB`);
		const maxConnections = numCores * 5;
		if (numConnection > maxConnections) {
			console.log("Connection overload detected!");
		}
	}, _SECOND); //Monitor every 5 seconds
};

module.exports = { countConnect, checkoverLoad };
