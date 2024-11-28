"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

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
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })

                console.log({privateKey, publicKey}) // save collections KEYSTORE
            }
		} catch (error) {
			return {
				code: "xxx",
				message: error.message,
				status: "error",
			};
		}
	};
}

module.exports = AccessService;
