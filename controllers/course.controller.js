const { courses } = require("../models"),
	utils = require("../utils");

require("dotenv").config();

module.exports = {
	listCourse: async (req, res) => {
		try {
			const { category_id, search, page = 1, pageSize = 10 } = req.query;

			let where = {};

			if (category_id) {
				where = { category_id: parseInt(category_id) };
			}

			if (search) {
				where = { ...where, OR: [{ title: { contains: search } }, { description: { contains: search } }] };
			}

			const course = await courses.findMany({
				where,
				include: { videos: true, categories: true },
				skip: (page - 1) * pageSize,
				take: pageSize,
			});

			if (course.length === 0) {
				return res.status(404).json({
					message: "No courses found matching the specified criteria.",
				});
			}

			res.json(course);
		} catch (error) {
			console.error("Error retrieving courses:", error);
			res.status(500).json({
				status: "error",
				message: "Internal Server Error",
			});
		}
	},
};
