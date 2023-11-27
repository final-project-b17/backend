const { courses } = require("../models"),
	utils = require("../utils");

    module.exports = {
        detailCourse: async (req, res) => {
            const { id } = req.params
            try {
                const course = await courses.findUnique({
                   where:{
                    id: parseInt(id)
                   },
                    include: {
                        Category: true,
                        chapters: true,
                        orders: true,
                        comments: true,
                        ratings: true,
                    },
                });
    
                if (!course) {
                    res.status(404).json({
                        success: false,
                        message: "No courses found",
                    });
                }
    
                res.json({
                    status: "success",
                    data: course,
                });
            } catch (error) {
                console.log(error)
                console.error("Error retrieving courses:", error);
                res.status(500).json({
                    success: false,
                    error: "Internal Server Error",
                });
            }
        }
    }