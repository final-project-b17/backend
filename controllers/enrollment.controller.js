const { orders, courses, enrollments, progress, courseMaterials } = require("../models");
require("dotenv").config();

module.exports = {
	// Enrolled course by course_id
	enrollCourse: async (req, res) => {
		try {
			const userId = req.user.id;

			if (!userId) {
				return res.status(401).json({
					success: false,
					error: "Unauthorized, Login first!",
				});
			}

			const { course_id } = req.body;

			const existingEnrollment = await enrollments.findFirst({
				where: {
					user_id: userId,
					course_id: course_id,
				},
			});

			if (existingEnrollment) {
				return res.status(400).json({
					success: false,
					error: "You have already enrolled in this course.",
				});
			}

			const course = await courses.findUnique({
				where: {
					id: course_id,
				},
				include: {
					chapters: {
						include: {
							materials: true,
						},
					},
				},
			});

			if (!course) {
				return res.status(404).json({
					success: false,
					error: "Course not found.",
				});
			}

			// Check if the course is free or premium (You may need to adjust this part based on your actual model structure)
			if (course.type_course === "premium") {
				// Assuming you have an order model
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
			const newEnrollCourse = await enrollments.create({
				data: {
					user_id: userId,
					course_id,
				},
			});

			// Populate UserCourseProgress for each chapter and material in the course
			const userCourseProgressEntries = [];
			for (const chapter of course.chapters) {
				for (const material of chapter.materials) {
					userCourseProgressEntries.push({
						user_id: userId,
						course_id,
						chapter_id: chapter.id,
						course_material_id: material.id,
						is_completed: false,
					});
				}
			}

			// Insert entries into UserCourseProgress
			await progress.createMany({
				data: userCourseProgressEntries,
			});

			res.status(201).json({
				success: true,
				newEnrollCourse,
			});
		} catch (error) {
			console.error("Error creating user course progress:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Get enrolled courses history for a user with progress percentage
	getUserEnrolledCourses: async (req, res) => {
		try {
			const userId = req.user.id;

			if (!userId) {
				return res.status(401).json({
					success: false,
					error: "Unauthorized, Login first!",
				});
			}

			const userEnrollments = await enrollments.findMany({
				where: {
					user_id: userId,
				},
				include: {
					courses: {
						include: {
							materials: true,
							userProgress: true,
						},
					},
				},
			});

			const enrolledCourses = userEnrollments.map((enrollment) => {
				const { courses } = enrollment;

				if (!courses || !courses.materials) {
					console.error("Error: Courses or materials undefined for user enrollment:", enrollment);
					return {
						course: courses,
						enrolled_at: enrollment.enrolled_at,
						is_completed: enrollment.is_completed,
						progressPercentage: 0,
						userProgress: [],
					};
				}

				const userId = req.user.id;
				const userProgressForLoggedInUser = courses.userProgress.filter((progress) => progress.user_id === userId);

				const totalMaterials = new Set(courses.materials.map((material) => material.id)).size; // Use Set to get unique material IDs
				const completedMaterials = userProgressForLoggedInUser.filter((progress) => progress.is_completed).length;
				let progressPercentage = totalMaterials === 0 ? 0 : (completedMaterials / totalMaterials) * 100;

				// Ensure progress percentage doesn't exceed 100%
				progressPercentage = Math.min(progressPercentage, 100);

				return {
					course: courses,
					enrolled_at: enrollment.enrolled_at,
					is_completed: enrollment.is_completed,
					progressPercentage,
					userProgress: userProgressForLoggedInUser,
				};
			});

			res.status(200).json({
				success: true,
				enrolledCourses,
			});
		} catch (error) {
			console.error("Error retrieving user enrolled courses:", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Mark material as complete
	markMaterialAsComplete: async (req, res) => {
		try {
			const userId = req.user.id;
			const materialId = parseInt(req.params.course_material_id);

			const material = await courseMaterials.findUnique({
				where: {
					id: materialId,
				},
			});

			if (!material) {
				return res.status(404).json({
					success: false,
					error: "Material not found.",
				});
			}

			const userProgress = await progress.findFirst({
				where: {
					user_id: userId,
					course_material_id: materialId,
				},
			});

			if (!userProgress || userProgress.is_completed) {
				return res.status(400).json({
					success: false,
					error: "Material not found or already marked as complete by the user.",
				});
			}

			await progress.update({
				where: {
					id: userProgress.id,
				},
				data: {
					is_completed: true,
					completed_at: new Date().toISOString(),
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
