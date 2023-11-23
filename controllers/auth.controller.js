const { users } = require("../models");
const jwt = require("jsonwebtoken");
const utils = require("../utils");

module.exports = {
	register: async (req, res) => {
		try {
			const existingUser = await users.findFirst({
				where: {
					email: req.body.email,
				},
			});

			if (existingUser) {
				return res.status(500).json({
					error: "User already exist!",
				});
			}
			const hashedPassword = await utils.cryptPassword(req.body.password);
			const data = await users.create({
				data: {
					name: req.body.name,
					email: req.body.email,
					password: hashedPassword,
					role: req.body.role,
					createdAt: new Date(),
				},
			});

			return res.status(201).json({
				data,
				message: "Successfully",
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error,
			});
		}
	},
};
