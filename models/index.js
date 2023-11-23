const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
	users: prisma.User,
	courses: prisma.Course,
	orders: prisma.Order,
	groups: prisma.Group,
	memberships: prisma.Membership,
	videos: prisma.Video,
	comments: prisma.Comment,
	ratings: prisma.Rating,
};
