const { categories } = require("../models"),
	utils = require("../utils");
require("dotenv").config();

module.exports = {
	// Add category
	createCategory: async (req, res) => {
		try {
			const data = await categories.create({
				data: {
					title: req.body.title,
				},
			});

			res.status(200).json({
				success: true,
				message: "Created!",
				categories: data,
			});
		} catch (error) {}
		console.log(error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	},

	// Display list category
	listCategories: async (req, res) => {
		try {
			const data = await categories.findMany();

			res.status(200).json({
				success: true,
				categories: data,
			});
		} catch (error) {}
	},

	// Edit category by id

	// Delete Category
};
