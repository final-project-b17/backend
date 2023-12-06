const { progress, orders, courses } = require("../models");
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

	getUserProgress: async (req, res) => {
		try {
			const userId = req.user.id;
			const courseProgress = await progress.findMany({
				where: {
					user_id: userId,
				},
				include: {
					users: true,
					courses: true,
					chapters: true,
					materials: true,
				},
			});

			res.status(200).json(courseProgress);
		} catch (error) {
			console.error("Error retrieving user course progress:", error);
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},
};
