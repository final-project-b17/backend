const { courses } = require("../models"),
	utils = require("../utils");

require("dotenv").config();

module.exports = {
	listCourse: async (req, res) => {
		try {
			const course = await courses.findMany({
				include: {
					Category: true,
					chapters: true,
					orders: true,
					comments: true,
					ratings: true,
				},
			});

			if (!course.length === 0) {
				res.status(404).json({
					success: false,
					message: "No courses found",
				});
			}

			res.json({
				status: "success",
				data: course,
			});
		} catch (error) {
			console.error("Error retrieving courses:", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	searchAndFilter: async (req, res) => {
		try {
			const { title, type_course, level, category_id } = req.query;

			const course = await courses.findMany({
				where: {
					title: { contains: title || "" },
					type_course: type_course || undefined,
					level: level || undefined,
					category_id: category_id ? parseInt(category_id, 10) : undefined,
				},
				include: {
					Category: true,
					chapters: true,
					orders: true,
					comments: true,
					ratings: true,
				},
			});

			if (!course || course.length === 0) {
				return res.json({
					success: false,
					message: "No courses found with the specified criteria",
				});
			}

			res.json({
				success: true,
				data: course,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},
};
