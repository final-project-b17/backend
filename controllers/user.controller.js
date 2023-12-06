const { users, profiles, orders } = require("../models");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
	// Get my profile
	getMyProfile: async (req, res) => {
		const userId = req.user.id;

		try {
			const userProfile = await profiles.findUnique({
				where: {
					user_id: userId,
				},
				include: {
					user: true,
				},
			});

			if (!userProfile) {
				return res.status(404).json({
					success: false,
					error: "User not found!",
				});
			}

			return res.status(200).json(userProfile);
		} catch (error) {
			console.error("Error fetching user profile:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Get my course enrollment history
	getMyCourseHistory: async (req, res) => {
		const userId = req.user.id;

		try {
			// Assuming you have a model for course enrollments with a user_id foreign key
			const courseHistory = await orders.findMany({
				where: {
					user_id: userId,
				},
				include: {
					// Include any additional information you want from the courses
					course: true,
				},
			});

			return res.status(200).json({
				success: true,
				courseHistory,
			});
		} catch (error) {
			console.error("Error fetching user course history:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Update user profile
	updateMyProfile: async (req, res) => {
		const userId = req.user.id;
		const { name, no_telp, avatar, city, country } = req.body;

		try {
			const updatedProfile = await profiles.update({
				where: {
					user_id: userId,
				},
				data: {
					name,
					no_telp,
					avatar,
					city,
					country,
				},
			});

			return res.status(200).json(updatedProfile);
		} catch (error) {
			console.error("Error updating user profile:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Update user password
	updateMyPassword: async (req, res) => {
		const userId = req.user.id;
		const { currentPassword, newPassword } = req.body;

		try {
			const user = await users.findUnique({
				where: {
					id: userId,
				},
			});

			if (!user) {
				return res.status(404).json({
					success: false,
					error: "User not found",
				});
			}

			const passwordMatch = await bcrypt.compare(currentPassword, user.password);

			if (!passwordMatch) {
				return res.status(400).json({
					success: false,
					error: "Current password is incorrect",
				});
			}

			const hashedNewPassword = await bcrypt.hash(newPassword, 10);

			await users.update({
				where: {
					id: userId,
				},
				data: {
					password: hashedNewPassword,
				},
			});

			return res.status(200).json({
				success: true,
				message: "Password updated successfully",
			});
		} catch (error) {
			console.error("Error updating user password:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},
};
