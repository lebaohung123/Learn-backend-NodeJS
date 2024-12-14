"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
	SHOP: "SHOP",
	WRITER: "WRITER",
	EDITOR: "EDITOR",
	ADMIN: "ADMIN",
};

class AccessService {
	/*
		1 - check email
		2 - match password
		3 - create access token vs refresh token and save
		4 - generate tokens
		5 - get data and return login
	*/

	static login = async ({ email, password, refreshToken = null }) => {
		const foundShop = await findByEmail({ email });
		if (!foundShop) throw new BadRequestError("Shop not regitered!");

		const match = bcrypt.compare(password, foundShop.password);
		if (!match) throw new AuthFailureError("Authentication error");

		const privateKey = crypto.randomBytes(64).toString("hex");
		const publicKey = crypto.randomBytes(64).toString("hex");

		const { _id: userId } = foundShop;

		const tokens = createTokenPair({ userId, email }, publicKey, privateKey);

		await KeyTokenService.createKeyToken({
			userId,
			refreshToken: tokens.refreshToken,
			privateKey,
			publicKey,
		});

		return {
			metadata: {
				shop: getInfoData({
					fields: ["_id", "name", "email"],
					object: foundShop,
				}),
				tokens,
			},
		};
	};

	static signUp = async ({ name, email, password }) => {
		const holderShop = await shopModel.findOne({ email }).lean();
		if (holderShop) {
			throw new BadRequestError("Error: Shop already registered!");
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const newShop = await shopModel.create({
			name,
			email,
			password: passwordHash,
			roles: [RoleShop.SHOP],
		});
		if (newShop) {
			const privateKey = crypto.randomBytes(64).toString("hex");
			const publicKey = crypto.randomBytes(64).toString("hex");

			console.log({ privateKey, publicKey });
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
	};
}

module.exports = AccessService;
