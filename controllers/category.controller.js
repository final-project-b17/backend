const { categories } = require("../models"),
	utils = require("../utils");

const { ImageKit } = require("../utils");

require("dotenv").config();

module.exports = {
	// Add category
	createCategory: async (req, res) => {
		try {
			const fileToString = req.file.buffer.toString("base64");
			const currentDate = new Date();
			const formattedDate = currentDate.toISOString().split("T")[0].replace(/-/g, "");
			const fileName = `thumbnail_${formattedDate}`;

			const uploadFile = await ImageKit.upload({
				fileName: fileName,
				file: fileToString,
			});
			const data = await categories.create({
				data: {
					title: req.body.title,
					thumbnail: uploadFile.url,
				},
			});

			res.status(200).json({
				success: true,
				message: "Created!",
				categories: data,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Display list category
	listCategories: async (req, res) => {
		try {
			const category = await categories.findMany();

			res.status(200).json({
				success: true,
				categories: category,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Detail Category by id
	detailCategory: async (req, res) => {
		try {
			const listCategoryId = parseInt(req.params.id);
			const listCategory = await categories.findUnique({
				where: {
					id: listCategoryId,
				},
			});

			if (!listCategory) {
				return res.status(404).json({
					success: false,
					message: "Category not found",
				});
			}

			res.json({
				success: true,
				categories: listCategory,
			});
		} catch (error) {
			console.error("Error retrieving Category: ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Edit category by id
	updateCategory: async (req, res) => {
		try {
			const categoryId = parseInt(req.params.id);

			const readCategory = await categories.findUnique({
				where: {
					id: categoryId,
				},
			});

			if (!readCategory) {
				return res.status(404).json({
					success: false,
					error: "Category not found",
				});
			}

			let updatedData = {};

			if (req.body.title) {
				updatedData.title = req.body.title;
			}

			if (req.file) {
				const fileToString = req.file.buffer.toString("base64");
				const currentDate = new Date();
				const formattedDate = currentDate.toISOString().split("T")[0].replace(/-/g, "");
				const fileName = `thumbnail_${formattedDate}`;

				const uploadFile = await ImageKit.upload({
					fileName: fileName,
					file: fileToString,
				});

				updatedData.thumbnail = uploadFile.url;
			}

			if (Object.keys(updatedData).length === 0) {
				return res.json({
					success: true,
					message: "No changes provided for update.",
				});
			}

			const updateCategory = await categories.update({
				where: {
					id: categoryId,
				},
				data: updatedData,
			});

			res.json({
				success: true,
				data: updateCategory,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Delete Category
	deleteCategory: async (req, res) => {
		try {
			const categoryId = parseInt(req.params.id);
			await categories.delete({
				where: {
					id: categoryId,
				},
			});

			res.json({
				success: true,
				message: "Category deleted successfully",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},
};
