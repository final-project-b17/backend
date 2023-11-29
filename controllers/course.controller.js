const { courses } = require("../models"),
	utils = require("../utils");
require("dotenv").config();

const ITEMS_PER_PAGE = 10;
module.exports = {
	// Display all courses with pagination
	listCourse: async (req, res) => {
		try {
			// set pagination
			const page = parseInt(req.query.page) || 1;
			const pageSize = 10;
			const skip = (page - 1) * pageSize;

			// set search
			const searchQuery = req.query.search;
			const searchFilter = searchQuery
				? {
						OR: [{ title: { contains: searchQuery, mode: "insensitive" } }, { description: { contains: searchQuery, mode: "insensitive" } }],
				  }
				: {};

			// set Filter by rating, price, release date, category, type, and level courses
			const filterOptions = {
				where: {
					...searchFilter,
					rating: req.query.rating ? { gte: parseFloat(req.query.rating) } : undefined,
					price: req.query.price ? { lte: parseFloat(req.query.price) } : undefined,
					createdAt: req.query.newlyReleased ? { gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) } : undefined,
					category_id: req.query.category ? parseInt(req.query.category) : undefined,
					type_course: req.query.typeCourse ? req.query.typeCourse : undefined,
					level: req.query.level ? req.query.level : undefined,
				},
				// sort
				orderBy: { id: "asc" },
				skip: skip,
				take: pageSize,
				include: { chapters: true, materials: true, orders: true, comments: true, ratings: true, userProgress: true },
			};

			const coursesData = await courses.findMany(filterOptions);
			const totalCoursesData = await courses.count({ where: filterOptions.where });

			res.status(200).json({
				status: "success",
				message: "Data semua kursus berhasil didapatkan",
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

	// Display courses with pagination
	listCoursesWithPagination: async (req, res) => {
		try {
			const page = parseInt(req.params.page) || 1;
			const skip = (page - 1) * ITEMS_PER_PAGE;

			const course = await courses.findMany({
				include: {
					Category: true,
					chapters: true,
					orders: true,
					comments: true,
					ratings: true,
				},
				skip,
				take: ITEMS_PER_PAGE,
			});

			if (!course.length === 0) {
				return res.status(404).json({
					success: false,
					message: "No courses found",
				});
			}

			res.json({
				status: "success",
				data: course,
			});
		} catch (error) {
			console.error("Error retrieving courses: ", error);
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
