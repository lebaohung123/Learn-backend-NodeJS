"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { type } = require("os");
const { getInfoData } = require("../utils");

const RoleShop = {
	SHOP: "SHOP",
	WRITER: "WRITER",
	EDITOR: "EDITOR",
	ADMIN: "ADMIN",
};

class AccessService {
	static signUp = async ({ name, email, password }) => {
		try {
			// step1: check email exists?
			// lean giup tra ve nhanh hon vi no chi tra ve 1 obj thuan tuy
			const holderShop = await shopModel.findOne({ email }).lean();
			if (holderShop) {
				return {
					code: "xxxx",
					message: "Shop already registered!",
				};
			}

			const passwordHash = await bcrypt.hash(password, 10);
			const newShop = await shopModel.create({
				name,
				email,
				password: passwordHash,
				roles: [RoleShop.SHOP],
			});
			if (newShop) {
				// create privateKey, publickey
				// const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
				// 	modulusLength: 4096,
				// 	publicKeyEncoding: {
				// 		type: "pkcs1",
				// 		format: "pem",
				// 	},
				// 	privateKeyEncoding: {
				// 		type: "pkcs1",
				// 		format: "pem",
				// 	},
				// });

				const privateKey = crypto.randomBytes(64).toString("hex");
				const publicKey = crypto.randomBytes(64).toString("hex");

				// public key cryptoGraphy standards !

				console.log({ privateKey, publicKey }); // save collections KEYSTORE
				const keyStore = await KeyTokenService.createKeyToken({
					userId: newShop._id,
					publicKey,
					privateKey,
				});
				if (!keyStore) {
					return {
						code: "xxxx",
						message: "keyStore error",
					};
				}

				// create tokens pair
				const tokens = await createTokenPair(
					{ userId: newShop._id, email },
					publicKey,
					privateKey
				);
				console.log(`Created Token Success:: `, tokens);
				return {
					code: 201,
					metadata: {
						shop: getInfoData({
							fields: ["_id", "name", "email"],
							object: newShop,
						}),
						tokens,
					},
				};
			}

			return {
				code: 200,
				metadata: null,
			};
		} catch (error) {
			console.error(error);
			return {
				code: "xxx",
				message: error.message,
				status: "error",
			};
		}
	};
}

module.exports = AccessService;
