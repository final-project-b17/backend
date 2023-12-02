const { users } = require("../models"),
	utils = require("../utils"),
	jwt = require("jsonwebtoken"),
	bcrypt = require("bcrypt");
require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";
const nodemailer = require("nodemailer");

module.exports = {
	register: async (req, res) => {
		try {
			const existingUser = await users.findUnique({
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
			const register = await users.create({
				data: {
					username: req.body.username, //ubah dari name ke username
					email: req.body.email,
					password: hashedPassword,
					role: req.body.role,
					createdAt: new Date(),
				},
			});

			return res.status(201).json({
				user: register,
				message: "Registered Successful",
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	},

	login: async (req, res) => {
		try {
			const findUser = await users.findFirst({
				where: {
					email: req.body.email,
				},
			});

			if (!findUser) {
				return res.status(404).json({
					error: "Your email is not registered in our system",
				});
			}

			if (bcrypt.compareSync(req.body.password, findUser.password)) {
				const token = jwt.sign({ id: findUser.id }, secret_key, { expiresIn: "6h" });

				return res.status(200).json({
					data: {
						token,
					},
				});
			}

			return res.status(403).json({
				error: "Invalid credentials",
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	},

	resetPassword: async (req, res) => {
		try {
			const findUser = await users.findFirst({
				where: {
					email: req.body.email,
				},
			});

			if (!findUser) {
				return res.status(400).json({
					error: true,
					errorMessage: "User not found!",
				});
			}

			const resetPasswordToken = await utils.cryptPassword(req.body.email);

			await users.update({
				data: {
					resetPasswordToken,
				},
				where: {
					id: findUser.id,
				},
			});

			const transporter = nodemailer.createTransport({
				host: process.env.EMAIL_HOST,
				port: process.env.EMAIL_PORT,
				secure: false,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD,
				},
			});

			const mailOptions = {
				from: "system@gmail.com",
				to: req.body.email,
				subject: "Reset Password",
				html: `<p>Reset Password <a href="http://localhost:3000/set-password/${resetPasswordToken}">Click Here</a></p>`,
			};

			transporter.sendMail(mailOptions, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						error: true,
						errorMessage: "Invalid or expired reset key!",
					});
				}

				return res.status(200).json({
					success: true,
					successMessage: "Password reset link was sent to your email!",
				});
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: true,
				errorMessage: "An error occurred",
			});
		}
	},

	setPassword: async (req, res) => {
		try {
			const findUser = await users.findFirst({
				where: {
					resetPasswordToken: req.body.key,
				},
			});

			if (!findUser) {
				return res.status(400).json({
					error: true,
					errorMessage: "Invalid or expired reset key!",
				});
			}

			await users.update({
				data: {
					password: await utils.cryptPassword(req.body.password),
					resetPasswordToken: null,
				},
				where: {
					id: findUser.id,
				},
			});

			return res.status(200).json({
				success: true,
				successMessage: "Password reset was successful!",
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: true,
				errorMessage: "An error occurred",
			});
		}
	},
};
