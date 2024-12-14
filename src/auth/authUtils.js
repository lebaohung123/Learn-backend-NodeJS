"use strict";
const jwt = require("jsonwebtoken");

const createTokenPair = (payload, publicKey, privateKey) => {
	try {
		// accessToken
		const accessToken = jwt.sign(payload, publicKey, {
			expiresIn: "2 days",
		});

		const refreshToken = jwt.sign(payload, privateKey, {
			expiresIn: "7 days",
		});

		//

		jwt.verify(accessToken, publicKey, (err, decode) => {
			if (err) {
				console.error(`error verify::`, err);
			} else {
				console.log(`decode verfify::`, decode);
			}
		});
		return { accessToken, refreshToken };
	} catch (error) {}
};

module.exports = { createTokenPair };
