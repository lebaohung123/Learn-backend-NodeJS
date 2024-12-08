"use strict";

const HEADER = {
	API_KEY: "x-api-key",
	AUTHORIZATION: "authorization",
};

const { findById } = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
	try {
		const key = req.headers[HEADER.API_KEY]?.toString();
		if (!key) {
			return res.status(403).json({
				message: "Forbidden Error",
			});
		}
		// check objKey
		const objKey = await findById(key);
		if (!objKey) {
			return res.status(403).json({
				message: "Forbidden Error",
			});
		}
		req.objKey = objKey;
		return next();
	} catch (error) {
		return error;
	}
};

const permissons = (permissions) => {
	return (req, res, next) => {
		if (!req.objKey.permissions) {
			return res.status(403).json({
				message: "Permission Denined",
			});
		}

		console.log(`permission:: `, req.objKey.permissions);
		const validPermisson = req.objKey.permissions.includes(permissions);
		if (!validPermisson) {
			return res.status(403).json({
				message: "Permission Denined",
			});
		}
		return next();
	};
};

const asyncHandler = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

module.exports = { apiKey, permissons, asyncHandler };
