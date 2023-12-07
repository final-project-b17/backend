const { progress, courseMaterials, orders, courses } = require("../models");
require("dotenv").config();

module.exports = {
	enrollCourse: async (req, res) => {
		try {
			// Check if user is authenticated
			const userId = req.user.id; // Assuming you have user information stored in req.user after authentication

			if (!userId) {
				return res.status(401).json({
					success: false,
					error: "Unauthorized, Login first!",
				});
			}

			const { course_id, chapter_id, course_material_id } = req.body;

			// Check if the course exists
			const course = await courses.findUnique({
				where: {
					id: course_id,
				},
			});

			if (!course) {
				return res.status(404).json({
					success: false,
					error: "Course not found.",
				});
			}

			// Check if the course is free or premium
			if (course.type_course === "premium") {
				// Check if the user has made the payment for the premium course
				const payment = await orders.findFirst({
					where: {
						user_id: userId,
						course_id: course_id,
						status: "paid",
					},
				});

				if (!payment) {
					return res.status(403).json({
						success: false,
						error: "Premium course, payment required",
					});
				}
			}

			// Create user course progress
			const newProgress = await progress.create({
				data: {
					user_id: userId,
					course_id,
					chapter_id,
					course_material_id,
				},
			});

			res.status(201).json(newProgress);
		} catch (error) {
			console.error("Error creating user course progress:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	getUserEnroll: async (req, res) => {
		try {
			const userId = req.user.id;

			// Fetch user enrollments including completed materials
			const userEnrollments = await prisma.userCourseProgress.findMany({
				where: {
					user_id: userId,
				},
				include: {
					users: true,
					courses: {
						include: {
							chapters: {
								include: {
									materials: true,
								},
							},
						},
					},
				},
			});

			// Calculate completion percentage for each enrolled course
			const calculatedEnrollments = userEnrollments.map((enrollment) => {
				const { courses } = enrollment;
				const totalMaterials = courses.chapters.reduce((acc, chapter) => acc + chapter.materials.length, 0);

				const completedMaterials = courses.chapters.reduce((acc, chapter) => {
					return acc + chapter.materials.filter((material) => material.is_complete).length;
				}, 0);

				const courseCompletionPercentage = totalMaterials > 0 ? (completedMaterials / totalMaterials) * 100 : 0;

				return {
					course_id: courses.id,
					course_name: courses.name,
					courseCompletionPercentage,
				};
			});

			res.status(200).json(calculatedEnrollments);
		} catch (error) {
			console.error("Error retrieving user enrollments:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	getUserProgress: async (req, res) => {
		try {
			const userId = req.user.id;

			// Fetch user progress including completed materials
			const courseProgress = await progress.findMany({
				where: {
					user_id: userId,
				},
				include: {
					users: true,
					courses: {
						include: {
							chapters: {
								include: {
									materials: true,
								},
							},
						},
					},
				},
			});

			// Calculate progress for each course
			const calculatedProgress = courseProgress.map((progress) => {
				const { courses } = progress;
				const totalMaterials = courses.chapters.reduce((acc, chapter) => acc + chapter.materials.length, 0);

				const completedMaterials = courses.chapters.reduce((acc, chapter) => {
					return acc + chapter.materials.filter((material) => material.is_complete).length;
				}, 0);

				const courseProgressPercentage = totalMaterials > 0 ? (completedMaterials / totalMaterials) * 100 : 0;

				return {
					...progress,
					courseProgressPercentage,
				};
			});

			res.status(200).json(calculatedProgress);
		} catch (error) {
			console.error("Error retrieving user course progress:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	materialAsComplete: async (req, res) => {
		try {
			const userId = req.user.id; // Assuming you have user information in the request

			// Extract materialId from the request parameters
			const materialId = parseInt(req.params.materialId);

			// Find the corresponding UserCourseProgress record
			const userCourseProgress = await progress.findFirst({
				where: {
					user_id: userId,
					course_material_id: materialId,
				},
			});

			if (!userCourseProgress) {
				return res.status(404).json({
					success: false,
					error: "UserCourseProgress record not found for the given materialId.",
				});
			}

			// Update the is_completed field to true
			await progress.update({
				where: {
					id: userCourseProgress.id,
				},
				data: {
					is_completed: true,
				},
			});

			res.status(200).json({
				success: true,
				message: "Material marked as complete successfully.",
			});
		} catch (error) {
			console.error("Error marking material as complete:", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},
};
