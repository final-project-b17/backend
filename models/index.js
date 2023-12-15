const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
	users: prisma.User,
	profiles: prisma.Profile,
	categories: prisma.category,
	courses: prisma.Course,
	orders: prisma.Order,
	videos: prisma.Video,
	comments: prisma.Comment,
	ratings: prisma.Rating,
	Chapter: prisma.Chapter,
	courseMaterials: prisma.CourseMaterial,
	paymentMethods: prisma.paymentMethod,
	progress: prisma.UserCourseProgress,
	enrollments: prisma.Enrollment,
};
