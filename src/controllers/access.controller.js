"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
	login = async (req, res, next) => {
		new SuccessResponse({
			metaData: await AccessService.login(req.body),
		}).send(res);
	};
	signUp = async (req, res, next) => {
		console.log(`[P]::signUp:`, req.body);
		// return
		new CREATED({
			message: "Regiserted OK!",
			metaData: await AccessService.signUp(req.body),
		}).send(res);
	};
}

module.exports = new AccessController();
