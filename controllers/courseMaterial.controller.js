const { courseMaterials } = require("../models");

require("dotenv").config();

module.exports = {
	// Add new courses materials
	createCourseMaterials: async (req, res) => {
		try {
			const { chapter_id, course_id, title, content, url_video } = req.body;
			const newMaterial = await courseMaterials.create({
				data: {
					chapter_id,
					course_id,
					title,
					content,
					url_video,
				},
			});
			res.status(200).json({
				success: true,
				data: newMaterial,
			});
		} catch (error) {
			console.error("Error retrieving Course Material: ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Display all courses materials
	listCourseMaterials: async (req, res) => {
		try {
			const materials = await courseMaterials.findMany();

			res.json({
				status: true,
				data: materials,
			});
		} catch (error) {
			console.error("Error retrieving Course Material:", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// List courses by id-courses
	listCourseMaterialsId: async (req, res) => {
		try {
			const materialsId = parseInt(req.params.id);
			const materials = await courseMaterials.findUnique({
				where: {
					id: materialsId,
				},
				include: {
					chapters: true,
					courses: true,
					userProgress: true,
				},
			});

			if (!materials) {
				return res.status(404).json({
					success: false,
					message: "Course Material not found",
				});
			}

			res.json({
				success: true,
				data: materials,
			});
		} catch (error) {
			console.error("Error retrieving Course Material: ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Update materials by id
	updateCourseMaterialsId: async (req, res) => {
		try {
			const materialsId = parseInt(req.params.id);
			const { title, content, url_video } = req.body;
			const updateCourseMaterials = await courseMaterials.update({
				where: {
					id: materialsId,
				},
				data: {
					title,
					content,
					url_video,
				},
			});

			res.json({
				success: true,
				data: updateCourseMaterials,
			});
		} catch (error) {
			console.error("Error updating Course Material : ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Delete material by id
	deleteCourseMaterialsId: async (req, res) => {
		try {
			const materialsId = parseInt(req.params.id);
			await courseMaterials.delete({
				where: {
					id: materialsId,
				},
			});

			res.json({
				success: true,
				message: "Course Materials deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting Course Materials : ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},
};
