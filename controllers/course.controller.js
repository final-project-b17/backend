const { courses } = require("../models"),
	utils = require("../utils");

require("dotenv").config();

module.exports = {
	// Display all courses with pagination, search, filter
	listCourse: async (req, res) => {
		try {
			// Set pagination
			const page = parseInt(req.query.page) || 1;
			const pageSize = 10;
			const skip = (page - 1) * pageSize;

			// Set search
			const searchQuery = req.query.search || "";
			const searchFilter = searchQuery
				? {
						OR: [
							{
								title: {
									contains: searchQuery,
									mode: "insensitive",
								},
							},
							{
								description: {
									contains: searchQuery,
									mode: "insensitive",
								},
							},
						],
				  }
				: {};

			// Set filter by rating, price, release date, category, type, and level courses
			const filterOptions = {
				where: {
					...searchFilter,
					rating: req.query.rating ? { gte: req.query.rating } : undefined,
					price: req.query.price ? { lte: req.query.price } : undefined,
					createdAt: req.query.newlyReleased ? { gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) } : undefined,
					category_id: req.query.category ? parseInt(req.query.category) : undefined,
					type_course: req.query.typeCourse || undefined,
					level: req.query.level || undefined,
				},
				// Sort by newly created courses
				orderBy: { createdAt: "desc" },
				skip: skip,
				take: pageSize,
				include: { chapters: true, materials: true, orders: true, comments: true, ratings: true, userProgress: true },
			};

			const coursesData = await courses.findMany(filterOptions);
			const totalCoursesData = await courses.count({ where: filterOptions.where });

			if (!coursesData || coursesData.length === 0) {
				return res.json({
					success: false,
					message: "No courses found with the specified criteria",
				});
			}

			res.status(200).json({
				status: "success",
				message: "Data for all courses successfully obtained!",
				courses: coursesData,
				pagination: {
					currentPage: page,
					pageSize: pageSize,
					totalItems: totalCoursesData,
					totalPages: Math.ceil(totalCoursesData / pageSize),
				},
			});
		} catch (error) {
			console.error("Error retrieving courses: ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Get detail course with Id params
	detailCourse: async (req, res) => {
		try {
			const coursesData = await courses.findUnique({
				where: {
					id: parseInt(req.params.id),
				},
				include: {
					Category: true,
					chapters: true,
					materials: true,
					orders: true,
					comments: true,
					ratings: true,
					userProgress: true,
				},
			});

			if (!coursesData || coursesData.length === 0) {
				return res.json({
					success: false,
					message: "No courses found with the specified criteria",
				});
			}

			return res.status(200).json({
				success: true,
				message: "Success for retrieving course data",
				courses: coursesData,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Adding new course
	createCourse: async (req, res) => {
		try {
			// Check if the user has admin role
			if (req.userRole !== "admin") {
				return res.status(403).json({
					success: false,
					message: "Permission denied. Only admins can create courses.",
				});
			}

			// Validate and create the new course
			const createdCourse = await courses.create({
				data: {
					title: req.body.title,
					description: req.body.description,
					price: parseFloat(req.body.price),
					type_course: req.body.type_course,
					level: req.body.level,
					url_group: req.body.url_group,
					category_id: parseInt(req.body.category_id),
				},
			});

			res.status(201).json({
				success: true,
				message: "Course created successfully!",
				course: createdCourse,
			});
		} catch (error) {
			console.error("Error creating course: ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},
};
