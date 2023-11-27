const { courses } = require("../models"); 

const ITEMS_PER_PAGE = 10

module.exports = {
    listCoursesWithPagination: async (req, res) => {
        try {
            const page = parseInt(req.params.page) || 1
            const skip = (page -1) * ITEMS_PER_PAGE;

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

            if(!course.length === 0) {
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
            console.error("Error retrieving courses: ", error)
            res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    }
}
