const { users, profiles } = require("../models"),
	utils = require("../utils"),
	jwt = require("jsonwebtoken"),
	bcrypt = require("bcrypt");
require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";
const nodemailer = require("nodemailer");

const generateOTP = () => {
	// Generate a random 4-digit number
	const otp = Math.floor(1000 + Math.random() * 9000);
	return otp.toString(); // Convert to string to ensure it is always 4 digits
};

module.exports = {
	register: async (req, res) => {
		try {
			// Check if email exists
			const existingEmail = await users.findFirst({
				where: {
					email: req.body.email,
				},
			});

			// Check if username exists
			const existingUsername = await users.findFirst({
				where: {
					username: req.body.username,
				},
			});

			// Error if email or username exists
			if (existingEmail) {
				return res.status(500).json({
					success: false,
					error: "Email already exists!",
				});
			}

			if (existingUsername) {
				return res.status(500).json({
					success: false,
					error: "Username already exists!",
				});
			}

			// Hashing password
			const hashedPassword = await utils.cryptPassword(req.body.password);

			// Create user
			const register = await users.create({
				data: {
					username: req.body.username,
					email: req.body.email,
					password: hashedPassword,
					role: req.body.role,
					createdAt: new Date(),
				},
			});

			// Generate OTP
			const otp = generateOTP();

			// fill value otp_code on table
			await users.update({
				data: {
					otp_code: otp,
				},
				where: {
					id: register.id,
				},
			});

			// Create user profile (assuming profile fields are provided in req.body)
			const userProfile = await profiles.create({
				data: {
					user_id: register.id,
					name: req.body.profile.name,
					no_telp: req.body.profile.no_telp,
					avatar: req.body.profile.avatar,
					city: req.body.profile.city,
					country: req.body.profile.country,
				},
			});

			// Send email with OTP
			const transporter = nodemailer.createTransport({
				service: "gmail",
				host: process.env.EMAIL_HOST,
				port: process.env.EMAIL_PORT,
				secure: false,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD,
				},
			});

			// Configure the email sent
			const mailOptions = {
				from: "noreply@staging-pedjualilmu.up.railwapp.app",
				to: req.body.email,
				subject: "Email Verification",
				html: `<p>Your OTP for email verification is: ${otp}</p>`,
			};

			transporter.sendMail(mailOptions, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						error: true,
						errorMessage: "Failed to send verification email",
					});
				}

				return res.status(201).json({
					user: register,
					profile: userProfile,
					message: "Registered Successful. Email verification sent.",
				});
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	login: async (req, res) => {
		try {
			// Check if email already exist?
			const findUser = await users.findUnique({
				where: {
					email: req.body.email,
				},
			});

			if (!findUser) {
				return res.status(404).json({
					success: false,
					error: "Your email is not registered in our system",
				});
			}

			// Check email, user and is_verified
			if (bcrypt.compareSync(req.body.password, findUser.password)) {
				if (!findUser.is_verified) {
					return res.status(403).json({
						success: false,
						error: "Email not verified. Please verify your email first.",
					});
				}

				// Generate token
				const token = jwt.sign({ id: findUser.id }, secret_key, { expiresIn: "6h" });

				return res.status(200).json({
					data: {
						token,
					},
				});
			}

			res.status(403).json({
				success: false,
				error: "Invalid Credentials",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	resetPassword: async (req, res) => {
		try {
			// Check email already exist?
			const findUser = await users.findFirst({
				where: {
					email: req.body.email,
				},
			});

			if (!findUser) {
				return res.status(404).json({
					error: true,
					errorMessage: "User not found!",
				});
			}

			// Generate reset password token
			const resetPasswordToken = await utils.cryptPassword(req.body.email);

			// fill resetPasswordToken on table
			await users.update({
				data: {
					resetPasswordToken,
				},
				where: {
					id: findUser.id,
				},
			});

			const transporter = nodemailer.createTransport({
				service: "gmail",
				host: process.env.EMAIL_HOST,
				port: process.env.EMAIL_PORT,
				secure: false,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD,
				},
			});

			const mailOptions = {
				from: "reset-password@pedjuangilmu.up.railway.app",
				to: req.body.email,
				subject: "Reset Password",
				html: `<p>Reset Password <a href="/api/v1/set-password/${resetPasswordToken}">Click Here</a></p>`,
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
			// Check resetPasswordToken user
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

			// Update password and set null on resetPasswordToken fields
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

	verifyEmail: async (req, res) => {
		try {
			// Check email and otp same on system && user already exist?
			const { email, otp } = req.body;

			const user = await users.findFirst({
				where: {
					email: email,
					otp_code: otp,
				},
			});

			if (!user) {
				return res.status(400).json({
					error: true,
					errorMessage: "Invalid OTP",
				});
			}

			// Mark the user as verified
			await users.update({
				data: {
					is_verified: true,
					otp_code: null, // Clear the OTP after successful verification
				},
				where: {
					id: user.id,
				},
			});

			return res.status(200).json({
				success: true,
				successMessage: "Email verification successful",
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: true,
				errorMessage: "An error occurred during email verification",
			});
		}
	},

	resendOTP: async (req, res) => {
		try {
			// Check if user is'nt verified and user already exist?
			const { email } = req.body;

			const user = await users.findFirst({
				where: {
					email: email,
					is_verified: false, // Only allow resend if the email is not verified
				},
			});

			if (!user) {
				return res.status(400).json({
					error: true,
					errorMessage: "User not found or email is already verified",
				});
			}

			// Generate a new OTP
			const newOTP = generateOTP();

			// Update the user record with the new OTP
			await users.update({
				data: {
					otp_code: newOTP,
				},
				where: {
					id: user.id,
				},
			});

			// Send email with the new OTP
			const transporter = nodemailer.createTransport({
				service: "gmail",
				host: process.env.EMAIL_HOST,
				port: process.env.EMAIL_PORT,
				secure: false,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD,
				},
			});

			const mailOptions = {
				from: "noreply@staging-pedjualilmu.up.railwapp.app",
				to: email,
				subject: "Resend OTP for Email Verification",
				html: `<p>Your new OTP for email verification is: ${newOTP}</p>`,
			};

			transporter.sendMail(mailOptions, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						error: true,
						errorMessage: "Failed to resend OTP",
					});
				}

				return res.status(200).json({
					success: true,
					successMessage: "New OTP sent successfully",
				});
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: true,
				errorMessage: "An error occurred during OTP resend",
			});
		}
	},
};
