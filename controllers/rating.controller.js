const { ratings } = require("../models");

module.exports = {
	createRating: async (req, res) => {
		try {
			const userId = req.user.id;
			const { course_id, rating } = req.body;

			// Check if course_id is provided
			if (!course_id) {
				return res.status(400).json({
					success: false,
					error: "Course ID is required for creating a rating.",
				});
			}

			const newRating = await ratings.create({
				data: {
					rating,
					course: {
						connect: {
							id: course_id,
						},
					},
					user: {
						connect: {
							id: userId,
						},
					},
				},
			});

			res.json({
				success: true,
				ratings: newRating,
			});
		} catch (error) {
			console.error("Error creating rating : ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	getRatings: async (req, res) => {
		try {
			const rating = await ratings.findMany();

			res.json({
				success: true,
				data: rating,
			});
		} catch (error) {
			console.error("Error retrieving ratings : ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	getRatingId: async (req, res) => {
		try {
			const ratingId = parseInt(req.params.id);
			const rating = await ratings.findUnique({
				where: {
					id: ratingId,
				},
				include: {
					course: true,
					user: true,
				},
			});

			if (!rating) {
				return res.status(404).json({
					success: false,
					message: "Rating not found",
				});
			}

			res.json({
				success: true,
				data: rating,
			});
		} catch (error) {
			console.error("Error retrieving rating : ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	updateRatingId: async (req, res) => {
		try {
			const ratingId = parseInt(req.params.id);
			const { course_id, user_id, rating } = req.body;
			const updateRating = await ratings.update({
				where: {
					id: ratingId,
				},
				data: {
					course_id,
					user_id,
					rating,
				},
			});

			res.json({
				success: true,
				data: updateRating,
			});
		} catch (error) {
			console.error("Error updating rating : ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	deleteRatingId: async (req, res) => {
		try {
			const ratingId = parseInt(req.params.id);
			await ratings.delete({
				where: {
					id: ratingId,
				},
			});

			res.json({
				success: true,
				message: "Rating deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting rating : ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},
};
